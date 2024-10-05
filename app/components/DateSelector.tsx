import React, { useState, useEffect } from 'react'
import { format, startOfWeek, addDays, isSameDay, isToday } from 'date-fns'
import { motion } from 'framer-motion'

interface DateSelectorProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export default function DateSelector({ selectedDate, onDateSelect }: DateSelectorProps) {
  const [weekDates, setWeekDates] = useState<Date[]>([])

  useEffect(() => {
    const start = startOfWeek(selectedDate, { weekStartsOn: 1 }) // Start on Monday
    const dates = Array.from({ length: 7 }, (_, i) => addDays(start, i))
    setWeekDates(dates)
  }, [selectedDate])

  return (
    <div className="">
      <div className="flex justify-between items-center">
        {weekDates.map((date, index) => {
          const isSelected = isSameDay(date, selectedDate)
          const isSunday = format(date, 'EEE') === 'Sun'
          return (
            <motion.div
              key={index}
              className={`flex flex-col items-center cursor-pointer ${isSunday ? 'text-gray-400' : ''}`}
              onClick={() => onDateSelect(date)}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div 
                className={`flex flex-col items-center p-1.5 rounded-2xl ${isSelected ? 'bg-black text-white' : ''}`}
                animate={{ scale: isSelected ? 1.05 : 1 }}
                transition={{ duration: 0.2 }}
              >
                <span className="text-xs">
                  {format(date, 'EEE')}
                </span>
                <div
                  className={`w-7 h-7 mt-1 flex items-center justify-center rounded-full
                    ${isSelected ? 'bg-white' : ''}
                  `}
                >
                  <span className={`text-sm ${isSelected ? 'text-black' : ''}`}>
                    {format(date, 'd')}
                  </span>
                </div>
              </motion.div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}