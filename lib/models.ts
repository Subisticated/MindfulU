import mongoose, { Schema, Document, Model } from 'mongoose'

// Types for the documents
export interface IUser extends Document {
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

export interface IAccount extends Document {
  userId: mongoose.Types.ObjectId
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

export interface ISession extends Document {
  sessionToken: string
  userId: mongoose.Types.ObjectId
  expires: Date
}

export interface IVerificationToken extends Document {
  identifier: string
  token: string
  expires: Date
}

export interface IAssessment extends Document {
  userId: mongoose.Types.ObjectId
  phq9Score: number
  gad7Score: number
  pss10Score: number
  overallWellnessScore: number
  riskLevel: string
  answers: object
  recommendations?: object
  completedAt: Date
}

export interface IJournalEntry extends Document {
  userId: mongoose.Types.ObjectId
  title: string
  content: string
  mood?: string
  tags?: string[]
  createdAt: Date
  updatedAt: Date
}

export interface IMoodEntry extends Document {
  userId: mongoose.Types.ObjectId
  mood: string
  notes?: string
  createdAt: Date
}

// User Schema
const UserSchema = new Schema<IUser>({
  name: { type: String },
  email: { type: String, required: true },
  emailVerified: { type: Date },
  image: { type: String },
  password: { type: String },
  university: { type: String },
  dateOfBirth: { type: String }
}, {
  collection: 'users',
  timestamps: true
})

// Account Schema
const AccountSchema = new Schema<IAccount>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true },
  provider: { type: String, required: true },
  providerAccountId: { type: String, required: true },
  refresh_token: { type: String },
  access_token: { type: String },
  expires_at: { type: Number },
  token_type: { type: String },
  scope: { type: String },
  id_token: { type: String },
  session_state: { type: String }
}, {
  collection: 'accounts'
})

// Session Schema
const SessionSchema = new Schema<ISession>({
  sessionToken: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  expires: { type: Date, required: true }
}, {
  collection: 'sessions'
})

// Verification Token Schema
const VerificationTokenSchema = new Schema<IVerificationToken>({
  identifier: { type: String, required: true },
  token: { type: String, required: true, unique: true },
  expires: { type: Date, required: true }
}, {
  collection: 'verificationtokens'
})

// Assessment Schema
const AssessmentSchema = new Schema<IAssessment>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  phq9Score: { type: Number, required: true },
  gad7Score: { type: Number, required: true },
  pss10Score: { type: Number, required: true },
  overallWellnessScore: { type: Number, required: true },
  riskLevel: { type: String, required: true },
  answers: { type: Schema.Types.Mixed, required: true },
  recommendations: { type: Schema.Types.Mixed },
  completedAt: { type: Date, default: Date.now }
}, {
  collection: 'assessments'
})

// Journal Entry Schema
const JournalEntrySchema = new Schema<IJournalEntry>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  mood: { type: String },
  tags: [{ type: String }]
}, {
  collection: 'journal_entries',
  timestamps: true
})

// Mood Entry Schema
const MoodEntrySchema = new Schema<IMoodEntry>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  mood: { type: String, required: true },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now }
}, {
  collection: 'mood_entries'
})

// Add indexes for better performance
UserSchema.index({ email: 1 })
AccountSchema.index({ provider: 1, providerAccountId: 1 }, { unique: true })
SessionSchema.index({ sessionToken: 1 })
VerificationTokenSchema.index({ identifier: 1, token: 1 }, { unique: true })
AssessmentSchema.index({ userId: 1, completedAt: -1 })
JournalEntrySchema.index({ userId: 1, createdAt: -1 })
MoodEntrySchema.index({ userId: 1, createdAt: -1 })

// Create models with proper error handling
export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema)
export const Account: Model<IAccount> = mongoose.models.Account || mongoose.model<IAccount>('Account', AccountSchema)
export const Session: Model<ISession> = mongoose.models.Session || mongoose.model<ISession>('Session', SessionSchema)
export const VerificationToken: Model<IVerificationToken> = mongoose.models.VerificationToken || mongoose.model<IVerificationToken>('VerificationToken', VerificationTokenSchema)
export const Assessment: Model<IAssessment> = mongoose.models.Assessment || mongoose.model<IAssessment>('Assessment', AssessmentSchema)
export const JournalEntry: Model<IJournalEntry> = mongoose.models.JournalEntry || mongoose.model<IJournalEntry>('JournalEntry', JournalEntrySchema)
export const MoodEntry: Model<IMoodEntry> = mongoose.models.MoodEntry || mongoose.model<IMoodEntry>('MoodEntry', MoodEntrySchema)
