import React, { useState } from 'react'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'

// Update FoodEntry type to include id and created_at
interface FoodEntry {
  id: number;          // Add id to match database
  type: string;
  time: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  created_at: string | number;   // Add created_at to match the existing data
}

const AddFood = ({ foodEntries, setFoodEntries }: { foodEntries: FoodEntry[], setFoodEntries: React.Dispatch<React.SetStateAction<FoodEntry[]>> }) => {
  const [newFood, setNewFood] = useState<Omit<FoodEntry, 'id' | 'created_at'>>({
    type: '',
    time: '',
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  });

  const [imageUrl, setImageUrl] = useState(''); // Store image URL
  const [loading, setLoading] = useState(false); // Loading state for processing

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Check if the field is a number and handle it accordingly
    const isNumericField = ['calories', 'protein', 'carbs', 'fat'].includes(name);
    setNewFood({ ...newFood, [name]: isNumericField ? parseInt(value, 10) || 0 : value });
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
      const { type, calories, protein, carbs, fat } = result;

      // Update form fields with the returned food information
      setNewFood({
        type: type || newFood.type,
        time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
        calories: calories || 0,
        protein: protein || 0,
        carbs: carbs || 0,
        fat: fat || 0,
      });
    } catch (error) {
      console.error('Error processing image:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFood = async () => {
    const newEntry = {
      ...newFood,
      id: Date.now(),  // Generate a temporary id for the new entry
      created_at: new Date().toISOString(), // Use current date for created_at
    };

    const { data, error } = await supabase
      .from("food_entries")
      .insert([newEntry])
      .select();

    if (error) {
      console.error("Error saving food entry:", error.message);
    } else {
      setFoodEntries([...foodEntries, data[0]]); // Append new entry to the list
      setNewFood({ type: "", time: "", calories: 0, protein: 0, carbs: 0, fat: 0 }); // Reset form fields
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
          <Input 
            placeholder="Image URL" 
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)} // Handle image URL input
          />

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
