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
  const isLongQuestion = question.text.length > 120
  
  // Helper function to truncate question text
  const getTruncatedText = (text: string, maxLength: number = 120) => {
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
                "space-y-3 w-full",
                question.options && question.options.length > 4 
                  ? "max-h-[240px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100" 
                  : ""
              )}>
                {question.options?.map((option, index) => (
                  <motion.div
                    key={option.value}
                    variants={optionVariants}
                    initial="hidden"
                    animate="visible"
                    custom={index}
                    className="flex items-center space-x-3 p-4 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer border border-transparent hover:border-primary/20 min-h-[60px]"
                    onClick={() => onChange(option.value)}
                  >
                    <RadioGroupItem 
                      value={option.value.toString()} 
                      id={`${question.id}-${option.value}`}
                      className="text-primary border-2 flex-shrink-0"
                    />
                    <Label 
                      htmlFor={`${question.id}-${option.value}`}
                      className="flex-1 cursor-pointer font-medium text-foreground leading-relaxed"
                    >
                      {option.label}
                    </Label>
                  </motion.div>
                ))}
              </div>
              {question.options && question.options.length > 4 && (
                <div className="text-xs text-muted-foreground text-center mt-2 flex items-center justify-center gap-1">
                  <ChevronDown className="h-3 w-3" />
                  <span>Scroll to see more options</span>
                </div>
              )}
            </RadioGroup>
          </div>
        )
      
      case "yesno":
        return (
          <div className="w-full">
            <div className={cn(
              "space-y-4 w-full",
              question.options && question.options.length > 3 
                ? "max-h-[220px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100" 
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
                    "flex items-center justify-between p-4 rounded-lg border-2 transition-all cursor-pointer min-h-[70px]",
                    value === option.value 
                      ? "border-primary bg-primary/5 shadow-sm" 
                      : "border-muted hover:border-primary/50 hover:bg-muted/50"
                  )}
                  onClick={() => onChange(option.value)}
                >
                  <Label className="flex-1 cursor-pointer font-medium leading-relaxed">
                    {option.label}
                  </Label>
                  <Switch
                    checked={value === option.value}
                    onCheckedChange={() => onChange(option.value)}
                    className="ml-3 flex-shrink-0"
                  />
                </motion.div>
              ))}
            </div>
            {question.options && question.options.length > 3 && (
              <div className="text-xs text-muted-foreground text-center mt-2 flex items-center justify-center gap-1">
                <ChevronDown className="h-3 w-3" />
                <span>Scroll to see more options</span>
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
                className="border-2 focus:border-primary min-h-[50px]"
              />
            ) : (
              <Textarea
                value={value || ""}
                onChange={(e) => onChange(e.target.value)}
                placeholder={question.placeholder || "Type your response here..."}
                className="min-h-[120px] max-h-[160px] resize-none border-2 focus:border-primary"
                maxLength={500}
              />
            )}
            <div className="h-6 flex justify-end">
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
      <Card className="border-0 shadow-lg bg-gradient-to-br from-background via-background to-muted/20 h-[650px] w-full max-w-2xl mx-auto">
        <CardContent className="p-8 space-y-6 h-full flex flex-col">
          {/* Header */}
          <div className="space-y-4 flex-shrink-0">
            {sectionTitle && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-2"
              >
                <h3 className="text-lg font-semibold text-primary">
                  {sectionTitle}
                </h3>
                {sectionDescription && (
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {sectionDescription}
                  </p>
                )}
              </motion.div>
            )}
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                  className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center"
                >
                  <span className="text-sm font-bold text-primary">
                    {questionNumber}
                  </span>
                </motion.div>
                <div className="text-sm text-muted-foreground">
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
              <h4 className="text-xl font-semibold leading-relaxed text-foreground">
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
                  className="text-primary hover:text-primary/80 p-0 h-auto font-medium flex items-center gap-1"
                >
                  {isQuestionExpanded ? (
                    <>
                      <span>Read less</span>
                      <ChevronUp className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      <span>Read more</span>
                      <ChevronDown className="h-4 w-4" />
                    </>
                  )}
                </Button>
              )}
            </div>
            
            {question.reverseScore && (
              <div className="flex items-center space-x-2 text-xs text-amber-600 bg-amber-50 p-2 rounded-md">
                <div className="w-1 h-1 bg-amber-600 rounded-full"></div>
                <span>Note: This question is reverse scored for accurate assessment</span>
              </div>
            )}
          </motion.div>

          {/* Question Input */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="pt-4 flex-1 flex flex-col justify-start overflow-hidden"
          >
            <div className="min-h-[250px] max-h-[320px] flex flex-col justify-center overflow-hidden">
              {renderQuestionContent()}
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
