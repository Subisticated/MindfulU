"use client"

import { useState, useEffect } from "react"
import { Sidebar, MobileMenuButton } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { useLocalStorage } from "@/components/local-storage-provider"
import { Calendar, Clock, Shield, User, Phone, Mail, AlertTriangle } from "lucide-react"
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

const counselors = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    specialty: "Anxiety & Depression",
    availability: ["Monday", "Wednesday", "Friday"],
  },
  {
    id: "2",
    name: "Dr. Michael Chen",
    specialty: "Academic Stress",
    availability: ["Tuesday", "Thursday", "Saturday"],
  },
  {
    id: "3",
    name: "Dr. Emily Rodriguez",
    specialty: "Crisis Intervention",
    availability: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  },
  { id: "4", name: "Dr. James Wilson", specialty: "Group Therapy", availability: ["Wednesday", "Thursday", "Friday"] },
]

const timeSlots = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"]

export default function BookingPage() {
  const { data, updateData } = useLocalStorage()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [selectedCounselor, setSelectedCounselor] = useState("")
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [appointmentType, setAppointmentType] = useState<"individual" | "group" | "crisis">("individual")
  const [urgency, setUrgency] = useState<"low" | "medium" | "high">("medium")
  const [reason, setReason] = useState("")
  const [studentName, setStudentName] = useState("")
  const [studentEmail, setStudentEmail] = useState("")
  const [studentPhone, setStudentPhone] = useState("")

  useEffect(() => {
    // Load existing appointments from localStorage
    const savedAppointments = localStorage.getItem("appointments")
    if (savedAppointments) {
      setAppointments(JSON.parse(savedAppointments))
    }

    // Pre-fill form with user data if not anonymous
    if (!isAnonymous && data.onboarding?.userProfile) {
      setStudentName(data.onboarding.userProfile.name || "")
      setStudentEmail(data.onboarding.userProfile.email || "")
    }
  }, [isAnonymous, data.onboarding?.userProfile])

  const saveAppointments = (newAppointments: Appointment[]) => {
    setAppointments(newAppointments)
    localStorage.setItem("appointments", JSON.stringify(newAppointments))
  }

  const handleBookAppointment = () => {
    if (!selectedCounselor || !selectedDate || !selectedTime || !reason.trim()) {
      alert("Please fill in all required fields")
      return
    }

    const counselor = counselors.find((c) => c.id === selectedCounselor)
    if (!counselor) return

    const newAppointment: Appointment = {
      id: Date.now().toString(),
      date: selectedDate,
      time: selectedTime,
      counselorId: selectedCounselor,
      counselorName: counselor.name,
      type: appointmentType,
      isAnonymous,
      studentName: isAnonymous ? undefined : studentName,
      studentEmail: isAnonymous ? undefined : studentEmail,
      studentPhone: isAnonymous ? undefined : studentPhone,
      reason,
      urgency,
      status: urgency === "high" ? "confirmed" : "pending",
      createdAt: new Date(),
    }

    const updatedAppointments = [...appointments, newAppointment]
    saveAppointments(updatedAppointments)

    // Reset form
    setSelectedCounselor("")
    setSelectedDate("")
    setSelectedTime("")
    setReason("")
    setStudentName("")
    setStudentEmail("")
    setStudentPhone("")

    alert(`Appointment ${urgency === "high" ? "confirmed" : "requested"} successfully!`)
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

  const userAppointments = appointments.filter((apt) =>
    isAnonymous ? apt.isAnonymous : apt.studentEmail === data.onboarding?.userProfile?.email,
  )

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile Menu Button */}
      <MobileMenuButton />
      
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <main className="flex-1 md:ml-64 pt-16 md:pt-0">
        <div className="p-4 md:p-6">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-balance">Book Counseling Session</h1>
            <p className="text-muted-foreground mt-2">
            Schedule a confidential appointment with our professional counselors
          </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Booking Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Schedule Appointment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Anonymous Toggle */}
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-primary" />
                    <Label htmlFor="anonymous">Anonymous Booking</Label>
                  </div>
                  <Switch id="anonymous" checked={isAnonymous} onCheckedChange={setIsAnonymous} />
                </div>

                {/* Contact Information (if not anonymous) */}
                {!isAnonymous && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-3"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={studentName}
                          onChange={(e) => setStudentName(e.target.value)}
                          placeholder="Your full name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={studentEmail}
                          onChange={(e) => setStudentEmail(e.target.value)}
                          placeholder="your.email@university.edu"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number (Optional)</Label>
                      <Input
                        id="phone"
                        value={studentPhone}
                        onChange={(e) => setStudentPhone(e.target.value)}
                        placeholder="(555) 123-4567"
                      />
                    </div>
                  </motion.div>
                )}

                {/* Appointment Type */}
                <div>
                  <Label>Appointment Type</Label>
                  <Select value={appointmentType} onValueChange={(value: any) => setAppointmentType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="individual">Individual Session</SelectItem>
                      <SelectItem value="group">Group Therapy</SelectItem>
                      <SelectItem value="crisis">Crisis Intervention</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Urgency Level */}
                <div>
                  <Label>Urgency Level</Label>
                  <Select value={urgency} onValueChange={(value: any) => setUrgency(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low - Routine Check-in</SelectItem>
                      <SelectItem value="medium">Medium - Need Support Soon</SelectItem>
                      <SelectItem value="high">High - Urgent Need</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Counselor Selection */}
                <div>
                  <Label>Select Counselor</Label>
                  <Select value={selectedCounselor} onValueChange={setSelectedCounselor}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a counselor" />
                    </SelectTrigger>
                    <SelectContent>
                      {counselors.map((counselor) => (
                        <SelectItem key={counselor.id} value={counselor.id}>
                          {counselor.name} - {counselor.specialty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="date">Preferred Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  <div>
                    <Label>Preferred Time</Label>
                    <Select value={selectedTime} onValueChange={setSelectedTime}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Reason for Appointment */}
                <div>
                  <Label htmlFor="reason">Reason for Appointment</Label>
                  <Textarea
                    id="reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Please describe what you'd like to discuss (this helps us prepare for your session)"
                    rows={3}
                  />
                </div>

                <Button onClick={handleBookAppointment} className="w-full">
                  {urgency === "high" ? "Book Emergency Session" : "Request Appointment"}
                </Button>
              </CardContent>
            </Card>

            {/* Your Appointments & Emergency Contacts */}
            <div className="space-y-6">
              {/* Emergency Contacts */}
              <Card className="border-red-200 bg-red-50/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-800">
                    <AlertTriangle className="h-5 w-5" />
                    Emergency Support
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-red-600" />
                      <span className="font-medium">Crisis Hotline:</span>
                      <span>988 (24/7)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-red-600" />
                      <span className="font-medium">Campus Emergency:</span>
                      <span>(555) 911-HELP</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-red-600" />
                      <span className="font-medium">Crisis Text Line:</span>
                      <span>Text HOME to 741741</span>
                    </div>
                  </div>
                  <p className="text-sm text-red-700">
                    If you're experiencing a mental health emergency, please contact these resources immediately.
                  </p>
                </CardContent>
              </Card>

              {/* Your Appointments */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Your Appointments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {userAppointments.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">No appointments scheduled yet</p>
                  ) : (
                    <div className="space-y-3">
                      {userAppointments.slice(0, 5).map((appointment) => (
                        <motion.div
                          key={appointment.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-3 border rounded-lg space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{appointment.counselorName}</span>
                            </div>
                            <Badge className={getUrgencyColor(appointment.urgency)}>{appointment.urgency}</Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                          </div>
                          <div className="text-sm">
                            <span className="capitalize">{appointment.type}</span> session
                            {appointment.isAnonymous && (
                              <Badge variant="outline" className="ml-2">
                                Anonymous
                              </Badge>
                            )}
                          </div>
                          <Badge variant={appointment.status === "confirmed" ? "default" : "secondary"}>
                            {appointment.status}
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
