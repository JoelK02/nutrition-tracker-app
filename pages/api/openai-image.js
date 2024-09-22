import formidable from 'formidable';
import fs from 'fs';
import { OpenAI } from 'openai';

export const config = {
  api: {
    bodyParser: false, // Disable bodyParser for file uploads
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const form = formidable({
    multiples: false, // We are not expecting multiple files
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Error parsing form:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    // Log to check the file structure
    console.log('Parsed file:', files);

    // Access the file from the array
    const file = files.file ? files.file[0] : null; // Get the first file if present

    if (!file || !file.filepath) {
      console.error('File not found or invalid.');
      return res.status(400).json({ message: 'No file uploaded or invalid file format.' });
    }

    const filePath = file.filepath; // This should provide the path to the uploaded file

    try {
      const openai = new OpenAI(process.env.OPENAI_API_KEY);

      // Sending the image file for analysis with GPT-4 Vision
      const response = await openai.images.createChatCompletion({
        model: 'gpt-4-vision', // Use GPT-4 Vision model (ensure the correct model is used)
        messages: [
          {
            role: 'user',
            content: 'Describe the food items in this image and provide nutritional information.',
          },
        ],
        file: fs.createReadStream(filePath), // Read the image file
      });

      const foodData = response.choices[0].message.content;

      res.status(200).json({ foodData });
    } catch (error) {
      console.error('Error processing image:', error);
      res.status(500).json({ message: 'Error processing image' });
    }
  });
}
