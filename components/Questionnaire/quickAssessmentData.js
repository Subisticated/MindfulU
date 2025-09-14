// Essential assessment for initial onboarding - just 6 key questions
// This will be used for first-time users to get started quickly (under 2 minutes)

export const quickAssessmentSets = {
  // Essential wellness check - 6 questions covering core indicators
  essentialCheck: {
    name: "Essential Wellness Check",
    description: "Help us understand how you're doing with these key questions:",
    questions: [
      {
        id: "essential_mood",
        text: "Over the past week, how often have you felt down, depressed, or hopeless?",
        type: "likert",
        options: [
          { value: 0, label: "Not at all" },
          { value: 1, label: "Several days" },
          { value: 2, label: "More than half the days" },
          { value: 3, label: "Nearly every day" }
        ]
      },
      {
        id: "essential_anxiety",
        text: "How often have you felt nervous, anxious, or on edge?",
        type: "likert",
        options: [
          { value: 0, label: "Not at all" },
          { value: 1, label: "Several days" },
          { value: 2, label: "More than half the days" },
          { value: 3, label: "Nearly every day" }
        ]
      },
      {
        id: "essential_stress",
        text: "How often have you felt overwhelmed by your responsibilities?",
        type: "likert",
        options: [
          { value: 0, label: "Never" },
          { value: 1, label: "Rarely" },
          { value: 2, label: "Sometimes" },
          { value: 3, label: "Very often" }
        ]
      },
      {
        id: "essential_sleep",
        text: "How would you rate your sleep quality recently?",
        type: "likert",
        options: [
          { value: 0, label: "Very good" },
          { value: 1, label: "Good" },
          { value: 2, label: "Poor" },
          { value: 3, label: "Very poor" }
        ]
      },
      {
        id: "essential_support",
        text: "Do you feel you have adequate emotional support when you need it?",
        type: "likert",
        options: [
          { value: 0, label: "Definitely" },
          { value: 1, label: "Mostly" },
          { value: 2, label: "Somewhat" },
          { value: 3, label: "Not really" }
        ]
      },
      {
        id: "essential_concern",
        text: "What is your biggest wellness concern right now?",
        type: "likert",
        options: [
          { value: 0, label: "Academic stress" },
          { value: 1, label: "Social anxiety" },
          { value: 2, label: "Sleep problems" },
          { value: 3, label: "Feeling overwhelmed" },
          { value: 4, label: "Loneliness" },
          { value: 5, label: "Time management" }
        ]
      }
    ]
  }
}

// Calculate scores for essential 6-question assessment
export const calculateQuickScores = (answers) => {
  const scores = {}
  
  // Core wellness indicators
  const moodScore = answers.essential_mood || 0
  const anxietyScore = answers.essential_anxiety || 0
  const stressScore = answers.essential_stress || 0
  const sleepScore = answers.essential_sleep || 0
  const supportScore = answers.essential_support || 0
  
  // Calculate individual component scores
  scores.mood = moodScore * 3 // Scale to 0-9
  scores.anxiety = anxietyScore * 3 // Scale to 0-9
  scores.stress = stressScore * 4 // Scale to 0-12
  scores.sleep = sleepScore * 2 // Scale to 0-6
  scores.support = supportScore * 2 // Scale to 0-6
  
  // Total score out of 42
  const totalScore = scores.mood + scores.anxiety + scores.stress + scores.sleep + scores.support
  
  // Calculate overall wellness score (0-100, higher is better)
  scores.overallWellnessScore = Math.max(0, Math.round(100 - (totalScore / 42) * 100))
  
  // Determine risk level based on total score
  if (totalScore >= 30) {
    scores.riskLevel = 'severe'
  } else if (totalScore >= 20) {
    scores.riskLevel = 'moderate'
  } else if (totalScore >= 10) {
    scores.riskLevel = 'mild'
  } else {
    scores.riskLevel = 'minimal'
  }
  
  // Store priority concern
  scores.priorityConcern = answers.essential_concern || 0
  
  return scores
}

// Helper function for quick score levels
const getQuickScoreLevel = (score, interpretation) => {
  for (const level of Object.values(interpretation)) {
    if (score >= level.min && score <= level.max) {
      return level
    }
  }
  return interpretation[0]
}

// Generate quick recommendations based on essential assessment
export const generateQuickRecommendations = (scores, answers) => {
  const recommendations = []
  
  // High-priority recommendations based on risk level
  if (scores.riskLevel === 'severe' || scores.riskLevel === 'moderate') {
    recommendations.push({
      type: 'urgent',
      title: 'Consider Professional Support',
      description: 'Your responses suggest you might benefit from speaking with a counselor or trusted person.',
      actions: ['Contact campus counseling', 'Speak with a trusted friend', 'Call support hotline']
    })
  }
  
  // Targeted recommendations based on priority concern
  const concernLabels = ['Academic stress', 'Social anxiety', 'Sleep problems', 'Feeling overwhelmed', 'Loneliness', 'Time management']
  const priorityConcern = answers.essential_concern
  
  if (priorityConcern === 0) { // Academic stress
    recommendations.push({
      type: 'important',
      title: 'Academic Stress Management',
      description: 'Break large tasks into smaller steps and use time-blocking techniques.',
      actions: ['Study planning tools', 'Pomodoro technique', 'Academic support services']
    })
  } else if (priorityConcern === 1) { // Social anxiety
    recommendations.push({
      type: 'important',
      title: 'Social Confidence Building',
      description: 'Start with small social interactions and practice self-compassion.',
      actions: ['Mindfulness exercises', 'Campus social groups', 'Social skills practice']
    })
  } else if (priorityConcern === 2) { // Sleep problems
    recommendations.push({
      type: 'important',
      title: 'Sleep Hygiene Improvement',
      description: 'Good sleep is foundational to mental wellness and academic performance.',
      actions: ['Consistent sleep schedule', 'Screen time limits', 'Relaxation techniques']
    })
  } else if (priorityConcern === 3) { // Feeling overwhelmed
    recommendations.push({
      type: 'important',
      title: 'Overwhelm Management',
      description: 'Learn to prioritize tasks and set healthy boundaries.',
      actions: ['Task prioritization', 'Say no techniques', 'Stress reduction methods']
    })
  } else if (priorityConcern === 4) { // Loneliness
    recommendations.push({
      type: 'important',
      title: 'Building Connections',
      description: 'Social connections are vital for mental health and wellbeing.',
      actions: ['Join campus clubs', 'Study groups', 'Community activities']
    })
  } else if (priorityConcern === 5) { // Time management
    recommendations.push({
      type: 'important',
      title: 'Time Management Skills',
      description: 'Effective time management reduces stress and improves performance.',
      actions: ['Calendar blocking', 'Priority matrix', 'Time tracking']
    })
  }
  
  // Support system recommendation if needed
  if (answers.essential_support >= 2) {
    recommendations.push({
      type: 'helpful',
      title: 'Build Your Support Network',
      description: 'Having people to talk to is crucial for mental health.',
      actions: ['Reach out to family', 'Connect with classmates', 'Join support groups']
    })
  }
  
  // Sleep recommendation if needed
  if (answers.essential_sleep >= 2) {
    recommendations.push({
      type: 'helpful',
      title: 'Improve Sleep Quality',
      description: 'Better sleep improves mood, focus, and overall wellbeing.',
      actions: ['Sleep hygiene tips', 'Bedtime routine', 'Limit caffeine']
    })
  }
  
  // Always include a general wellness tip
  recommendations.push({
    type: 'helpful',
    title: 'Daily Wellness Habits',
    description: 'Small consistent actions can make a significant difference in your wellbeing.',
    actions: ['5-minute meditation', 'Daily walk', 'Gratitude practice']
  })
  
  return recommendations
}
