# Modern Onboarding Questionnaire System

## 🎯 Overview

I've successfully refactored and redesigned the onboarding questionnaire into a modern, reusable component system using React + TailwindCSS + Framer Motion. Here's what was implemented:

## 📁 Component Structure

```
components/Questionnaire/
├── QuestionCard.tsx      → Individual question renderer with animations
├── ProgressBar.tsx       → Animated progress indicator  
├── Questionnaire.tsx     → Main container with navigation logic
├── questionData.js       → Standardized psychological screening tools
└── index.ts             → Clean exports
```

## 🧠 Standardized Assessment Tools

### 1. **PHQ-9 (Depression Screening)** 
- 9 questions, 0-3 scale
- Scoring: 0-4 (Minimal), 5-9 (Mild), 10-14 (Moderate), 15-19 (Moderately Severe), 20-27 (Severe)

### 2. **GAD-7 (Anxiety Screening)**
- 7 questions, 0-3 scale  
- Scoring: 0-4 (Minimal), 5-9 (Mild), 10-14 (Moderate), 15-21 (Severe)

### 3. **PSS-10 (Perceived Stress Scale)**
- 10 questions, 0-4 scale
- Includes reverse-scored items
- Scoring: 0-13 (Low), 14-26 (Moderate), 27-40 (High Stress)

### 4. **Student-Specific Add-ons**
- Sleep quality assessment
- Social connectedness 
- Academic stress levels
- Support system evaluation
- Optional text responses

## 🎨 Design Features

### **Calm & Student-Friendly UI**
- Soft pastel gradient backgrounds
- Rounded corner card layouts
- Gentle color palette optimized for wellness
- Accessible typography and spacing

### **Smooth Animations**
- Question transitions with slide/fade effects
- Progress bar with smooth filling animation
- Staggered option reveals for better UX
- Loading states with micro-interactions

### **Modern Components**
- Fully responsive design
- Touch-friendly interface
- Proper ARIA labels for accessibility
- TypeScript support with proper interfaces

## 🚀 Key Features

### **Step-by-Step Flow**
- One question per screen for focus
- Clear progress indication
- Previous/Next navigation
- Smart validation (optional questions handled)

### **Multiple Question Types**
- **Likert Scale**: Radio buttons with proper labeling
- **Yes/No**: Toggle switches with visual feedback  
- **Free Text**: Optional text areas with character limits

### **Smart Assessment Logic**
- Automatic score calculation
- Clinical interpretation of results
- Personalized recommendations based on scores
- Risk level identification

### **End Screen Summary**
- Visual score breakdown with color coding
- Personalized recommendations
- Action items based on assessment results
- Clear path to dashboard

## 📊 Assessment Results & Recommendations

The system provides intelligent recommendations based on combined scores:

### **High Risk Indicators**
- PHQ-9 ≥ 15 or GAD-7 ≥ 15 → Counseling referral
- Combined high scores → Multi-modal support recommendations

### **Personalized Interventions**
- **High Anxiety + Poor Sleep** → Breathing exercises + sleep hygiene
- **High Stress + Academic Pressure** → Time management + stress reduction
- **Social Isolation** → Peer connection + support group suggestions

### **Dashboard Integration**
- Results saved to local storage
- Scores influence dashboard personalization
- Recommendations appear as actionable cards

## 🔧 Technical Implementation

### **Data Structure**
```javascript
const questionSets = {
  phq9: { questions: [...], interpretation: {...} },
  gad7: { questions: [...], interpretation: {...} },
  pss10: { questions: [...], interpretation: {...} },
  studentAddons: { questions: [...] }
}
```

### **Score Calculation**
```javascript
const scores = calculateScores(answers)
// Returns: { phq9: 12, phq9Level: {level: "Moderate"}, ... }
```

### **Recommendation Engine**
```javascript
const recommendations = generateRecommendations(scores, answers)
// Returns personalized action items
```

## 🎯 Usage

### **In Onboarding Flow**
```tsx
<Questionnaire onComplete={(results) => {
  console.log(results) // scores, recommendations, answers
}} />
```

### **Welcome Screen**
The system includes a beautiful welcome screen that:
- Explains the assessment purpose
- Collects basic user info (name, email)
- Shows privacy information
- Lists what will be assessed

### **Results Display**
- Color-coded score badges
- Clinical interpretation
- Personalized recommendations with icons
- Clear call-to-action buttons

## 📱 Responsive Design

- **Mobile-first approach** with touch-friendly controls
- **Tablet optimization** with proper spacing
- **Desktop enhancement** with hover effects
- **Accessibility compliance** with screen reader support

## 🔒 Privacy & Ethics

- **Local storage only** - no data transmitted
- **Clinical disclaimers** - not a replacement for professional diagnosis
- **Transparent scoring** - users see their results
- **Ethical guidelines** - based on validated assessment tools

## ✨ Animation Details

- **Page transitions**: Smooth slide effects between questions
- **Progress bar**: Animated filling with percentage display
- **Option reveals**: Staggered animations for better focus
- **Loading states**: Subtle spinners and transitions
- **Completion celebration**: Success animation and positive messaging

This modern questionnaire system provides a professional-grade mental health assessment tool that's both scientifically sound and user-friendly, perfect for student wellness applications.
