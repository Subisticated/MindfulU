import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import dbConnect from "@/lib/dbConnect"
import { User, Assessment, JournalEntry, MoodEntry } from "@/lib/models"

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    console.log('Fetching user profile for:', session.user.email)

    // Find the user by email
    const user = await User.findOne({ email: session.user.email })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Get user's assessments, journal entries, and mood entries
    const [assessments, journalEntries, moodEntries] = await Promise.all([
      Assessment.find({ userId: user._id }).sort({ completedAt: -1 }),
      JournalEntry.find({ userId: user._id }).sort({ createdAt: -1 }),
      MoodEntry.find({ userId: user._id }).sort({ createdAt: -1 })
    ])

    const hasCompletedAssessment = assessments.length > 0
    const latestAssessment = assessments[0] || null

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
        university: user.university,
        dateOfBirth: user.dateOfBirth,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        _count: {
          assessments: assessments.length,
          journalEntries: journalEntries.length,
          moods: moodEntries.length
        }
      },
      assessments: assessments.map(a => ({
        id: a._id,
        phq9Score: a.phq9Score,
        gad7Score: a.gad7Score,
        pss10Score: a.pss10Score,
        overallWellnessScore: a.overallWellnessScore,
        riskLevel: a.riskLevel,
        completedAt: a.completedAt
      })),
      journalEntries: journalEntries.map(j => ({
        id: j._id,
        title: j.title,
        content: j.content,
        mood: j.mood,
        tags: j.tags ? JSON.parse(j.tags) : [],
        createdAt: j.createdAt,
        updatedAt: j.updatedAt
      })),
      moodEntries: moodEntries.map(m => ({
        id: m._id,
        mood: m.mood,
        notes: m.notes,
        createdAt: m.createdAt
      })),
      hasCompletedAssessment,
      latestAssessment: latestAssessment ? {
        id: latestAssessment._id,
        overallWellnessScore: latestAssessment.overallWellnessScore,
        riskLevel: latestAssessment.riskLevel,
        completedAt: latestAssessment.completedAt
      } : null
    })

  } catch (error: any) {
    console.error("User profile fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch user profile" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    await dbConnect()
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { name, university, dateOfBirth } = await request.json()

    // Find and update the user
    const user = await User.findOneAndUpdate(
      { email: session.user.email },
      {
        ...(name && { name }),
        ...(university && { university }),
        ...(dateOfBirth && { dateOfBirth }),
      },
      { new: true, select: 'name email image university dateOfBirth updatedAt' }
    )

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
        university: user.university,
        dateOfBirth: user.dateOfBirth,
        updatedAt: user.updatedAt,
      },
      message: "Profile updated successfully"
    })

  } catch (error: any) {
    console.error("User profile update error:", error)
    return NextResponse.json(
      { error: "Failed to update user profile" },
      { status: 500 }
    )
  }
}
