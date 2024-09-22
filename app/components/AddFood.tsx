import React, { useState } from 'react'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus } from 'lucide-react'

const AddFood = ({ foodEntries, setFoodEntries }) => {
  const [newFood, setNewFood] = useState({
    type: '',
    time: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: ''
  });
  const [imageUrl, setImageUrl] = useState(''); // Store image URL
  const [loading, setLoading] = useState(false); // Loading state for processing

  // Handle image URL input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewFood({ ...newFood, [name]: value });
  }

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
        calories: calories || '',
        protein: protein || '',
        carbs: carbs || '',
        fat: fat || '',
      });
    } catch (error) {
      console.error('Error processing image:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleAddFood = async () => {
    // Add validation if needed
    const newEntry = {
      type: newFood.type,
      time: newFood.time,
      calories: newFood.calories,
      protein: newFood.protein,
      carbs: newFood.carbs,
      fat: newFood.fat,
      created_at: new Date().toISOString(),
    };

    // Assuming you already have Supabase client configured
    const { data, error } = await supabase
      .from("food_entries")
      .insert([newEntry])
      .select();

    if (error) {
      console.error("Error saving food entry:", error.message);
    } else {
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
  )
}

export default AddFood;
