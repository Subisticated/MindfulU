// Standardized psychological screening tools for students
// PHQ-9, GAD-7, PSS-10, and additional student-specific questions

export const questionSets = {
  phq9: {
    name: "PHQ-9 (Depression Screening)",
    description: "Over the last 2 weeks, how often have you been bothered by the following problems?",
    scoringRange: [0, 27],
    interpretation: {
      0: { min: 0, max: 4, level: "Minimal", severity: "minimal", color: "bg-green-100 text-green-800" },
      1: { min: 5, max: 9, level: "Mild", severity: "mild", color: "bg-yellow-100 text-yellow-800" },
      2: { min: 10, max: 14, level: "Moderate", severity: "moderate", color: "bg-orange-100 text-orange-800" },
      3: { min: 15, max: 19, level: "Moderately Severe", severity: "moderate-severe", color: "bg-red-100 text-red-800" },
      4: { min: 20, max: 27, level: "Severe", severity: "severe", color: "bg-red-200 text-red-900" }
    },
    questions: [
      {
        id: "phq9_1",
        text: "Little interest or pleasure in doing things",
        type: "likert",
        options: [
          { value: 0, label: "Not at all" },
          { value: 1, label: "Several days" },
          { value: 2, label: "More than half the days" },
          { value: 3, label: "Nearly every day" }
        ]
      },
      {
        id: "phq9_2",
        text: "Feeling down, depressed, or hopeless",
        type: "likert",
        options: [
          { value: 0, label: "Not at all" },
          { value: 1, label: "Several days" },
          { value: 2, label: "More than half the days" },
          { value: 3, label: "Nearly every day" }
        ]
      },
      {
        id: "phq9_3",
        text: "Trouble falling or staying asleep, or sleeping too much",
        type: "likert",
        options: [
          { value: 0, label: "Not at all" },
          { value: 1, label: "Several days" },
          { value: 2, label: "More than half the days" },
          { value: 3, label: "Nearly every day" }
        ]
      },
      {
        id: "phq9_4",
        text: "Feeling tired or having little energy",
        type: "likert",
        options: [
          { value: 0, label: "Not at all" },
          { value: 1, label: "Several days" },
          { value: 2, label: "More than half the days" },
          { value: 3, label: "Nearly every day" }
        ]
      },
      {
        id: "phq9_5",
        text: "Poor appetite or overeating",
        type: "likert",
        options: [
          { value: 0, label: "Not at all" },
          { value: 1, label: "Several days" },
          { value: 2, label: "More than half the days" },
          { value: 3, label: "Nearly every day" }
        ]
      },
      {
        id: "phq9_6",
        text: "Feeling bad about yourself, or that you are a failure",
        type: "likert",
        options: [
          { value: 0, label: "Not at all" },
          { value: 1, label: "Several days" },
          { value: 2, label: "More than half the days" },
          { value: 3, label: "Nearly every day" }
        ]
      },
      {
        id: "phq9_7",
        text: "Trouble concentrating on things (e.g., reading, studies)",
        type: "likert",
        options: [
          { value: 0, label: "Not at all" },
          { value: 1, label: "Several days" },
          { value: 2, label: "More than half the days" },
          { value: 3, label: "Nearly every day" }
        ]
      },
      {
        id: "phq9_8",
        text: "Moving or speaking so slowly people noticed OR being fidgety/restless",
        type: "likert",
        options: [
          { value: 0, label: "Not at all" },
          { value: 1, label: "Several days" },
          { value: 2, label: "More than half the days" },
          { value: 3, label: "Nearly every day" }
        ]
      },
      {
        id: "phq9_9",
        text: "Thoughts that you would be better off dead or hurting yourself",
        type: "likert",
        options: [
          { value: 0, label: "Not at all" },
          { value: 1, label: "Several days" },
          { value: 2, label: "More than half the days" },
          { value: 3, label: "Nearly every day" }
        ]
      }
    ]
  },
  
  gad7: {
    name: "GAD-7 (Anxiety Screening)",
    description: "Over the last 2 weeks, how often have you been bothered by the following problems?",
    scoringRange: [0, 21],
    interpretation: {
      0: { min: 0, max: 4, level: "Minimal", severity: "minimal", color: "bg-green-100 text-green-800" },
      1: { min: 5, max: 9, level: "Mild", severity: "mild", color: "bg-yellow-100 text-yellow-800" },
      2: { min: 10, max: 14, level: "Moderate", severity: "moderate", color: "bg-orange-100 text-orange-800" },
      3: { min: 15, max: 21, level: "Severe", severity: "severe", color: "bg-red-200 text-red-900" }
    },
    questions: [
      {
        id: "gad7_1",
        text: "Feeling nervous, anxious, or on edge",
        type: "likert",
        options: [
          { value: 0, label: "Not at all" },
          { value: 1, label: "Several days" },
          { value: 2, label: "More than half the days" },
          { value: 3, label: "Nearly every day" }
        ]
      },
      {
        id: "gad7_2",
        text: "Not being able to stop or control worrying",
        type: "likert",
        options: [
          { value: 0, label: "Not at all" },
          { value: 1, label: "Several days" },
          { value: 2, label: "More than half the days" },
          { value: 3, label: "Nearly every day" }
        ]
      },
      {
        id: "gad7_3",
        text: "Worrying too much about different things",
        type: "likert",
        options: [
          { value: 0, label: "Not at all" },
          { value: 1, label: "Several days" },
          { value: 2, label: "More than half the days" },
          { value: 3, label: "Nearly every day" }
        ]
      },
      {
        id: "gad7_4",
        text: "Trouble relaxing",
        type: "likert",
        options: [
          { value: 0, label: "Not at all" },
          { value: 1, label: "Several days" },
          { value: 2, label: "More than half the days" },
          { value: 3, label: "Nearly every day" }
        ]
      },
      {
        id: "gad7_5",
        text: "Being so restless that it's hard to sit still",
        type: "likert",
        options: [
          { value: 0, label: "Not at all" },
          { value: 1, label: "Several days" },
          { value: 2, label: "More than half the days" },
          { value: 3, label: "Nearly every day" }
        ]
      },
      {
        id: "gad7_6",
        text: "Becoming easily annoyed or irritable",
        type: "likert",
        options: [
          { value: 0, label: "Not at all" },
          { value: 1, label: "Several days" },
          { value: 2, label: "More than half the days" },
          { value: 3, label: "Nearly every day" }
        ]
      },
      {
        id: "gad7_7",
        text: "Feeling afraid as if something awful might happen",
        type: "likert",
        options: [
          { value: 0, label: "Not at all" },
          { value: 1, label: "Several days" },
          { value: 2, label: "More than half the days" },
          { value: 3, label: "Nearly every day" }
        ]
      }
    ]
  },

  pss10: {
    name: "PSS-10 (Perceived Stress Scale)",
    description: "In the last month, how often have you...",
    scoringRange: [0, 40],
    reverseScoreItems: ["pss10_4", "pss10_5", "pss10_7", "pss10_8"],
    interpretation: {
      0: { min: 0, max: 13, level: "Low Stress", severity: "low", color: "bg-green-100 text-green-800" },
      1: { min: 14, max: 26, level: "Moderate Stress", severity: "moderate", color: "bg-yellow-100 text-yellow-800" },
      2: { min: 27, max: 40, level: "High Stress", severity: "high", color: "bg-red-100 text-red-800" }
    },
    questions: [
      {
        id: "pss10_1",
        text: "Felt upset because of unexpected events?",
        type: "likert",
        options: [
          { value: 0, label: "Never" },
          { value: 1, label: "Almost never" },
          { value: 2, label: "Sometimes" },
          { value: 3, label: "Fairly often" },
          { value: 4, label: "Very often" }
        ]
      },
      {
        id: "pss10_2",
        text: "Felt unable to control important things in your life?",
        type: "likert",
        options: [
          { value: 0, label: "Never" },
          { value: 1, label: "Almost never" },
          { value: 2, label: "Sometimes" },
          { value: 3, label: "Fairly often" },
          { value: 4, label: "Very often" }
        ]
      },
      {
        id: "pss10_3",
        text: "Felt nervous and stressed?",
        type: "likert",
        options: [
          { value: 0, label: "Never" },
          { value: 1, label: "Almost never" },
          { value: 2, label: "Sometimes" },
          { value: 3, label: "Fairly often" },
          { value: 4, label: "Very often" }
        ]
      },
      {
        id: "pss10_4",
        text: "Felt confident about handling personal problems? (reverse scored)",
        type: "likert",
        reverseScore: true,
        options: [
          { value: 4, label: "Never" },
          { value: 3, label: "Almost never" },
          { value: 2, label: "Sometimes" },
          { value: 1, label: "Fairly often" },
          { value: 0, label: "Very often" }
        ]
      },
      {
        id: "pss10_5",
        text: "Felt that things were going your way? (reverse scored)",
        type: "likert",
        reverseScore: true,
        options: [
          { value: 4, label: "Never" },
          { value: 3, label: "Almost never" },
          { value: 2, label: "Sometimes" },
          { value: 1, label: "Fairly often" },
          { value: 0, label: "Very often" }
        ]
      },
      {
        id: "pss10_6",
        text: "Found you could not cope with all the things you had to do?",
        type: "likert",
        options: [
          { value: 0, label: "Never" },
          { value: 1, label: "Almost never" },
          { value: 2, label: "Sometimes" },
          { value: 3, label: "Fairly often" },
          { value: 4, label: "Very often" }
        ]
      },
      {
        id: "pss10_7",
        text: "Been able to control irritations in your life? (reverse scored)",
        type: "likert",
        reverseScore: true,
        options: [
          { value: 4, label: "Never" },
          { value: 3, label: "Almost never" },
          { value: 2, label: "Sometimes" },
          { value: 1, label: "Fairly often" },
          { value: 0, label: "Very often" }
        ]
      },
      {
        id: "pss10_8",
        text: "Felt you were on top of things? (reverse scored)",
        type: "likert",
        reverseScore: true,
        options: [
          { value: 4, label: "Never" },
          { value: 3, label: "Almost never" },
          { value: 2, label: "Sometimes" },
          { value: 1, label: "Fairly often" },
          { value: 0, label: "Very often" }
        ]
      },
      {
        id: "pss10_9",
        text: "Felt angered because of things out of your control?",
        type: "likert",
        options: [
          { value: 0, label: "Never" },
          { value: 1, label: "Almost never" },
          { value: 2, label: "Sometimes" },
          { value: 3, label: "Fairly often" },
          { value: 4, label: "Very often" }
        ]
      },
      {
        id: "pss10_10",
        text: "Felt difficulties piling up so high you couldn't overcome them?",
        type: "likert",
        options: [
          { value: 0, label: "Never" },
          { value: 1, label: "Almost never" },
          { value: 2, label: "Sometimes" },
          { value: 3, label: "Fairly often" },
          { value: 4, label: "Very often" }
        ]
      }
    ]
  },

  studentAddons: {
    name: "Student Profile & Wellness",
    description: "Let's get to know you and understand your student experience",
    questions: [
      {
        id: "student_name",
        text: "What's your name?",
        type: "text",
        placeholder: "Enter your name",
        required: true
      },
      {
        id: "student_email",
        text: "Your email address",
        type: "text",
        placeholder: "Enter your email",
        required: true
      },
      {
        id: "student_university",
        text: "Which university do you attend?",
        type: "text",
        placeholder: "Enter your university name",
        required: true
      },
      {
        id: "sleep_quality",
        text: "How often do you have trouble sleeping?",
        type: "likert",
        options: [
          { value: 0, label: "Not at all" },
          { value: 1, label: "Several days" },
          { value: 2, label: "More than half the days" },
          { value: 3, label: "Nearly every day" }
        ]
      },
      {
        id: "social_connectedness",
        text: "How often do you feel lonely or isolated?",
        type: "likert",
        options: [
          { value: 0, label: "Not at all" },
          { value: 1, label: "Several days" },
          { value: 2, label: "More than half the days" },
          { value: 3, label: "Nearly every day" }
        ]
      },
      {
        id: "academic_stress",
        text: "How often do you feel overwhelmed by studies/exams?",
        type: "likert",
        options: [
          { value: 0, label: "Not at all" },
          { value: 1, label: "Several days" },
          { value: 2, label: "More than half the days" },
          { value: 3, label: "Nearly every day" }
        ]
      },
      {
        id: "support_system",
        text: "Do you have people you can talk to when you're struggling?",
        type: "yesno",
        options: [
          { value: 1, label: "Yes" },
          { value: 0, label: "No" }
        ]
      },
      {
        id: "coping_strategies",
        text: "What helps you cope with stress? (Optional)",
        type: "text",
        optional: true,
        placeholder: "e.g., exercise, music, talking to friends..."
      }
    ]
  }
}

// Helper function to calculate scores for each assessment
export const calculateScores = (answers) => {
  const scores = {}
  
  // PHQ-9 Score
  const phq9Answers = Object.keys(answers).filter(key => key.startsWith('phq9_'))
  if (phq9Answers.length > 0) {
    scores.phq9 = phq9Answers.reduce((sum, key) => sum + (answers[key] || 0), 0)
    scores.phq9Level = getScoreLevel(scores.phq9, questionSets.phq9.interpretation)
  }
  
  // GAD-7 Score
  const gad7Answers = Object.keys(answers).filter(key => key.startsWith('gad7_'))
  if (gad7Answers.length > 0) {
    scores.gad7 = gad7Answers.reduce((sum, key) => sum + (answers[key] || 0), 0)
    scores.gad7Level = getScoreLevel(scores.gad7, questionSets.gad7.interpretation)
  }
  
  // PSS-10 Score (with reverse scoring)
  const pss10Answers = Object.keys(answers).filter(key => key.startsWith('pss10_'))
  if (pss10Answers.length > 0) {
    scores.pss10 = pss10Answers.reduce((sum, key) => {
      let value = answers[key] || 0
      // Reverse scoring is already handled in the question options
      return sum + value
    }, 0)
    scores.pss10Level = getScoreLevel(scores.pss10, questionSets.pss10.interpretation)
  }
  
  return scores
}

// Helper function to determine score level
const getScoreLevel = (score, interpretation) => {
  for (const level of Object.values(interpretation)) {
    if (score >= level.min && score <= level.max) {
      return level
    }
  }
  return interpretation[0] // Default to minimal/low
}

// Generate personalized recommendations based on scores
export const generateRecommendations = (scores, answers) => {
  const recommendations = []
  
  // Depression recommendations
  if (scores.phq9Level && scores.phq9Level.severity !== 'minimal') {
    if (scores.phq9 >= 15) {
      recommendations.push({
        type: 'urgent',
        title: 'Consider Professional Support',
        description: 'Your responses suggest you may benefit from speaking with a counselor or mental health professional.',
        actions: ['Schedule counseling appointment', 'Contact student support services']
      })
    } else if (scores.phq9 >= 10) {
      recommendations.push({
        type: 'important',
        title: 'Focus on Mood Support',
        description: 'Try mood-boosting activities and consider talking to someone you trust.',
        actions: ['Daily mood tracking', 'Practice gratitude journaling', 'Connect with friends']
      })
    }
  }
  
  // Anxiety recommendations
  if (scores.gad7Level && scores.gad7Level.severity !== 'minimal') {
    if (scores.gad7 >= 15) {
      recommendations.push({
        type: 'urgent',
        title: 'Anxiety Management Support',
        description: 'Consider professional guidance for managing anxiety symptoms.',
        actions: ['Practice deep breathing', 'Try progressive muscle relaxation', 'Seek counseling']
      })
    } else if (scores.gad7 >= 10) {
      recommendations.push({
        type: 'important',
        title: 'Stress Reduction Techniques',
        description: 'Focus on relaxation and anxiety management techniques.',
        actions: ['Daily meditation', 'Regular exercise', 'Limit caffeine']
      })
    }
  }
  
  // Stress recommendations
  if (scores.pss10Level && scores.pss10Level.severity === 'high') {
    recommendations.push({
      type: 'important',
      title: 'Stress Management Priority',
      description: 'Your stress levels are high. Focus on stress reduction and self-care.',
      actions: ['Time management techniques', 'Regular breaks', 'Physical activity']
    })
  }
  
  // Sleep recommendations
  if (answers.sleep_quality >= 2) {
    recommendations.push({
      type: 'helpful',
      title: 'Sleep Hygiene',
      description: 'Improve your sleep quality with better sleep habits.',
      actions: ['Consistent sleep schedule', 'Limit screen time before bed', 'Relaxation techniques']
    })
  }
  
  // Social support recommendations
  if (answers.social_connectedness >= 2 || answers.support_system === 0) {
    recommendations.push({
      type: 'helpful',
      title: 'Build Social Connections',
      description: 'Strengthen your support network and reduce feelings of isolation.',
      actions: ['Join study groups', 'Participate in campus activities', 'Reach out to friends']
    })
  }
  
  return recommendations
}
