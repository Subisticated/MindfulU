import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    // Test basic database connection
    const userCount = await prisma.user.count()
    const assessmentCount = await prisma.assessment.count()
    const journalCount = await prisma.journalEntry.count()
    
    // Test creating a simple record
    const testConnection = await prisma.$executeRaw`SELECT 1 as test`
    
    return NextResponse.json({
      status: "success",
      message: "Database connection successful",
      data: {
        userCount,
        assessmentCount,
        journalCount,
        connectionTest: testConnection
      }
    })
  } catch (error: any) {
    return NextResponse.json({
      status: "error",
      message: "Database connection failed",
      error: error.message
    }, { status: 500 })
  }
}
