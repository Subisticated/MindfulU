import mongoose, { Schema, Document } from 'mongoose'

// User Interface
export interface IUser extends Document {
  _id: string
  name?: string
  email: string
  emailVerified?: Date
  image?: string
  password?: string
  university?: string
  dateOfBirth?: string
  createdAt: Date
  updatedAt: Date
}

// User Schema
const UserSchema = new Schema<IUser>({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  emailVerified: { type: Date },
  image: { type: String },
  password: { type: String },
  university: { type: String },
  dateOfBirth: { type: String },
}, {
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
})

// Account Interface
export interface IAccount extends Document {
  _id: string
  userId: string
  type: string
  provider: string
  providerAccountId: string
  refresh_token?: string
  access_token?: string
  expires_at?: number
  token_type?: string
  scope?: string
  id_token?: string
  session_state?: string
}

// Account Schema
const AccountSchema = new Schema<IAccount>({
  userId: { type: String, required: true },
  type: { type: String, required: true },
  provider: { type: String, required: true },
  providerAccountId: { type: String, required: true },
  refresh_token: { type: String },
  access_token: { type: String },
  expires_at: { type: Number },
  token_type: { type: String },
  scope: { type: String },
  id_token: { type: String },
  session_state: { type: String },
})

AccountSchema.index({ provider: 1, providerAccountId: 1 }, { unique: true })

// Session Interface
export interface ISession extends Document {
  _id: string
  sessionToken: string
  userId: string
  expires: Date
}

// Session Schema
const SessionSchema = new Schema<ISession>({
  sessionToken: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  expires: { type: Date, required: true },
})

// Assessment Interface
export interface IAssessment extends Document {
  _id: string
  userId: string
  phq9Score: number
  gad7Score: number
  pss10Score: number
  overallWellnessScore: number
  riskLevel: string
  answers: string
  recommendations?: string
  completedAt: Date
}

// Assessment Schema
const AssessmentSchema = new Schema<IAssessment>({
  userId: { type: String, required: true },
  phq9Score: { type: Number, required: true },
  gad7Score: { type: Number, required: true },
  pss10Score: { type: Number, required: true },
  overallWellnessScore: { type: Number, required: true },
  riskLevel: { type: String, required: true },
  answers: { type: String, required: true },
  recommendations: { type: String },
  completedAt: { type: Date, default: Date.now },
})

// Journal Entry Interface
export interface IJournalEntry extends Document {
  _id: string
  userId: string
  title: string
  content: string
  mood?: string
  tags?: string
  createdAt: Date
  updatedAt: Date
}

// Journal Entry Schema
const JournalEntrySchema = new Schema<IJournalEntry>({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  mood: { type: String },
  tags: { type: String },
}, {
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
})

// Mood Entry Interface
export interface IMoodEntry extends Document {
  _id: string
  userId: string
  mood: string
  notes?: string
  createdAt: Date
}

// Mood Entry Schema
const MoodEntrySchema = new Schema<IMoodEntry>({
  userId: { type: String, required: true },
  mood: { type: String, required: true },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
})

// Verification Token Interface
export interface IVerificationToken extends Document {
  _id: string
  identifier: string
  token: string
  expires: Date
}

// Verification Token Schema
const VerificationTokenSchema = new Schema<IVerificationToken>({
  identifier: { type: String, required: true },
  token: { type: String, required: true, unique: true },
  expires: { type: Date, required: true },
})

VerificationTokenSchema.index({ identifier: 1, token: 1 }, { unique: true })

// Export Models
export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema)
export const Account = mongoose.models.Account || mongoose.model<IAccount>('Account', AccountSchema)
export const Session = mongoose.models.Session || mongoose.model<ISession>('Session', SessionSchema)
export const Assessment = mongoose.models.Assessment || mongoose.model<IAssessment>('Assessment', AssessmentSchema)
export const JournalEntry = mongoose.models.JournalEntry || mongoose.model<IJournalEntry>('JournalEntry', JournalEntrySchema)
export const MoodEntry = mongoose.models.MoodEntry || mongoose.model<IMoodEntry>('MoodEntry', MoodEntrySchema)
export const VerificationToken = mongoose.models.VerificationToken || mongoose.model<IVerificationToken>('VerificationToken', VerificationTokenSchema)
