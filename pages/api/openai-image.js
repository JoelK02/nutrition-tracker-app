// pages/api/openai-image.js
import OpenAI from "openai";

const openai = new OpenAI(process.env.OPENAI_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { imageUrl } = req.body;

    // Send a system message to instruct the model to return only nutrient facts
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",  // GPT-4o model variant
      messages: [
        {
          role: "system",
          content: "You are a food nutrition expert. When an image is provided, respond only with the nutrient facts (calories, protein, carbs, fat) and no other information. Always return the nutrient facts in a structured JSON format."
        },
        {
          role: "user",
          content: [
            { type: "text", text: "Describe the food items in this image and provide nutritional information." },
            {
              type: "image_url",
              image_url: {
                "url": imageUrl,
                "detail": "low"  // Optional detail level
              },
            },
          ],
        },
      ],
    });


    // Get response from OpenAI and return
    const data = response.choices[0];
    res.status(200).json(data);
  } catch (error) {
    console.error('Error processing image:', error);
    res.status(500).json({ message: 'Error processing image', error });
  }
}
