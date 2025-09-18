import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import dbConnect from "@/lib/dbConnect"
import { User, JournalEntry } from "@/lib/models"

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { title, content, mood, tags } = await request.json()

    // Validate required fields
    if (!title || !content) {
      return NextResponse.json(
        { error: "Missing required fields: title and content" },
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

    // Create journal entry
    const journalEntry = await JournalEntry.create({
      userId: user._id,
      title,
      content,
      mood: mood || undefined,
      tags: tags ? (typeof tags === 'string' ? tags : JSON.stringify(tags)) : undefined,
    })

    return NextResponse.json({
      success: true,
      journalEntry: {
        id: journalEntry._id,
        title: journalEntry.title,
        content: journalEntry.content,
        mood: journalEntry.mood,
        tags: journalEntry.tags ? JSON.parse(journalEntry.tags) : null,
        createdAt: journalEntry.createdAt,
        updatedAt: journalEntry.updatedAt,
      },
      message: "Journal entry saved successfully"
    })

  } catch (error: any) {
    console.error("Journal entry save error:", error)
    return NextResponse.json(
      { error: "Failed to save journal entry" },
      { status: 500 }
    )
  }
}

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

    // Find the user by email
    const user = await User.findOne({ email: session.user.email })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Get user's journal entries
    const journalEntries = await JournalEntry.find({ userId: user._id }).sort({ createdAt: -1 })

    // Parse tags if they exist
    const parsedEntries = journalEntries.map((entry: any) => ({
      id: entry._id,
      title: entry.title,
      content: entry.content,
      mood: entry.mood,
      tags: entry.tags ? JSON.parse(entry.tags) : null,
      createdAt: entry.createdAt,
      updatedAt: entry.updatedAt,
    }))

    return NextResponse.json({
      success: true,
      journalEntries: parsedEntries
    })

  } catch (error: any) {
    console.error("Journal entries fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch journal entries" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await dbConnect()
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Get the journal entry ID from the request URL
    const url = new URL(request.url)
    const journalId = url.searchParams.get('id')

    if (!journalId) {
      return NextResponse.json(
        { error: "Missing journal entry ID" },
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

    // Find and delete the journal entry (only if it belongs to the user)
    const deletedEntry = await JournalEntry.findOneAndDelete({
      _id: journalId,
      userId: user._id
    })

    if (!deletedEntry) {
      return NextResponse.json(
        { error: "Journal entry not found or you don't have permission to delete it" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Journal entry deleted successfully",
      deletedEntry: {
        id: deletedEntry._id,
        title: deletedEntry.title
      }
    })

  } catch (error: any) {
    console.error("Journal entry deletion error:", error)
    return NextResponse.json(
      { error: "Failed to delete journal entry" },
      { status: 500 }
    )
  }
}
