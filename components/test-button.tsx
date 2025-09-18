"use client"

import { useState } from "react"

export function TestButton() {
  const [count, setCount] = useState(0)
  
  return (
    <div className="p-4 border">
      <button 
        onClick={() => {
          console.log('Test button clicked!')
          setCount(count + 1)
        }}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Test Click {count}
      </button>
    </div>
  )
}
