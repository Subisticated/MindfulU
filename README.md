# MindfulU - Student Wellness Companion

A comprehensive mental health and wellness platform designed specifically for students, providing personalized tools for mood tracking, journaling, and mental health support.

## 🌟 Features

### 🧠 Mental Health Assessment
- **PHQ-9 Depression Screening**: Validated questionnaire for depression assessment
- **GAD-7 Anxiety Screening**: Professional anxiety evaluation tool
- **PSS-10 Stress Assessment**: Comprehensive stress level measurement
- **Student-Specific Questions**: Additional questions tailored for student life challenges
- **Personalized Risk Assessment**: Automated risk level calculation and recommendations

### 📝 Smart Onboarding System
- **Persistent Answer Recovery**: Automatically saves and recovers answers if interrupted
- **Cookie-Based Storage**: Seamless experience across browser sessions
- **Progress Tracking**: Visual progress bar with section transitions
- **Auto-Redirect**: Automatic dashboard redirect after completion
- **Manual Override**: Option to proceed manually or cancel auto-redirect

### 📚 Digital Journaling
- **Rich Text Entries**: Create detailed journal entries with titles and content
- **Tag System**: Organize entries with custom tags
- **Mood Tracking**: Associate mood states with journal entries
- **Search & Filter**: Find entries by title, content, or tags
- **Persistent Storage**: All entries saved securely with timestamps

### 📊 Wellness Dashboard
- **Personalized Insights**: Tailored recommendations based on assessment results
- **Mood History**: Visual tracking of emotional patterns over time
- **Quick Actions**: Easy access to wellness tools and resources
- **Risk-Based Content**: Content adaptation based on individual risk levels

### 🎯 Wellness Tools
- **Guided Meditation**: Access to meditation resources
- **Breathing Exercises**: Stress reduction techniques
- **Focus Timer**: Productivity and mindfulness tools
- **AI Mood Coach**: Intelligent support and recommendations

### 👩‍⚕️ Counselor Support
- **Appointment Booking**: Schedule sessions with mental health professionals
- **Anonymous Options**: Support for privacy-conscious users
- **Counselor Dashboard**: Professional interface for managing student appointments
- **Session Management**: Complete booking and scheduling system

## 🛠️ Technical Architecture

### Frontend Framework
- **Next.js 14+**: Modern React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Framer Motion**: Smooth animations and transitions

### UI Components
- **shadcn/ui**: High-quality, accessible component library
- **Lucide React**: Beautiful, consistent iconography
- **Responsive Design**: Mobile-first approach

### State Management
- **React Context**: Global state management
- **Custom Hooks**: Reusable logic abstraction
- **Cookie Storage**: Persistent data across sessions

### Data Persistence
- **js-cookie**: Browser cookie management
- **LocalStorage Integration**: Fallback storage mechanism
- **Automatic Sync**: Real-time data synchronization

## 🗂️ Project Structure

```
mindfulU/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                  # Landing page with auto-redirect
│   ├── onboarding/              # Assessment questionnaire
│   ├── dashboard/               # Main user dashboard
│   ├── journal/                 # Journaling interface
│   ├── booking/                 # Appointment scheduling
│   ├── counselor-dashboard/     # Professional interface
│   ├── meditation/              # Wellness tools
│   ├── breathing/               # Breathing exercises
│   ├── focus-timer/             # Productivity tools
│   ├── ai-assistant/            # AI mood coach
│   └── settings/                # User preferences
├── components/                   # Reusable UI components
│   ├── Questionnaire/           # Assessment system
│   │   ├── Questionnaire.tsx    # Main questionnaire logic
│   │   ├── QuestionCard.tsx     # Individual question display
│   │   ├── ProgressBar.tsx      # Progress visualization
│   │   └── questionData.js      # Assessment data & scoring
│   ├── ui/                      # Base UI components
│   ├── navbar.tsx               # Navigation component
│   ├── sidebar.tsx              # Dashboard sidebar
│   ├── journal-modal.tsx        # Journal entry modal
│   └── local-storage-provider.tsx # Global state management
├── lib/                         # Utility libraries
│   ├── cookie-storage.ts        # Data persistence logic
│   └── utils.ts                 # Helper functions
└── public/                      # Static assets
```

## 🔧 Key Components

### Assessment System (`components/Questionnaire/`)
- **Questionnaire.tsx**: Main assessment logic with persistence and scoring
- **QuestionCard.tsx**: Individual question rendering with animations
- **ProgressBar.tsx**: Visual progress tracking
- **questionData.js**: PHQ-9, GAD-7, PSS-10 question sets and scoring algorithms

### Data Management (`lib/cookie-storage.ts`)
- User profile management
- Assessment data storage
- Journal entry CRUD operations
- Personalized recommendation engine

### State Management (`components/local-storage-provider.tsx`)
- Global application state
- Cookie-localStorage sync
- Real-time data updates
- Context provider for all pages

## 🎨 Design Philosophy

### User Experience
- **Calm & Supportive**: Soothing color palette and gentle animations
- **Privacy-First**: Anonymous options and secure data handling
- **Accessible**: WCAG-compliant components and interactions
- **Mobile-Responsive**: Seamless experience across all devices

### Technical Principles
- **Type Safety**: Full TypeScript implementation
- **Performance**: Optimized rendering and data loading
- **Reliability**: Robust error handling and data recovery
- **Scalability**: Modular architecture for future expansion

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (preferred) or npm

### Installation
```bash
# Clone the repository
git clone https://github.com/Subisticated/MindfulU.git

# Navigate to project directory
cd MindfulU

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

### Environment Setup
The application runs entirely on the client-side with cookie-based storage, so no additional environment configuration is required.

## 📱 Usage Flow

1. **Landing Page**: New users see the welcome screen, returning users auto-redirect to dashboard
2. **Onboarding**: Complete the comprehensive mental health assessment
3. **Assessment**: Answer PHQ-9, GAD-7, PSS-10, and student-specific questions
4. **Results**: View personalized risk assessment and recommendations
5. **Dashboard**: Access personalized wellness tools and insights
6. **Journaling**: Create and manage personal journal entries
7. **Booking**: Schedule appointments with counselors if needed

## 🔒 Privacy & Security

- **Client-Side Storage**: All data stored locally in browser cookies
- **Anonymous Options**: Support for anonymous usage
- **No Server Dependency**: Fully client-side application
- **Data Ownership**: Users maintain complete control over their data

## 🎯 Target Audience

- **Primary**: College and university students
- **Secondary**: High school students and young adults
- **Tertiary**: Mental health professionals working with students

## 🔮 Future Enhancements

### Planned Features
- **Data Export**: Export journal entries and assessment history
- **Reminder System**: Customizable notifications for wellness activities
- **Progress Tracking**: Visual charts showing wellness trends over time
- **Community Features**: Anonymous peer support groups
- **Integration**: Campus counseling service integration

### Technical Improvements
- **Offline Support**: Service worker for offline functionality
- **Data Encryption**: Enhanced security for sensitive data
- **Performance**: Further optimization for mobile devices
- **Accessibility**: Enhanced screen reader support

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines for details on:
- Code style and standards
- Pull request process
- Issue reporting
- Feature requests

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support, please:
- Open an issue on GitHub
- Contact the development team
- Check the documentation wiki

## 🙏 Acknowledgments

- **Mental Health Professionals**: For guidance on assessment tools
- **Students**: For feedback and user testing
- **Open Source Community**: For the amazing tools and libraries
- **shadcn/ui**: For the beautiful component library
- **Vercel**: For Next.js and deployment platform

---

Built with ❤️ for student mental health and wellness.
