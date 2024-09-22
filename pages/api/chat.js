// pages/api/chat.js
import { OpenAI } from 'openai';
import formidable from 'formidable';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false, // Disable default body parser for image uploads
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Error parsing form:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    const file = files.file; // Access the uploaded image file
    const filePath = "https://www.allrecipes.com/thmb/3cixVDmAtbb2hYxoFLVJ4VPQ7rA=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/143809-best-steak-marinade-in-existence-ARMag-1x1-1-8105b6b8e5cb4931ba8061f0425243dd.jpg";

    try {
      const openai = new OpenAI(process.env.OPENAI_API_KEY);

      // Sending the image file for analysis with GPT-4 Vision
      const response = await openai.images.createChatCompletion({
        file: fs.createReadStream(filePath), // Read the image file
        model: 'gpt-4-vision', // Use GPT-4 Vision model
        messages: [{ role: 'system', content: 'Describe the food items in this image and provide nutritional information.' }],
      });

      const foodData = response.choices[0].message.content;

      res.status(200).json({ foodData });
    } catch (error) {
      console.error('Error processing image:', error);
      res.status(500).json({ message: 'Error processing image' });
    }
  });
}
