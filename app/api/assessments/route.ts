import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import dbConnect from "@/lib/dbConnect"
import { User, Assessment, IAssessment } from "@/lib/models"
import mongoose from "mongoose"

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

    const requestBody = await request.json()
    console.log('Assessment API received data:', JSON.stringify(requestBody, null, 2))

    const { 
      phq9Score = 0,
      gad7Score = 0,
      pss10Score = 0,
      overallWellnessScore,
      riskLevel = "mild",
      answers, 
      recommendations
    } = requestBody

    // Validate required fields
    if (!answers || typeof overallWellnessScore !== "number") {
      console.error('Validation failed:', {
        answers: !!answers,
        overallWellnessScore,
        typeOfOverallWellnessScore: typeof overallWellnessScore
      })
      return NextResponse.json(
        { error: "Missing required fields: answers and overallWellnessScore", receivedData: requestBody },
        { status: 400 }
      )
    }

    // Find or create the user by email
    let user = await User.findOne({ email: session.user.email })

    if (!user) {
      // Create the user if they don't exist
      user = await User.create({
        email: session.user.email,
        name: session.user.name || '',
        university: '',
      })
      console.log('Created new user:', user.email)
    }

    // Create assessment record
    const assessment = await Assessment.create({
      userId: user._id,
      phq9Score,
      gad7Score,
      pss10Score,
      overallWellnessScore,
      riskLevel,
      answers: typeof answers === 'string' ? answers : JSON.stringify(answers),
      recommendations: recommendations ? (typeof recommendations === 'string' ? recommendations : JSON.stringify(recommendations)) : null,
    })

    return NextResponse.json({
      success: true,
      assessmentId: assessment._id.toString(),
      message: "Assessment saved successfully"
    })

  } catch (error: any) {
    console.error("Assessment save error:", error)
    return NextResponse.json(
      { error: "Failed to save assessment" },
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

    // Find the user by email
    const user = await User.findOne({ email: session.user.email })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Get user's assessments
    const assessments = await Assessment.find({ userId: user._id })
      .sort({ completedAt: -1 })
      .limit(10) // Get last 10 assessments

    // Parse JSON fields
    const parsedAssessments = assessments.map((assessment: any) => ({
      ...assessment.toObject(),
      id: assessment._id.toString(),
      answers: JSON.parse(assessment.answers),
      recommendations: assessment.recommendations ? JSON.parse(assessment.recommendations) : null,
    }))

    return NextResponse.json({
      success: true,
      assessments: parsedAssessments
    })

  } catch (error: any) {
    console.error("Assessment fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch assessments" },
      { status: 500 }
    )
  }
}
