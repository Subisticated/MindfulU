"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, User, AlertTriangle, FileText, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"

interface Appointment {
  id: string
  date: string
  time: string
  counselorId: string
  counselorName: string
  type: "individual" | "group" | "crisis"
  isAnonymous: boolean
  studentName?: string
  studentEmail?: string
  studentPhone?: string
  reason: string
  urgency: "low" | "medium" | "high"
  status: "pending" | "confirmed" | "completed" | "cancelled"
  notes?: string
  createdAt: Date
}

interface CaseNote {
  id: string
  appointmentId: string
  studentId: string
  content: string
  riskLevel: "low" | "medium" | "high"
  followUpRequired: boolean
  nextAppointment?: string
  createdAt: Date
  updatedAt: Date
}

export default function CounselorDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [caseNotes, setCaseNotes] = useState<CaseNote[]>([])
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [noteContent, setNoteContent] = useState("")
  const [riskLevel, setRiskLevel] = useState<"low" | "medium" | "high">("low")
  const [followUpRequired, setFollowUpRequired] = useState(false)

  useEffect(() => {
    // Load appointments and case notes from localStorage
    const savedAppointments = localStorage.getItem("appointments")
    const savedCaseNotes = localStorage.getItem("caseNotes")

    if (savedAppointments) {
      setAppointments(JSON.parse(savedAppointments))
    }
    if (savedCaseNotes) {
      setCaseNotes(JSON.parse(savedCaseNotes))
    }
  }, [])

  const updateAppointmentStatus = (appointmentId: string, status: string) => {
    const updatedAppointments = appointments.map((apt) => (apt.id === appointmentId ? { ...apt, status } : apt))
    setAppointments(updatedAppointments)
    localStorage.setItem("appointments", JSON.stringify(updatedAppointments))
  }

  const saveCaseNote = () => {
    if (!selectedAppointment || !noteContent.trim()) return

    const newNote: CaseNote = {
      id: Date.now().toString(),
      appointmentId: selectedAppointment.id,
      studentId: selectedAppointment.isAnonymous ? "anonymous" : selectedAppointment.studentEmail || "unknown",
      content: noteContent,
      riskLevel,
      followUpRequired,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const updatedNotes = [...caseNotes, newNote]
    setCaseNotes(updatedNotes)
    localStorage.setItem("caseNotes", JSON.stringify(updatedNotes))

    // Reset form
    setNoteContent("")
    setRiskLevel("low")
    setFollowUpRequired(false)
    setSelectedAppointment(null)

    alert("Case note saved successfully!")
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const todayAppointments = appointments.filter(
    (apt) => new Date(apt.date).toDateString() === new Date().toDateString(),
  )

  const highRiskCases = caseNotes.filter((note) => note.riskLevel === "high")
  const followUpCases = caseNotes.filter((note) => note.followUpRequired)

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-balance">Counselor Dashboard</h1>
          <p className="text-muted-foreground mt-2">Manage appointments, case notes, and student support</p>
        </div>

        <Tabs defaultValue="appointments" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="case-notes">Case Notes</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="appointments" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Today's Schedule */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Today's Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {todayAppointments.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No appointments scheduled for today</p>
                  ) : (
                    <div className="space-y-3">
                      {todayAppointments.map((appointment) => (
                        <motion.div
                          key={appointment.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 border rounded-lg space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{appointment.time}</span>
                            </div>
                            <div className="flex gap-2">
                              <Badge className={getUrgencyColor(appointment.urgency)}>{appointment.urgency}</Badge>
                              <Badge className={getStatusColor(appointment.status)}>{appointment.status}</Badge>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span>{appointment.isAnonymous ? "Anonymous Student" : appointment.studentName}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              <span className="capitalize">{appointment.type}</span> session
                            </p>
                            <p className="text-sm">{appointment.reason}</p>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateAppointmentStatus(appointment.id, "confirmed")}
                              disabled={appointment.status === "confirmed"}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Confirm
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setSelectedAppointment(appointment)}>
                              <FileText className="h-4 w-4 mr-1" />
                              Add Note
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateAppointmentStatus(appointment.id, "completed")}
                            >
                              Complete
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{todayAppointments.length}</div>
                      <p className="text-sm text-muted-foreground">Today's Appointments</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">{highRiskCases.length}</div>
                      <p className="text-sm text-muted-foreground">High Risk Cases</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">{followUpCases.length}</div>
                      <p className="text-sm text-muted-foreground">Follow-ups Needed</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Case Note Form */}
            {selectedAppointment && (
              <Card>
                <CardHeader>
                  <CardTitle>Add Case Note</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="font-medium">
                      {selectedAppointment.isAnonymous ? "Anonymous Student" : selectedAppointment.studentName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {selectedAppointment.date} at {selectedAppointment.time}
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="note-content">Session Notes</Label>
                    <Textarea
                      id="note-content"
                      value={noteContent}
                      onChange={(e) => setNoteContent(e.target.value)}
                      placeholder="Document session details, observations, and recommendations..."
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Risk Level</Label>
                      <Select value={riskLevel} onValueChange={(value: any) => setRiskLevel(value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low Risk</SelectItem>
                          <SelectItem value="medium">Medium Risk</SelectItem>
                          <SelectItem value="high">High Risk</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="follow-up"
                        checked={followUpRequired}
                        onChange={(e) => setFollowUpRequired(e.target.checked)}
                      />
                      <Label htmlFor="follow-up">Follow-up Required</Label>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={saveCaseNote}>Save Note</Button>
                    <Button variant="outline" onClick={() => setSelectedAppointment(null)}>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="case-notes">
            <Card>
              <CardHeader>
                <CardTitle>Recent Case Notes</CardTitle>
              </CardHeader>
              <CardContent>
                {caseNotes.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No case notes recorded yet</p>
                ) : (
                  <div className="space-y-4">
                    {caseNotes.slice(0, 10).map((note) => (
                      <div key={note.id} className="p-4 border rounded-lg space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">
                            {note.studentId === "anonymous" ? "Anonymous Student" : note.studentId}
                          </span>
                          <div className="flex gap-2">
                            <Badge className={getUrgencyColor(note.riskLevel)}>{note.riskLevel} risk</Badge>
                            {note.followUpRequired && <Badge variant="outline">Follow-up needed</Badge>}
                          </div>
                        </div>
                        <p className="text-sm">{note.content}</p>
                        <p className="text-xs text-muted-foreground">{new Date(note.createdAt).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-800">
                    <AlertTriangle className="h-5 w-5" />
                    High Risk Cases
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {highRiskCases.length === 0 ? (
                    <p className="text-muted-foreground">No high risk cases currently</p>
                  ) : (
                    <div className="space-y-3">
                      {highRiskCases.map((note) => (
                        <div key={note.id} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                          <p className="font-medium text-red-800">
                            {note.studentId === "anonymous" ? "Anonymous Student" : note.studentId}
                          </p>
                          <p className="text-sm text-red-700">{note.content.substring(0, 100)}...</p>
                          <p className="text-xs text-red-600 mt-1">{new Date(note.createdAt).toLocaleDateString()}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-yellow-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-yellow-800">
                    <Clock className="h-5 w-5" />
                    Follow-up Required
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {followUpCases.length === 0 ? (
                    <p className="text-muted-foreground">No follow-ups needed</p>
                  ) : (
                    <div className="space-y-3">
                      {followUpCases.map((note) => (
                        <div key={note.id} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <p className="font-medium text-yellow-800">
                            {note.studentId === "anonymous" ? "Anonymous Student" : note.studentId}
                          </p>
                          <p className="text-sm text-yellow-700">{note.content.substring(0, 100)}...</p>
                          <p className="text-xs text-yellow-600 mt-1">
                            {new Date(note.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Total Appointments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">{appointments.length}</div>
                  <p className="text-sm text-muted-foreground">All time</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Anonymous Sessions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">
                    {appointments.filter((apt) => apt.isAnonymous).length}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {Math.round((appointments.filter((apt) => apt.isAnonymous).length / appointments.length) * 100) ||
                      0}
                    % of total
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Crisis Interventions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-600">
                    {appointments.filter((apt) => apt.type === "crisis").length}
                  </div>
                  <p className="text-sm text-muted-foreground">Emergency sessions</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
