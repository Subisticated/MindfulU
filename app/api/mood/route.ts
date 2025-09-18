import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import connectToDatabase from "@/lib/mongodb"
import { User, MoodEntry } from "@/lib/models"

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase()
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { mood, notes } = await request.json()

    // Validate required fields
    if (!mood) {
      return NextResponse.json(
        { error: "Missing required field: mood" },
        { status: 400 }
      )
    }

    // Find the user by email
    const user = await User.findOne({ email: session.user.email })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Create mood entry
    const moodEntry = await MoodEntry.create({
      userId: user._id,
      mood,
      notes: notes || undefined,
    })

    return NextResponse.json({
      success: true,
      moodEntry: {
        id: moodEntry._id,
        mood: moodEntry.mood,
        notes: moodEntry.notes,
        createdAt: moodEntry.createdAt,
      },
      message: "Mood tracked successfully"
    })

  } catch (error: any) {
    console.error("Mood entry save error:", error)
    return NextResponse.json(
      { error: "Failed to save mood entry" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get("days") || "30")

    // Find the user by email
    const user = await User.findOne({ email: session.user.email })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Get user's mood entries for the specified number of days
    const fromDate = new Date()
    fromDate.setDate(fromDate.getDate() - days)

    const moodEntries = await MoodEntry.find({ 
      userId: user._id,
      createdAt: {
        $gte: fromDate
      }
    }).sort({ createdAt: -1 })

    return NextResponse.json({
      success: true,
      moodEntries
    })

  } catch (error: any) {
    console.error("Mood entries fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch mood entries" },
      { status: 500 }
    )
  }
}
