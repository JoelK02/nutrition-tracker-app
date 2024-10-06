import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Slider } from "@/components/ui/slider"
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabaseClient'
import { useUser } from '@supabase/auth-helpers-react' // Make sure to install this package
import { useRouter } from 'next/navigation'

interface SettingsProps {
  onClose: () => void;
  isOpen: boolean;
}

export default function SettingsComponent({ onClose, isOpen }: SettingsProps) {
  const [dailyIntakes, setDailyIntakes] = useState({
    calories: 3041,
    protein: 129,
    carbs: 440,
    fat: 84
  })
  const user = useUser()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      fetchUserSettings()
    }
  }, [user])

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Error logging out:', error)
      alert({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      })
    } else {
      router.push('/pages/sign-in') // Redirect to login page after logout
      onClose() // Close the settings panel
    }
  }

  const fetchUserSettings = async () => {
    if (!user) return

    const { data, error } = await supabase
      .from('user_settings')
      .select('daily_intakes')
      .eq('user_id', user.id)
      .single()
    
    if (error) {
      console.error('Error fetching user settings:', error)
    } else if (data && data.daily_intakes) {
      setDailyIntakes(data.daily_intakes)
    }
  }

  const handleIntakeChange = (type: keyof typeof dailyIntakes, value: number[]) => {
    setDailyIntakes(prev => ({ ...prev, [type]: value[0] }))
  }

  const saveSettings = async () => {
    if (!user) return;
  
    const { data, error } = await supabase
      .from('user_settings')
      .upsert({ 
        user_id: user.id, 
        daily_intakes: dailyIntakes 
      }, { 
        onConflict: 'user_id'
      });
  
    if (error) {
      console.error('Error saving settings:', error);
      alert({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } else {
      alert({
        title: "Success",
        description: "Settings saved successfully!",
      });
    }
  };

  if (!user) {
    return <div>Please log in to view settings</div>
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{
            type: "spring",
            damping: 30,
            stiffness: 300,
            mass: 0.8,
          }}
          className="fixed inset-y-0 right-0 w-full max-w-md bg-gray-100 z-50 overflow-auto"
          style={{
            height: '100vh',
            paddingTop: 'env(safe-area-inset-top)',
            paddingBottom: 'env(safe-area-inset-bottom)',
          }}
        >
          <div className="flex flex-col min-h-screen p-4">
            <header className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold">Settings</h1>
              <Button variant="ghost" size="icon" className="rounded-full" onClick={onClose}>
                <X className="h-6 w-6" />
              </Button>
            </header>

            <main className="flex-1 space-y-6">
              {/* User Details */}
              <Card className="shadow-lg rounded-xl overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={user.user_metadata.avatar_url } alt="User" />
                      <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-2xl font-semibold">{user.user_metadata.full_name || 'User'}</h2>
                      <p className="text-gray-500">{user.email}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Daily Intakes */}
              <Card className="shadow-lg rounded-xl overflow-hidden">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">My daily intakes</h2>
                  <div className="space-y-6">
                    {Object.entries(dailyIntakes).map(([key, value]) => (
                      <div key={key} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-lg">
                            {key === 'calories' && '🔥'}
                            {key === 'protein' && '🍗'}
                            {key === 'carbs' && '🍞'}
                            {key === 'fat' && '🥑'}
                            {' '}{key.charAt(0).toUpperCase() + key.slice(1)}
                          </span>
                          <span className="font-semibold">{value}{key !== 'calories' && 'g'}</span>
                        </div>
                        <Slider
                          value={[value]}
                          max={key === 'calories' ? 5000 : key === 'carbs' ? 700 : key === 'protein' ? 300 : 200}
                          step={1}
                          onValueChange={(newValue) => handleIntakeChange(key as keyof typeof dailyIntakes, newValue)}
                          className="w-full"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Save Settings Button */}
              <Button 
                className="w-full bg-black text-white py-6 text-lg rounded-xl shadow-lg"
                onClick={saveSettings}
              >
                Save Settings
              </Button>
              <Button 
                className="w-full bg-red-600 text-white py-6 text-lg rounded-xl shadow-lg mt-4"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </main>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}