import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedDatabase() {
  try {
    console.log('Starting database seed...')

    // Check if any users exist
    const userCount = await prisma.user.count()
    console.log(`Current user count: ${userCount}`)

    if (userCount === 0) {
      console.log('Creating sample users...')
      
      // Create a sample user (this would normally be created through signup)
      const sampleUser = await prisma.user.create({
        data: {
          name: 'Test Student',
          email: 'test@student.edu',
          university: 'Sample University',
          dateOfBirth: '2000-01-01',
        }
      })

      console.log('Created sample user:', sampleUser.email)

      // Create sample assessment
      await prisma.assessment.create({
        data: {
          userId: sampleUser.id,
          phq9Score: 8,
          gad7Score: 6,
          pss10Score: 15,
          overallWellnessScore: 29,
          riskLevel: 'MODERATE',
          answers: JSON.stringify({
            phq9: [1, 1, 2, 1, 0, 1, 1, 0, 1],
            gad7: [1, 1, 1, 1, 1, 0, 1],
            pss10: [2, 1, 2, 1, 2, 1, 2, 1, 1, 1]
          }),
          recommendations: JSON.stringify([
            'Consider talking to a counselor',
            'Try meditation and breathing exercises',
            'Maintain a regular sleep schedule'
          ])
        }
      })

      // Create sample journal entries
      await prisma.journalEntry.createMany({
        data: [
          {
            userId: sampleUser.id,
            title: 'First Day of Semester',
            content: 'Feeling excited and nervous about the new semester. Looking forward to my new classes.',
            mood: 'hopeful',
            tags: JSON.stringify(['school', 'new-semester', 'excitement'])
          },
          {
            userId: sampleUser.id,
            title: 'Stress Management',
            content: 'Today I tried some breathing exercises when I felt overwhelmed. It actually helped!',
            mood: 'calm',
            tags: JSON.stringify(['stress-relief', 'breathing', 'wellness'])
          }
        ]
      })

      // Create sample mood entries
      await prisma.moodEntry.createMany({
        data: [
          {
            userId: sampleUser.id,
            mood: 'happy',
            notes: 'Great day with friends',
          },
          {
            userId: sampleUser.id,
            mood: 'anxious',
            notes: 'Upcoming exam stress',
          },
          {
            userId: sampleUser.id,
            mood: 'calm',
            notes: 'After meditation session',
          }
        ]
      })

      console.log('Sample data created successfully!')
    } else {
      console.log('Database already has users, skipping seed.')
    }

    // Print summary
    const stats = {
      users: await prisma.user.count(),
      assessments: await prisma.assessment.count(),
      journalEntries: await prisma.journalEntry.count(),
      moodEntries: await prisma.moodEntry.count(),
    }

    console.log('Database summary:', stats)

  } catch (error) {
    console.error('Error seeding database:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the seed function
seedDatabase()
