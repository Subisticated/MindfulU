import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import dbConnect from "@/lib/dbConnect"
import { User } from "@/lib/models"

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    
    const { name, email, password, university } = await request.json()

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      university: university || null,
    })

    // Return user without password
    const userObject = user.toObject()
    const { password: _, ...userWithoutPassword } = userObject

    return NextResponse.json(
      { 
        message: "User created successfully",
        user: { ...userWithoutPassword, id: (user as any)._id.toString() }
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
