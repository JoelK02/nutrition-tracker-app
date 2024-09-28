import React, { useState, useRef, useEffect } from 'react'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { motion, AnimatePresence } from 'framer-motion'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus, ArrowLeft, Camera } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import { v4 as uuidv4 } from 'uuid';

export interface FoodEntry {
  id: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  created_at: string;
  food_image?: string | null; // Make this optional and allow null
  food_description?: string; // Make this optional
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

  const [isOpen, setIsOpen] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [foodDescription, setFoodDescription] = useState<string>('');
  

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLoading(true);
      try {
        const compressedFile = await compressImage(file);
        setImageFile(compressedFile);
        const previewUrl = URL.createObjectURL(compressedFile);
        setImagePreviewUrl(previewUrl);
        await processImage(compressedFile);
      } catch (error) {
        console.error('Error processing image:', error);
        alert('Failed to process the image. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewFood({ ...newFood, [name]: value });
  };

  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const scaleFactor = Math.min(1, 800 / Math.max(img.width, img.height));
          canvas.width = img.width * scaleFactor;
          canvas.height = img.height * scaleFactor;
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const newFile = new File([blob], file.name, {
                  type: 'image/jpeg',
                  lastModified: Date.now(),
                });
                resolve(newFile);
              } else {
                reject(new Error('Canvas to Blob conversion failed'));
              }
            },
            'image/jpeg',
            0.7
          );
        };
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const processImage = async (file: File) => {
    const base64Image = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });

    const response = await fetch('/api/openai-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageUrl: base64Image }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('AI result:', result);

    setNewFood({
      calories: result.calories.toString(),
      protein: result.protein.toString(),
      carbs: result.carbs.toString(),
      fat: result.fat.toString(),
    });

    setFoodDescription(result.description || 'No description available');

  };

  const handleAddFood = async () => {
    const parsedCalories = parseInt(newFood.calories, 10);
    const parsedProtein = parseInt(newFood.protein, 10);
    const parsedCarbs = parseInt(newFood.carbs, 10);
    const parsedFat = parseInt(newFood.fat, 10);

    if (isNaN(parsedCalories) || isNaN(parsedProtein) || isNaN(parsedCarbs) || isNaN(parsedFat)) {
      alert("Please enter valid numbers for calories, protein, carbs, and fat.");
      return;
    }

    let imagePath = null;
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('food-images')
        .upload(fileName, imageFile);
    
      if (uploadError) {
        console.error("Error uploading image:", uploadError);
        console.error("Error message:", uploadError.message);
        alert("Failed to upload image. Please try again.");
        return;
      }
    
      imagePath = uploadData?.path;
    }

    const newEntry = {
      calories: parsedCalories,
      protein: parsedProtein,
      carbs: parsedCarbs,
      fat: parsedFat,
      food_description: foodDescription,
      food_image: imagePath,
    };

    const { data, error } = await supabase
      .from("food_entries")
      .insert([newEntry])
      .select();

    if (error) {
      console.error("Detailed error:", error);
      console.error("Error code:", error.code);
      console.error("Error message:", error.message);
      console.error("Error details:", error.details);
      alert("Failed to save food entry. Please check the console for details.");
    } else {
      console.log("Food entry saved:", data);
      setFoodEntries([...foodEntries, data[0]]);
      setNewFood({ calories: '', protein: '', carbs: '', fat: '' });
      setImagePreviewUrl(null);
      setImageFile(null);
      setFoodDescription('');
      setIsOpen(false);
    }
    
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Button
        className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex items-center justify-center space-x-3 px-6 py-3 rounded-full shadow-lg text-xl font-semibold"
        style={{ backgroundColor: '#10B981', minWidth: '220px', minHeight: '64px' }}
        onClick={() => setIsOpen(true)}
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7 3H5C3.89543 3 3 3.89543 3 5V7" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
          <path d="M17 3H19C20.1046 3 21 3.89543 21 5V7" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
          <path d="M16 12L12 12M12 12L8 12M12 12L12 8M12 12L12 16" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
          <path d="M7 21H5C3.89543 21 3 20.1046 3 19V17" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
          <path d="M17 21H19C20.1046 21 21 20.1046 21 19V17" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
        <span className="text-white">Scan food</span>
      </Button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{
              type: "spring",
              damping: 30,
              stiffness: 300,
              mass: 0.8,
              duration: 0.3
            }}
            className="fixed inset-0 bg-white z-50 overflow-auto"
          >
            <div className="relative h-64">
              {imagePreviewUrl ? (
                <img 
                  src={imagePreviewUrl} 
                  alt="Selected food" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <Camera size={48} className="text-gray-400" />
                </div>
              )}
              <Button 
                className="absolute top-4 left-4 rounded-full w-10 h-10 p-0"
                variant="outline"
                onClick={handleClose}
              >
                <ArrowLeft size={20} />
              </Button>
            </div>
            <div className="p-6 bg-white rounded-t-3xl -mt-6 relative">
              <h2 className="text-2xl font-bold mb-2">
                {imageFile ? 'About' : 'Add Food Entry'}
              </h2>
              {imageFile && (
                <p className="text-sm text-gray-600 mb-4">{foodDescription}</p>
              )}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">Food</span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">Meal</span>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Calories</label>
                  <Input name="calories" value={newFood.calories} onChange={handleInputChange} placeholder="Calories" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Protein (g)</label>
                  <Input name="protein" value={newFood.protein} onChange={handleInputChange} placeholder="Protein" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Carbs (g)</label>
                  <Input name="carbs" value={newFood.carbs} onChange={handleInputChange} placeholder="Carbs" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fat (g)</label>
                  <Input name="fat" value={newFood.fat} onChange={handleInputChange} placeholder="Fat" />
                </div>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                ref={fileInputRef}
                className="hidden"
              />
              <div className="mt-6 space-y-4">
                <Button onClick={() => fileInputRef.current?.click()} className="w-full" disabled={loading}>
                  {loading ? 'Processing...' : (imageFile ? 'Change Image' : 'Select Image')}
                </Button>
                <Button onClick={handleAddFood} className="w-full bg-green-500 hover:bg-green-600 text-white" disabled={loading}>
                  Add Food Entry
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AddFood;