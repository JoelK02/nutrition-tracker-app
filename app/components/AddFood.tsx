import React, { useState, useRef  } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Camera } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';


// Update FoodEntry type to remove type, time, and created_at
interface FoodEntry {
  id: number;          // Add id to match database
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  created_at: string; 
}

interface AddFoodProps {
  foodEntries: FoodEntry[];
  setFoodEntries: React.Dispatch<React.SetStateAction<FoodEntry[]>>;
}

const AddFood: React.FC<AddFoodProps> = ({ foodEntries, setFoodEntries }) => {
  const [newFood, setNewFood] = useState({
    calories: '',
    protein: '',
    carbs: '',
    fat: ''
  });

  const [imageUrl, setImageUrl] = useState(''); // Store image URL
  const [loading, setLoading] = useState(false); // Loading state for processing

  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTakePicture = async () => {
    if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        // For demonstration, we'll just log that camera access was granted
        console.log('Camera access granted');
        // In a real implementation, you would show a video stream and allow the user to capture
        // For now, we'll trigger the file input click to open the camera
        if (fileInputRef.current) {
          fileInputRef.current.click();
        }
        // Don't forget to stop the stream
        stream.getTracks().forEach(track => track.stop());
      } catch (error) {
        console.error('Error accessing camera:', error);
        alert('Unable to access camera. Please check your permissions.');
      }
    } else {
      // Fallback for devices that don't support getUserMedia
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      // You might want to show a preview of the image here
      console.log('Image file selected:', file.name);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewFood({ ...newFood, [name]: value });
  };

  const handleImageUpload = async () => {
    if (!imageUrl) {
      alert('Please provide an image URL.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/openai-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl }) // Send image URL to API
      });

      const result = await response.json();
      console.log('AI result:', result);

      // Assuming the result contains food information and nutrients
      const { calories, protein, carbs, fat } = result;

      // Update form fields with the returned food information
      setNewFood({
        calories: calories.toString() || '',
        protein: protein.toString() || '',
        carbs: carbs.toString() || '',
        fat: fat.toString() || '',
      });
    } catch (error) {
      console.error('Error processing image:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFood = async () => {
    // Simple validation: Check if all required fields are filled and numeric values are valid
    if (!newFood.calories || !newFood.protein || !newFood.carbs || !newFood.fat) {
      alert("Please fill in all fields before adding a food entry.");
      return; // Stop execution if validation fails
    }

    // Ensure numeric fields (calories, protein, carbs, fat) are valid numbers
    const parsedCalories = parseInt(newFood.calories, 10);
    const parsedProtein = parseInt(newFood.protein, 10);
    const parsedCarbs = parseInt(newFood.carbs, 10);
    const parsedFat = parseInt(newFood.fat, 10);

    if (isNaN(parsedCalories) || isNaN(parsedProtein) || isNaN(parsedCarbs) || isNaN(parsedFat)) {
      alert("Please enter valid numbers for calories, protein, carbs, and fat.");
      return; // Stop execution if validation fails
    }

    // Prepare the new entry
    const newEntry = {
      calories: parsedCalories,
      protein: parsedProtein,
      carbs: parsedCarbs,
      fat: parsedFat,
    };

    // Insert into Supabase
    const { data, error } = await supabase
      .from("food_entries")
      .insert([newEntry])
      .select(); // This requests that the inserted row(s) be returned

    if (error) {
      console.error("Error saving food entry:", error.message);
    } else {
      console.log("Food entry saved:", data);
      // Update state with the new entry including created_at from Supabase
      setFoodEntries([...foodEntries, data[0]]);
      // Clear form
      setNewFood({ calories: "", protein: "", carbs: "", fat: "" });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg"
          style={{ backgroundColor: '#10B981' }}
        >
          <Plus size={24} color="white" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Add Food Entry</DialogTitle>
        <div className="grid gap-4">
          <Input name="calories" value={newFood.calories} onChange={handleInputChange} placeholder="Calories" />
          <Input name="protein" value={newFood.protein} onChange={handleInputChange} placeholder="Protein" />
          <Input name="carbs" value={newFood.carbs} onChange={handleInputChange} placeholder="Carbs" />
          <Input name="fat" value={newFood.fat} onChange={handleInputChange} placeholder="Fat" />

          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            ref={fileInputRef}
            style={{ display: 'none' }}
          />

          <Button onClick={handleTakePicture} disabled={loading}>
            <Camera className="mr-2" size={18} />
            {loading ? 'Processing...' : 'Take Picture'}
          </Button>

          {imageFile && (
            <div className="text-sm text-gray-500">
              Selected: {imageFile.name}
            </div>
          )}

          <Button onClick={handleImageUpload} disabled={loading}>
            {loading ? 'Processing...' : 'Upload Image & Detect Nutrients'}
          </Button>

          <Button onClick={handleAddFood} className="mt-4">
            Add Food
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddFood;