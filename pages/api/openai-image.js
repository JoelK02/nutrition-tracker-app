import OpenAI from "openai";

const openai = new OpenAI(process.env.OPENAI_API_KEY);

const MAX_RETRIES = 3;

async function retryOpenAIRequest(requestFunction) {
  let lastError;
  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      return await requestFunction();
    } catch (error) {
      console.error(`Attempt ${i + 1} failed:`, error);
      lastError = error;
      // Wait for a short time before retrying
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
  throw lastError; // If all retries fail, throw the last error
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { imageUrl } = req.body;
    console.log("imageUrl", imageUrl);

    // Get a description of the image
    const descriptionResponse = await retryOpenAIRequest(() => 
      openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a food expert. Describe the food item and the estimated weight in grams, if possible. Do not include any other information. Within 40 tokens"
          },
          {
            role: "user",
            content: [
              { type: "text", text: "Describe the food item in this image." },
              {
                type: "image_url",
                image_url: {
                  "url": imageUrl,
                  "detail": "low"
                },
              },
            ],
          },
        ],
        max_tokens: 40,
      })
    );

    const description = descriptionResponse.choices[0].message.content;
    console.log("Food description:", description);

    // Get the nutritional information
    const nutritionResponse = await retryOpenAIRequest(() => 
      openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a food nutrition expert. When an image is provided, respond with the nutrient facts (calories, protein, carbs, fat). Always return the information in a structured JSON format with keys: 'calories', 'protein', 'carbs', and 'fat'."
          },
          {
            role: "user",
            content: [
              { type: "text", text: "Provide nutritional information for the food item in this image." },
              {
                type: "image_url",
                image_url: {
                  "url": imageUrl,
                  "detail": "low"
                },
              },
            ],
          },
        ],
        max_tokens: 300,
      })
    );

    let data = nutritionResponse.choices[0].message.content;
    console.log("Raw API response:", data);

    // Remove any non-JSON content
    data = data.replace(/^[\s\S]*?(\{[\s\S]*\})[\s\S]*$/, '$1');
    console.log("data", data);
    // Parse the response to ensure it is valid JSON
    let parsedData;
    try {
      parsedData = JSON.parse(data);
    } catch (e) {
      console.error('Error parsing JSON:', e);
      return res.status(500).json({ message: 'Invalid response format', error: e });
    }

    // Ensure the response contains the expected keys
    const expectedKeys = ['calories', 'protein', 'carbs', 'fat'];
    const hasAllKeys = expectedKeys.every(key => key in parsedData);

    if (!hasAllKeys) {
      console.error('Incomplete response:', parsedData);
      return res.status(500).json({ message: 'Incomplete response', data: parsedData });
    }

    // Add the description to the response
    parsedData.description = description;

    res.status(200).json(parsedData);
  } catch (error) {
    console.error('Error processing image:', error);
    res.status(500).json({ message: 'Error processing image', error: error.message });
  }
}