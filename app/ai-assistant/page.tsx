"use client"

import { Card } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"

const crisisKeywords = ["suicide", "depression", "anxiety", "stress"]
const emergencyContacts = {
  nationalSuicidePreventionHotline: "1-800-273-TALK",
  campusCounselingCenter: "555-1234",
}

const detectCrisis = (message) => {
  let crisisLevel = "none"
  crisisKeywords.forEach((keyword) => {
    if (message.toLowerCase().includes(keyword)) {
      crisisLevel = "high"
    }
  })
  return crisisLevel
}

const generateAIResponse = (userMessage) => {
  const crisisLevel = detectCrisis(userMessage)
  if (crisisLevel === "high") {
    return { content: "I'm very concerned...", crisisLevel: "high" }
  }
  // Other responses...
  return { content: "I'm here to help!", crisisLevel: "none" }
}

const AIWellnessAssistant = () => {
  const [messages, setMessages] = useState([])
  const [showCrisisAlert, setShowCrisisAlert] = useState(false)
  const [userMessage, setUserMessage] = useState("")

  const handleSendMessage = async () => {
    const response = generateAIResponse(userMessage)
    const aiResponse = {
      sender: "AI",
      content: response.content,
      crisisLevel: response.crisisLevel,
    }
    setMessages((prev) => [...prev, aiResponse])
    if (response.crisisLevel === "high") {
      setShowCrisisAlert(true)
    }
  }

  return (
    <div>
      <AnimatePresence>
        {showCrisisAlert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-0 left-0 right-0 bg-red-500 text-white p-4"
          >
            Crisis Alert: Please seek immediate support.
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-3xl font-bold mb-4">AI Wellness Assistant</h1>
        <div className="w-full max-w-md">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 p-4 rounded ${message.sender === "AI" ? "bg-blue-500 text-white" : "bg-gray-100"}`}
            >
              {message.content}
              {message.crisisLevel === "high" && (
                <span className="ml-2 px-2 py-1 bg-red-500 text-white rounded">High Risk</span>
              )}
            </div>
          ))}
        </div>
        <div className="w-full max-w-md">
          <input
            type="text"
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            className="w-full p-4 rounded mb-4"
            placeholder="Type your message here..."
          />
          <button onClick={handleSendMessage} className="w-full p-4 rounded bg-green-500 text-white">
            Send
          </button>
        </div>
        <Card className="mt-8">
          <h2 className="text-xl font-bold mb-4">Emergency Contacts</h2>
          <ul className="list-disc pl-6">
            <li>National Suicide Prevention Hotline: {emergencyContacts.nationalSuicidePreventionHotline}</li>
            <li>Campus Counseling Center: {emergencyContacts.campusCounselingCenter}</li>
          </ul>
        </Card>
      </div>
    </div>
  )
}

export default AIWellnessAssistant
