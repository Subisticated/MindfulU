"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface QuestionOption {
  value: number | string
  label: string
}

interface Question {
  id: string
  text: string
  type: "likert" | "yesno" | "text"
  options?: QuestionOption[]
  optional?: boolean
  placeholder?: string
  reverseScore?: boolean
}

interface QuestionCardProps {
  question: Question
  value: any
  onChange: (value: any) => void
  questionNumber: number
  totalQuestions: number
  sectionTitle?: string
  sectionDescription?: string
  className?: string
}

const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.95
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1
  },
  exit: { 
    opacity: 0, 
    y: -20,
    scale: 0.95
  }
}

const optionVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.3
    }
  })
}

export function QuestionCard({
  question,
  value,
  onChange,
  questionNumber,
  totalQuestions,
  sectionTitle,
  sectionDescription,
  className = ""
}: QuestionCardProps) {
  const [isQuestionExpanded, setIsQuestionExpanded] = useState(false)
  
  // Helper function to determine if question text is long  
  const isLongQuestion = question.text.length > 100 // Reduced from 120 for mobile
  
  // Helper function to truncate question text
  const getTruncatedText = (text: string, maxLength: number = 100) => { // Reduced from 120 for mobile
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }
  
  const renderQuestionContent = () => {
    switch (question.type) {
      case "likert":
        return (
          <div className="w-full">
            <RadioGroup
              value={value?.toString() || ""}
              onValueChange={(newValue) => onChange(parseInt(newValue))}
              className="w-full"
            >
              <div className={cn(
                "space-y-2 sm:space-y-3 w-full",
                question.options && question.options.length > 4 
                  ? "max-h-[120px] sm:max-h-[180px] md:max-h-[240px] overflow-y-auto pr-1 sm:pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100" 
                  : ""
              )}>
                {question.options?.map((option, index) => (
                  <motion.div
                    key={option.value}
                    variants={optionVariants}
                    initial="hidden"
                    animate="visible"
                    custom={index}
                    className="flex items-start space-x-2 sm:space-x-3 p-2 sm:p-3 md:p-4 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer border border-transparent hover:border-primary/20 min-h-[44px] sm:min-h-[50px] md:min-h-[60px]"
                    onClick={() => onChange(option.value)}
                  >
                    <RadioGroupItem 
                      value={option.value.toString()} 
                      id={`${question.id}-${option.value}`}
                      className="text-primary border-2 flex-shrink-0 mt-1"
                    />
                    <Label 
                      htmlFor={`${question.id}-${option.value}`}
                      className="flex-1 cursor-pointer font-medium text-foreground leading-relaxed text-sm sm:text-base break-words"
                    >
                      {option.label}
                    </Label>
                  </motion.div>
                ))}
              </div>
              {question.options && question.options.length > 4 && (
                <div className="text-xs text-muted-foreground text-center mt-2 flex items-center justify-center gap-1 px-2">
                  <ChevronDown className="h-3 w-3 flex-shrink-0" />
                  <span className="break-words">Scroll to see more options</span>
                </div>
              )}
            </RadioGroup>
          </div>
        )
      
      case "yesno":
        return (
          <div className="w-full">
            <div className={cn(
              "space-y-3 sm:space-y-4 w-full",
              question.options && question.options.length > 3 
                ? "max-h-[160px] sm:max-h-[220px] overflow-y-auto pr-1 sm:pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100" 
                : ""
            )}>
              {question.options?.map((option, index) => (
                <motion.div
                  key={option.value}
                  variants={optionVariants}
                  initial="hidden"
                  animate="visible"
                  custom={index}
                  className={cn(
                    "flex items-center justify-between p-2 sm:p-3 md:p-4 rounded-lg border-2 transition-all cursor-pointer min-h-[44px] sm:min-h-[60px] md:min-h-[70px]",
                    value === option.value 
                      ? "border-primary bg-primary/5 shadow-sm" 
                      : "border-muted hover:border-primary/50 hover:bg-muted/50"
                  )}
                  onClick={() => onChange(option.value)}
                >
                  <Label className="flex-1 cursor-pointer font-medium leading-relaxed text-sm sm:text-base break-words pr-2">
                    {option.label}
                  </Label>
                  <Switch
                    checked={value === option.value}
                    onCheckedChange={() => onChange(option.value)}
                    className="ml-2 sm:ml-3 flex-shrink-0"
                  />
                </motion.div>
              ))}
            </div>
            {question.options && question.options.length > 3 && (
              <div className="text-xs text-muted-foreground text-center mt-2 flex items-center justify-center gap-1 px-2">
                <ChevronDown className="h-3 w-3 flex-shrink-0" />
                <span className="break-words">Scroll to see more options</span>
              </div>
            )}
          </div>
        )
      
      case "text":
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-3 w-full"
          >
            {question.id.includes('student_name') || question.id.includes('student_email') || question.id.includes('student_university') ? (
              <Input
                type={question.id.includes('email') ? 'email' : 'text'}
                value={value || ""}
                onChange={(e) => onChange(e.target.value)}
                placeholder={question.placeholder || "Type your response here..."}
                className="border-2 focus:border-primary min-h-[44px] sm:min-h-[50px] text-sm sm:text-base"
              />
            ) : (
              <Textarea
                value={value || ""}
                onChange={(e) => onChange(e.target.value)}
                placeholder={question.placeholder || "Type your response here..."}
                className="min-h-[100px] sm:min-h-[120px] max-h-[160px] resize-none border-2 focus:border-primary text-sm sm:text-base"
                maxLength={500}
              />
            )}
            <div className="h-6 flex justify-end px-1">
              {value && (
                <p className="text-xs text-muted-foreground">
                  {value.length}/500 characters
                </p>
              )}
            </div>
          </motion.div>
        )
      
      default:
        return null
    }
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      className={cn("w-full", className)}
    >
      <Card className="border-0 shadow-lg bg-gradient-to-br from-background via-background to-muted/20 min-h-[400px] sm:min-h-[500px] h-auto max-h-[85vh] sm:max-h-[90vh] w-full max-w-full sm:max-w-2xl mx-auto overflow-hidden">
        <CardContent className="p-3 sm:p-6 md:p-8 space-y-3 sm:space-y-6 h-full flex flex-col">
          {/* Header */}
          <div className="space-y-3 sm:space-y-4 flex-shrink-0">
            {sectionTitle && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-2"
              >
                <h3 className="text-base sm:text-lg font-semibold text-primary break-words">
                  {sectionTitle}
                </h3>
                {sectionDescription && (
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed break-words">
                    {sectionDescription}
                  </p>
                )}
              </motion.div>
            )}
            
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0"
                >
                  <span className="text-xs sm:text-sm font-bold text-primary">
                    {questionNumber}
                  </span>
                </motion.div>
                <div className="text-xs sm:text-sm text-muted-foreground">
                  Question {questionNumber} of {totalQuestions}
                </div>
              </div>
              
              {question.optional && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full"
                >
                  Optional
                </motion.span>
              )}
            </div>
          </div>

          {/* Question Text */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="space-y-4 flex-shrink-0"
          >
            <div className="space-y-2">
              <h4 className="text-lg sm:text-xl font-semibold leading-relaxed text-foreground break-words">
                {isLongQuestion && !isQuestionExpanded 
                  ? getTruncatedText(question.text) 
                  : question.text
                }
              </h4>
              
              {isLongQuestion && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsQuestionExpanded(!isQuestionExpanded)}
                  className="text-primary hover:text-primary/80 p-0 h-auto font-medium flex items-center gap-1 text-sm"
                >
                  {isQuestionExpanded ? (
                    <>
                      <span>Read less</span>
                      <ChevronUp className="h-3 w-3 sm:h-4 sm:w-4" />
                    </>
                  ) : (
                    <>
                      <span>Read more</span>
                      <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
                    </>
                  )}
                </Button>
              )}
            </div>
            
            {question.reverseScore && (
              <div className="flex items-center space-x-2 text-xs text-amber-600 bg-amber-50 p-2 rounded-md overflow-hidden">
                <div className="w-1 h-1 bg-amber-600 rounded-full flex-shrink-0"></div>
                <span className="break-words">Note: This question is reverse scored for accurate assessment</span>
              </div>
            )}
          </motion.div>

          {/* Question Input */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="pt-1 sm:pt-4 flex-1 flex flex-col justify-start overflow-hidden"
          >
            <div className="min-h-[150px] sm:min-h-[200px] md:min-h-[250px] max-h-[300px] sm:max-h-[400px] flex flex-col justify-center overflow-auto">
              {renderQuestionContent()}
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
