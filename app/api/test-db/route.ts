import { NextResponse } from "next/server"
import dbConnect from "@/lib/dbConnect"
import mongoose from "mongoose"

export async function GET() {
  try {
    await dbConnect()
    
    // Test basic database connection
    const collections = await mongoose.connection.db?.listCollections().toArray()
    const dbName = mongoose.connection.db?.databaseName
    
    return NextResponse.json({
      status: "success",
      message: "MongoDB connection successful",
      data: {
        database: dbName,
        collections: collections?.map(c => c.name) || [],
        connectionState: mongoose.connection.readyState, // 1 = connected
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
