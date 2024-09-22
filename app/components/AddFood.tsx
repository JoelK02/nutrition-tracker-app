// components/AddFood.tsx

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient'; // Import Supabase client

const AddFood = ({ foodEntries, setFoodEntries }) => {
  const [newFood, setNewFood] = useState({
    type: '',
    time: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: ''
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null); // State for storing selected image
  const [loading, setLoading] = useState(false); // Loading state for processing

  // Handle file input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  // Function to upload the image and send it to ChatGPT for processing
  const handleImageUpload = async () => {
    if (!selectedImage) {
      alert('Please select an image.');
      return;
    }
    
    setLoading(true);
  
    const formData = new FormData();
    formData.append('file', selectedImage);
  
    try {
      const response = await fetch('/api/openai-image', {
        method: 'POST',
        body: formData
      });
  
      const result = await response.json();
  
      // Assuming GPT API returns nutrients or description
      const { foodData } = result;
  
      console.log(foodData); // Here you can process the returned data
  
      // Example: Update form fields with detected food information
      setNewFood({
        ...newFood,
        type: foodData.type || newFood.type,
        calories: foodData.calories || '',
        protein: foodData.protein || '',
        carbs: foodData.carbs || '',
        fat: foodData.fat || '',
      });
      
    } catch (error) {
      console.error('Error processing image:', error);
    } finally {
      setLoading(false);
    }
  }
  

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewFood({ ...newFood, [name]: value });
  };

  const handleAddFood = async () => {
    // Simple validation to ensure fields are filled
    if (!newFood.type || !newFood.time || !newFood.calories || !newFood.protein || !newFood.carbs || !newFood.fat) {
      alert("Please fill in all fields before adding a food entry.");
      return;
    }

    const parsedCalories = parseInt(newFood.calories, 10);
    const parsedProtein = parseInt(newFood.protein, 10);
    const parsedCarbs = parseInt(newFood.carbs, 10);
    const parsedFat = parseInt(newFood.fat, 10);

    if (isNaN(parsedCalories) || isNaN(parsedProtein) || isNaN(parsedCarbs) || isNaN(parsedFat)) {
      alert("Please enter valid numbers for calories, protein, carbs, and fat.");
      return;
    }

    const newEntry = {
      type: newFood.type,
      time: newFood.time,
      calories: parsedCalories,
      protein: parsedProtein,
      carbs: parsedCarbs,
      fat: parsedFat,
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("food_entries")
      .insert([newEntry])
      .select();

    if (error) {
      console.error("Error saving food entry:", error.message);
    } else {
      console.log("Food entry saved:", data);
      setFoodEntries([...foodEntries, data[0]]);
      setNewFood({ type: "", time: "", calories: "", protein: "", carbs: "", fat: "" });
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
          <Input 
            placeholder="Meal Type (e.g. Breakfast)" 
            name="type" 
            value={newFood.type} 
            onChange={handleInputChange}
          />
          <Input 
            placeholder="Time (e.g. 08:00)" 
            name="time" 
            value={newFood.time} 
            onChange={handleInputChange}
          />
          <Input 
            placeholder="Calories" 
            name="calories" 
            value={newFood.calories} 
            onChange={handleInputChange} 
          />
          <Input 
            placeholder="Protein (g)" 
            name="protein" 
            value={newFood.protein} 
            onChange={handleInputChange} 
          />
          <Input 
            placeholder="Carbs (g)" 
            name="carbs" 
            value={newFood.carbs} 
            onChange={handleInputChange} 
          />
          <Input 
            placeholder="Fat (g)" 
            name="fat" 
            value={newFood.fat} 
            onChange={handleInputChange} 
          />
          
          {/* File upload input */}
          <input type="file" onChange={handleFileChange} />
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
