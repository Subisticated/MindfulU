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
        text: "As a student, you may face various challenges that can impact your overall wellness and academic performance. Considering your current situation, personal circumstances, daily routines, and the various pressures you experience, what would you identify as your most significant wellness concern or area where you feel you need the most support right now?",
        type: "likert",
        options: [
          { value: 0, label: "Academic stress and pressure from coursework, exams, and deadlines" },
          { value: 1, label: "Social anxiety and difficulty connecting with peers or participating in group activities" },
          { value: 2, label: "Sleep problems including difficulty falling asleep, staying asleep, or poor sleep quality" },
          { value: 3, label: "Feeling overwhelmed by responsibilities and struggling to manage everything" },
          { value: 4, label: "Loneliness and feelings of isolation from friends, family, or community" },
          { value: 5, label: "Time management challenges and difficulty balancing studies with personal life" },
          { value: 6, label: "Financial stress and concerns about money, expenses, or student loans" },
          { value: 7, label: "Mental health concerns including depression, anxiety, or mood changes" },
          { value: 8, label: "Physical health issues or concerns about maintaining healthy habits" },
          { value: 9, label: "Family or relationship problems affecting your well-being" }
        ]
      }
    ]
  }
}

// Calculate scores for essential 6-question assessment
export const calculateQuickScores = (answers) => {
  const scores = {}
  
  // Core wellness indicators (all on 0-3 scale)
  const moodScore = answers.essential_mood || 0
  const anxietyScore = answers.essential_anxiety || 0
  const stressScore = answers.essential_stress || 0
  const sleepScore = answers.essential_sleep || 0
  const supportScore = answers.essential_support || 0
  
  // Keep scores in original 0-3 range for consistency
  scores.mood = moodScore
  scores.anxiety = anxietyScore
  scores.stress = stressScore
  scores.sleep = sleepScore
  scores.support = supportScore
  
  // Total score out of 15 (5 questions × 3 max each)
  const totalScore = scores.mood + scores.anxiety + scores.stress + scores.sleep + scores.support
  
  // Calculate overall wellness score (0-100, higher is better)
  // Invert the score since higher raw scores indicate worse wellness
  scores.overallWellnessScore = Math.max(0, Math.round(100 - (totalScore / 15) * 100))
  
  // Determine wellness level with student-friendly language (out of 15)
  // More forgiving thresholds to reduce overwhelming students
  if (totalScore >= 11) {
    scores.riskLevel = 'challenging'
    scores.riskDescription = 'You may be facing some challenges'
  } else if (totalScore >= 7) {
    scores.riskLevel = 'moderate'
    scores.riskDescription = 'Some areas need attention'
  } else if (totalScore >= 3) {
    scores.riskLevel = 'mild'
    scores.riskDescription = 'Overall doing well'
  } else {
    scores.riskLevel = 'excellent'
    scores.riskDescription = 'Great wellness indicators'
  }
  
  // Store priority concern (this is not a wellness score, just an identifier)
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
  
  // Supportive recommendations based on wellness level
  if (scores.riskLevel === 'challenging') {
    recommendations.push({
      type: 'supportive',
      title: 'You\'re Not Alone',
      description: 'It sounds like you\'re going through a tough time. Remember that seeking support is a sign of strength.',
      actions: ['Talk to someone you trust', 'Campus wellness resources', 'Self-care activities']
    })
  } else if (scores.riskLevel === 'moderate') {
    recommendations.push({
      type: 'encouraging',
      title: 'Small Steps Forward',
      description: 'You\'re managing well overall. Let\'s focus on some areas that could use a little attention.',
      actions: ['Daily check-ins', 'Stress management', 'Healthy routines']
    })
  }
  
  // Targeted recommendations based on priority concern
  const priorityConcern = answers.essential_concern
  
  if (priorityConcern === 0) { // Academic stress
    recommendations.push({
      type: 'practical',
      title: 'Academic Balance',
      description: 'Academic challenges are normal. Let\'s find strategies that work for you.',
      actions: ['Study planning', 'Break tasks down', 'Academic support']
    })
  } else if (priorityConcern === 1) { // Social anxiety
    recommendations.push({
      type: 'practical',
      title: 'Social Confidence',
      description: 'Building social connections takes time. Start small and be patient with yourself.',
      actions: ['Small interactions', 'Campus groups', 'Practice self-compassion']
    })
  } else if (priorityConcern === 2) { // Sleep problems
    recommendations.push({
      type: 'practical',
      title: 'Better Sleep',
      description: 'Good sleep is your foundation for everything else. Let\'s improve your rest.',
      actions: ['Sleep routine', 'Screen time limits', 'Relaxation methods']
    })
  } else if (priorityConcern === 3) { // Feeling overwhelmed
    recommendations.push({
      type: 'practical',
      title: 'Managing Overwhelm',
      description: 'Feeling overwhelmed is common in student life. Let\'s break things down.',
      actions: ['Priority setting', 'Time management', 'Breathing exercises']
    })
  } else if (priorityConcern === 4) { // Loneliness
    recommendations.push({
      type: 'practical',
      title: 'Building Connections',
      description: 'Making meaningful connections takes time. You\'re taking a positive step.',
      actions: ['Campus activities', 'Study groups', 'Volunteer opportunities']
    })
  } else if (priorityConcern === 5) { // Time management
    recommendations.push({
      type: 'practical',
      title: 'Time Management',
      description: 'Good time management reduces stress and creates space for what matters.',
      actions: ['Planning tools', 'Priority methods', 'Time blocking']
    })
  }
  
  // Gentle suggestions based on specific areas
  if (answers.essential_support >= 2) {
    recommendations.push({
      type: 'gentle',
      title: 'Building Your Support Circle',
      description: 'Having people to talk to makes a big difference in how we feel.',
      actions: ['Reach out to one person', 'Join a community', 'Consider counseling']
    })
  }
  
  // Sleep recommendation if needed
  if (answers.essential_sleep >= 2) {
    recommendations.push({
      type: 'gentle',
      title: 'Sleep Foundation',
      description: 'Better sleep often leads to better days and improved mood.',
      actions: ['Evening routine', 'Phone-free bedroom', 'Regular bedtime']
    })
  }
  
  // Always include a positive, actionable tip
  if (scores.riskLevel === 'excellent' || scores.riskLevel === 'mild') {
    recommendations.push({
      type: 'positive',
      title: 'Keep Up the Great Work!',
      description: 'You\'re doing well! Here are some ways to maintain your positive momentum.',
      actions: ['Daily gratitude', 'Stay active', 'Connect with others']
    })
  } else {
    recommendations.push({
      type: 'gentle',
      title: 'Small Daily Steps',
      description: 'Remember, small consistent actions can lead to meaningful improvements.',
      actions: ['5-minute walks', 'Deep breathing', 'One good thing daily']
    })
  }
  
  return recommendations
}
