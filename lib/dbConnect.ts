import mongoose from 'mongoose'

type ConnectionObject = {
  isConnected?: number
}

const connection: ConnectionObject = {}

async function dbConnect(): Promise<void> {
  // Check if we already have a connection
  if (connection.isConnected) {
    console.log('Already connected to database')
    return
  }

  try {
    // Try to connect to the database
    const db = await mongoose.connect(process.env.MONGODB_URI || '', {
      dbName: 'mindfulU' // Specify database name
    })

    connection.isConnected = db.connections[0].readyState

    console.log('MongoDB connected successfully')
  } catch (error) {
    console.error('Database connection failed:', error)
    
    // Graceful exit in case of connection error
    process.exit(1)
  }
}

export default dbConnect
