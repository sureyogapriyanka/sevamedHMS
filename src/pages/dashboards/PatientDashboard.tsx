import { useAuth } from "../../contexts/AuthContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  appointmentService,
  fitnessDataService,
  aiInsightService,
  activityLogService,
  authService
} from "../../services/api";
import FitnessTracker from "../../components/fitness/FitnessTracker";
import KnowledgeWidget from "../../components/knowledge/KnowledgeWidget";
import ChatInterface from "../../components/chat/ChatInterface";
import ActivityLog from "../../components/common/ActivityLog";
import MedicalRecords from "../../components/patient/MedicalRecords";
import Prescriptions from "../../components/patient/Prescriptions";
import QueueStatus from "../../components/patient/QueueStatus";
import AICompanion from "../../components/patient/AICompanion";
import InteractiveAIInsights from "../../components/patient/InteractiveAIInsights";
import AppointmentForm from "../../components/patient/AppointmentForm";
import {
  Calendar,
  Heart,
  Brain,
  Activity,
  Clock,
  AlertCircle,
  Thermometer,
  Scale,
  MessageSquare,
  FileText,
  TrendingUp,
  Stethoscope,
  Pill,
  Dna,
  Zap,
  Plus,
  User,
  BookOpen,
  Phone,
  Mail,
  MapPin,
  Cake,
  UserCheck,
  Menu,
  X,
  Users,
  Bot,
  Home,
  Settings,
  LogOut,
  Bell,
  Search,
  BarChart3,
  MessageCircle,
  Cog,
  Download,
  AlertTriangle
} from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Appointment, FitnessData, AIInsight } from "../../types/schema";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

export default function PatientDashboard() {
  const { user, patient, logout } = useAuth(); // Remove setUser
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [notificationPanelOpen, setNotificationPanelOpen] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(user?.profileImage || null); // Add state for profile image
  const [isUploading, setIsUploading] = useState(false); // Add state for upload status

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Update profile image when user changes
  useEffect(() => {
    setProfileImage(user?.profileImage || null);
  }, [user]);

  // Fetch appointments
  const { data: myAppointments = [] } = useQuery<Appointment[]>({
    queryKey: ["appointments", "patient", patient?.id],
    queryFn: async () => {
      if (!patient?.id) return [];
      const { data } = await appointmentService.getByUserId(patient.id);
      return data || [];
    },
    enabled: !!patient?.id
  });

  // Fetch fitness data
  const { data: myFitnessData = [] } = useQuery<FitnessData[]>({
    queryKey: ["fitness-data", "patient", patient?.id],
    queryFn: async () => {
      if (!patient?.id) return [];
      const { data } = await fitnessDataService.getByPatientId(patient.id);
      return data || [];
    },
    enabled: !!patient?.id
  });

  // Fetch AI insights
  const { data: aiInsights = [] } = useQuery<AIInsight[]>({
    queryKey: ["ai-insights", "user", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data } = await aiInsightService.getByUserId(user.id);
      return data || [];
    },
    enabled: !!user?.id
  });

  // Generate AI health suggestions
  const generateHealthSuggestionsMutation = useMutation({
    mutationFn: async () => {
      const latestFitness = myFitnessData[0];
      const { data } = await aiInsightService.generateHealthSuggestions({
        patientData: {
          age: user?.age,
          medicalHistory: patient?.medicalHistory,
          medications: patient?.medications,
          vitals: {
            heartRate: latestFitness?.heartRate,
            bloodPressure: latestFitness?.bloodPressure,
            weight: patient?.weight,
            height: patient?.height
          }
        },
        userId: user?.id
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ai-insights", "user", user?.id] });
    }
  });

  const upcomingAppointments = myAppointments
    .filter((apt) => new Date(apt.scheduledAt) > new Date())
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())
    .slice(0, 3);

  const latestVitals: FitnessData | undefined = myFitnessData[0];

  // Navigation items for sidebar
  const navigationItems = [
    { id: "overview", label: "Dashboard", icon: Home },
    { id: "appointments", label: "Appointments", icon: Calendar },
    { id: "book-appointment", label: "Book Appointment", icon: Plus },
    { id: "health", label: "Fitness Tracker", icon: Activity },
    { id: "ai-companion", label: "AI Insights", icon: Brain },
    { id: "queue", label: "Queue Status", icon: Users },
    { id: "medical-records", label: "Medical Records", icon: FileText },
    { id: "prescriptions", label: "Prescriptions", icon: Pill },
    { id: "knowledge", label: "Knowledge", icon: BookOpen },
    { id: "activity", label: "Activity", icon: Clock },
    { id: "chat", label: "Internal Chat", icon: MessageCircle },
    { id: "profile", label: "Profile", icon: User },
    { id: "settings", label: "Settings", icon: Cog }
  ];

  // Handle profile image upload
  const handleProfileImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    setIsUploading(true);

    try {
      // Convert image to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result as string;

        // Update profile image in state
        setProfileImage(base64Image);

        // Update profile image in backend
        const { data, error } = await authService.updateProfile({
          profileImage: base64Image
        });

        if (data && !error) {
          // Update local storage
          const storedUser = localStorage.getItem("user");
          if (storedUser) {
            const userData = JSON.parse(storedUser);
            userData.profileImage = base64Image;
            localStorage.setItem("user", JSON.stringify(userData));
          }

          // Reload the page to reflect changes
          window.location.reload();

          console.log("Profile image updated successfully");
        } else {
          console.error("Error updating profile image:", error);
          alert("Failed to update profile image");
          // Revert to previous image
          setProfileImage(user?.profileImage || null);
        }
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error uploading profile image:", error);
      alert("Failed to upload profile image");
      // Revert to previous image
      setProfileImage(user?.profileImage || null);
    } finally {
      setIsUploading(false);
      // Reset file input
      event.target.value = '';
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      setLocation("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Function to generate and download appointment PDF
  const downloadAppointmentPDF = (appointment: Appointment) => {
    // Create new PDF document with better formatting
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;
    const contentWidth = pageWidth - 2 * margin;

    // Add hospital header with professional styling
    doc.setFillColor(0, 102, 204);
    doc.rect(0, 0, pageWidth, 35, 'F');

    doc.setFontSize(24);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text("SEVA ONLINE MEDICAL CENTER", pageWidth / 2, 15, { align: "center" });

    doc.setFontSize(14);
    doc.text("Advanced Healthcare Solutions", pageWidth / 2, 25, { align: "center" });

    doc.setFontSize(12);
    doc.text("Phone: +1 (555) 123-4567  |  Email: info@sevaonline.com", pageWidth / 2, 32, { align: "center" });

    // Add horizontal line
    doc.setDrawColor(0, 102, 204);
    doc.setLineWidth(0.5);
    doc.line(margin, 40, pageWidth - margin, 40);

    // Add appointment title
    doc.setFontSize(20);
    doc.setTextColor(0, 102, 204);
    doc.setFont("helvetica", "bold");
    doc.text("APPOINTMENT CONFIRMATION", pageWidth / 2, 50, { align: "center" });

    // Add confirmation details
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    doc.text(`Confirmation #: ${appointment.id?.substring(0, 8) || "N/A"}`, margin, 58);
    doc.text(`Date Generated: ${new Date().toLocaleDateString()}`, pageWidth - margin, 58, { align: "right" });

    // Add patient information section with table
    doc.setFontSize(16);
    doc.setTextColor(0, 102, 204);
    doc.setFont("helvetica", "bold");
    doc.text("Patient Information", margin, 70);

    // Draw patient info table
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");

    const patientTableY = 75;
    const rowHeight = 7;

    // Table header
    doc.setFillColor(240, 240, 240);
    doc.rect(margin, patientTableY, contentWidth, rowHeight, 'F');
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.text("Field", margin + 2, patientTableY + 5);
    doc.text("Details", margin + contentWidth / 2 + 2, patientTableY + 5);

    // Table rows
    doc.setFont("helvetica", "normal");
    const patientData = [
      ["Full Name", user?.name || "N/A"],
      ["Age", user?.age ? `${user.age} years` : "N/A"],
      ["Phone", user?.phone || "Not provided"],
      ["Email", user?.email || "Not provided"],
      ["Address", user?.address || "Not provided"]
    ];

    patientData.forEach((row, index) => {
      const rowY = patientTableY + rowHeight * (index + 1);
      doc.rect(margin, rowY, contentWidth / 2, rowHeight);
      doc.rect(margin + contentWidth / 2, rowY, contentWidth / 2, rowHeight);
      doc.text(row[0], margin + 2, rowY + 5);
      doc.text(row[1], margin + contentWidth / 2 + 2, rowY + 5);
    });

    // Add appointment details section with table
    const appointmentTableY = patientTableY + rowHeight * (patientData.length + 1) + 10;

    doc.setFontSize(16);
    doc.setTextColor(0, 102, 204);
    doc.setFont("helvetica", "bold");
    doc.text("Appointment Details", margin, appointmentTableY - 5);

    // Draw appointment info table
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");

    // Table header
    doc.setFillColor(240, 240, 240);
    doc.rect(margin, appointmentTableY, contentWidth, rowHeight, 'F');
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.text("Field", margin + 2, appointmentTableY + 5);
    doc.text("Details", margin + contentWidth / 2 + 2, appointmentTableY + 5);

    // Status mapping as per project specification
    const statusMap: Record<string, string> = {
      'scheduled': 'Pending',
      'in-progress': 'Approved',
      'completed': 'Completed',
      'cancelled': 'Cancelled'
    };

    // Priority mapping
    const priorityMap: Record<string, string> = {
      'routine': 'Routine',
      'urgent': 'Urgent',
      'critical': 'Critical'
    };

    // Table rows
    doc.setFont("helvetica", "normal");
    const appointmentData = [
      ["Appointment ID", appointment.id?.substring(0, 8) || "N/A"],
      ["Date", new Date(appointment.scheduledAt).toLocaleDateString()],
      ["Time", new Date(appointment.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })],
      ["Doctor", `Dr. ${appointment.doctorId || "Not assigned"}`],
      ["Status", statusMap[appointment.status || ""] || appointment.status?.charAt(0).toUpperCase() + (appointment.status?.slice(1) || "")],
      ["Priority", priorityMap[appointment.priority || ""] || appointment.priority?.charAt(0).toUpperCase() + (appointment.priority?.slice(1) || "")]
    ];

    appointmentData.forEach((row, index) => {
      const rowY = appointmentTableY + rowHeight * (index + 1);
      doc.rect(margin, rowY, contentWidth / 2, rowHeight);
      doc.rect(margin + contentWidth / 2, rowY, contentWidth / 2, rowHeight);
      doc.text(row[0], margin + 2, rowY + 5);
      doc.text(row[1], margin + contentWidth / 2 + 2, rowY + 5);
    });

    // Add symptoms section
    const symptomsY = appointmentTableY + rowHeight * (appointmentData.length + 1) + 10;

    doc.setFontSize(16);
    doc.setTextColor(0, 102, 204);
    doc.setFont("helvetica", "bold");
    doc.text("Symptoms", margin, symptomsY - 5);

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");

    const symptoms = appointment.symptoms || "Not provided";
    const splitSymptoms = doc.splitTextToSize(symptoms, contentWidth - 10);
    doc.setFillColor(248, 248, 248);
    doc.rect(margin, symptomsY, contentWidth, Math.max(15, splitSymptoms.length * 7 + 10), 'F');
    doc.text(splitSymptoms, margin + 5, symptomsY + 10);

    // Add notes section if available
    let notesY = symptomsY + Math.max(15, splitSymptoms.length * 7 + 10) + 10;
    if (appointment.notes) {
      doc.setFontSize(16);
      doc.setTextColor(0, 102, 204);
      doc.setFont("helvetica", "bold");
      doc.text("Additional Notes", margin, notesY - 5);

      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "normal");

      const splitNotes = doc.splitTextToSize(appointment.notes, contentWidth - 10);
      doc.setFillColor(248, 248, 248);
      doc.rect(margin, notesY, contentWidth, Math.max(15, splitNotes.length * 7 + 10), 'F');
      doc.text(splitNotes, margin + 5, notesY + 10);

      notesY += Math.max(15, splitNotes.length * 7 + 10) + 10;
    }

    // Add important instructions section
    const instructionsY = notesY + 5;

    doc.setFontSize(16);
    doc.setTextColor(0, 102, 204);
    doc.setFont("helvetica", "bold");
    doc.text("Important Information", margin, instructionsY);

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");

    const instructions = [
      "• Please arrive 15 minutes before your scheduled appointment time",
      "• Bring a valid photo ID and your insurance card if applicable",
      `• ${priorityMap[appointment.priority || ""] === "Critical" ? "This is a critical appointment - please prioritize accordingly" : "If you need to reschedule, please contact us at least 24 hours in advance"}`,
      "• In case of emergency, please proceed to the nearest emergency room"
    ];

    instructions.forEach((instruction, index) => {
      doc.text(instruction, margin + 5, instructionsY + 10 + (index * 7));
    });

    // Add footer
    const footerY = instructionsY + 10 + (instructions.length * 7) + 15;

    doc.setDrawColor(200, 200, 200);
    doc.line(margin, footerY, pageWidth - margin, footerY);

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("This appointment confirmation is automatically generated and does not require a signature.", pageWidth / 2, footerY + 10, { align: "center" });
    doc.text("Please keep this document for your records.", pageWidth / 2, footerY + 17, { align: "center" });

    // Add page number
    doc.text(`Page 1 of 1`, pageWidth - margin, pageHeight - 10, { align: "right" });

    // Save the PDF
    const fileName = `appointment_${user?.name?.replace(/\s+/g, "_") || "patient"}_${new Date(appointment.scheduledAt).toISOString().split("T")[0]}.pdf`;
    doc.save(fileName);
  };

  return (
    <div className="flex h-screen w-full bg-white">
      {/* Blurry overlay when sidebar is open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Comprehensive Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-64 bg-blue-600 text-white transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 shadow-xl`}>
        <div className="flex items-center justify-between p-4 border-b border-blue-400">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center">
              <img
                src="/sevamed logo.png"
                alt="SevaMed Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <span className="text-xl font-bold">SevaMed HMS</span>
              <p className="text-xs text-blue-200">Healthcare Management</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white hover:text-gray-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300 h-4 w-4" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-blue-500/50 border border-blue-400 text-white placeholder-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
        </div>

        <nav className="flex-1 px-2 py-4 overflow-y-auto">
          <div className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg ${activeTab === item.id
                    ? 'bg-white/30 text-white shadow-md'
                    : 'text-blue-100 hover:bg-blue-500/30 hover:text-white'
                    }`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  <span>{t(item.label.toLowerCase().replace(/\s+/g, "_")) || item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        <div className="p-4 border-t border-blue-500">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="relative">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-white/30"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white font-bold">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-blue-600"></div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium truncate max-w-[100px]">{user?.name}</p>
                <p className="text-xs text-blue-200">Patient</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-blue-200 hover:text-white hover:bg-blue-500/30"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>

          {/* Upcoming Appointments Section in Sidebar */}
          <div className="mb-4">
            <h3 className="text-xs font-semibold text-blue-200 uppercase tracking-wider mb-2">Upcoming Appointments</h3>
            {upcomingAppointments.length === 0 ? (
              <p className="text-xs text-blue-200/70">No upcoming appointments</p>
            ) : (
              <div className="space-y-2">
                {upcomingAppointments.slice(0, 2).map((apt, index: number) => (
                  <div
                    key={apt.id || index}
                    className="bg-blue-500/30 p-2 rounded text-xs hover:bg-blue-500/50 transition-all duration-200 cursor-pointer transform hover:scale-[1.02]"
                    onClick={() => {
                      setActiveTab("appointments");
                      setSidebarOpen(false);
                    }}
                  >
                    <p className="font-medium truncate">Dr. {apt.doctorId || "Doctor"}</p>
                    <p className="text-blue-200/80">
                      {new Date(apt.scheduledAt).toLocaleDateString()} at {new Date(apt.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Health Status Section in Sidebar */}
          <div className="mb-4">
            <h3 className="text-xs font-semibold text-blue-200 uppercase tracking-wider mb-2">Health Status</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-blue-200/80">Heart Rate</span>
                <span className="font-medium">{latestVitals?.heartRate || 72} bpm</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-blue-200/80">Weight</span>
                <span className="font-medium">{patient?.weight || "N/A"} kg</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-blue-200/80">BMI</span>
                <span className="font-medium">{patient?.bmi || "N/A"}</span>
              </div>
            </div>
          </div>

          {/* Language Selector */}
          <div className="mt-4">
            <select
              className="w-full bg-blue-500/50 border border-blue-400 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
              value={t("language_code") || "en"}
              onChange={(e) => {
                // Language change logic would go here
              }}
            >
              <option value="en">English</option>
              <option value="te">తెలుగు</option>
              <option value="hi">हिंदी</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        {/* Header - Single header with three-line button */}
        <header className="bg-blue-50 shadow-md z-10 border-b border-blue-100">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="mr-4 text-blue-700 hover:text-blue-900 transition-colors duration-200"
              >
                <Menu className="h-6 w-6" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-blue-900">Welcome, {user?.name || "Patient"}</h1>
                <p className="text-sm text-blue-600">
                  {currentTime.toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                className="hidden md:flex items-center border-blue-300 text-blue-700 hover:bg-blue-100 transition-all duration-200"
                onClick={() => setActiveTab("overview")}
              >
                <Home className="h-4 w-4 mr-2" />
                Return to Home
              </Button>

              {/* Notification Panel */}
              {notificationPanelOpen && (
                <div
                  className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-40"
                  onClick={() => setNotificationPanelOpen(false)}
                />
              )}

              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative text-blue-700 hover:text-blue-900 transition-colors duration-200"
                  onClick={() => setNotificationPanelOpen(!notificationPanelOpen)}
                >
                  <Bell className="h-5 w-5" />
                  {notifications > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {notifications}
                    </span>
                  )}
                </Button>

                {/* Notification Dropdown */}
                {notificationPanelOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50 border border-blue-100">
                    <div className="p-4 border-b border-blue-100 bg-blue-50">
                      <h3 className="font-semibold text-blue-900">Notifications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {/* Sample notifications */}
                      <div className="p-4 border-b border-blue-50 hover:bg-blue-50 cursor-pointer">
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                              <Calendar className="h-4 w-4 text-blue-600" />
                            </div>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-blue-900">Appointment Reminder</p>
                            <p className="text-sm text-blue-600">Your appointment with Dr. Smith is tomorrow at 10:00 AM</p>
                            <p className="text-xs text-blue-400 mt-1">2 hours ago</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 border-b border-blue-50 hover:bg-blue-50 cursor-pointer">
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                              <Pill className="h-4 w-4 text-amber-600" />
                            </div>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-blue-900">Medication Reminder</p>
                            <p className="text-sm text-blue-600">Time to take your daily medication</p>
                            <p className="text-xs text-blue-400 mt-1">5 hours ago</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 border-b border-blue-50 hover:bg-blue-50 cursor-pointer">
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                              <FileText className="h-4 w-4 text-purple-600" />
                            </div>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-blue-900">Lab Results Available</p>
                            <p className="text-sm text-blue-600">Your blood test results are now available</p>
                            <p className="text-xs text-blue-400 mt-1">1 day ago</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-blue-50 text-center">
                      <button
                        className="text-sm font-medium text-blue-700 hover:text-blue-900"
                        onClick={() => {
                          setNotifications(0);
                          setNotificationPanelOpen(false);
                        }}
                      >
                        Mark all as read
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover border-2 border-blue-300"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-sm font-bold border-2 border-blue-300">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Content Area with bright, accessible background */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-blue-50 w-full">
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* AI Health Assistant */}
              <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6 rounded-xl text-white shadow-xl">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Brain className="h-6 w-6 mr-2" />
                  {t("ai_assistant")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {aiInsights.length === 0 ? (
                    <div className="col-span-2 text-center py-8">
                      <Brain className="h-12 w-12 mx-auto mb-4 opacity-90" />
                      <p className="mb-4 opacity-95">Get personalized health insights based on your medical data</p>
                      <Button
                        variant="secondary"
                        onClick={() => generateHealthSuggestionsMutation.mutate()}
                        disabled={generateHealthSuggestionsMutation.isPending}
                        data-testid="generate-health-suggestions"
                        className="bg-white text-blue-700 hover:bg-blue-50 hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                      >
                        {generateHealthSuggestionsMutation.isPending ? "Generating..." : "Get AI Health Insights"}
                      </Button>
                    </div>
                  ) : (
                    aiInsights.slice(0, 2).map((insight, index: number) => (
                      <div
                        key={insight.id || index}
                        className="bg-white/20 p-4 rounded-lg backdrop-blur-sm hover:bg-white/30 transition-all duration-200 cursor-pointer transform hover:scale-[1.02] hover:shadow-lg"
                        onClick={() => setActiveTab("ai-companion")}
                      >
                        <div className="flex items-start space-x-3">
                          {insight.type === "medication_reminder" ? (
                            <Pill className="h-5 w-5 mt-1" />
                          ) : insight.type === "health_tip" ? (
                            <Heart className="h-5 w-5 mt-1" />
                          ) : (
                            <Zap className="h-5 w-5 mt-1" />
                          )}
                          <div>
                            <p className="font-medium capitalize">
                              {insight.type === "medication_reminder"
                                ? t("medication_reminder")
                                : insight.type === "health_tip"
                                  ? t("health_tip")
                                  : t("workflow_optimization")}
                            </p>
                            <p className="text-sm opacity-95 mt-1">{insight.content}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quick Stats */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="border-l-4 border-l-blue-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white cursor-pointer transform hover:scale-[1.02] border-2 border-blue-200">
                      <CardContent className="p-4">
                        <div className="flex items-center">
                          <div className="rounded-full bg-blue-100 p-2 mr-3">
                            <Heart className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm text-blue-700">Heart Rate</p>
                            <p className="text-xl font-bold">
                              {latestVitals?.heartRate || 72} <span className="text-sm font-normal">bpm</span>
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-amber-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white cursor-pointer transform hover:scale-[1.02] border-2 border-amber-200">
                      <CardContent className="p-4">
                        <div className="flex items-center">
                          <div className="rounded-full bg-amber-100 p-2 mr-3">
                            <Thermometer className="h-5 w-5 text-amber-600" />
                          </div>
                          <div>
                            <p className="text-sm text-amber-700">Temperature</p>
                            <p className="text-xl font-bold">98.6°F</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-purple-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white cursor-pointer transform hover:scale-[1.02] border-2 border-purple-200">
                      <CardContent className="p-4">
                        <div className="flex items-center">
                          <div className="rounded-full bg-purple-100 p-2 mr-3">
                            <Scale className="h-5 w-5 text-purple-600" />
                          </div>
                          <div>
                            <p className="text-sm text-purple-700">Weight</p>
                            <p className="text-xl font-bold">
                              {patient?.weight || "N/A"} <span className="text-sm font-normal">kg</span>
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Fitness Tracker */}
                  <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-200">
                    <FitnessTracker />
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-6">
                  <Card className="border-t-4 border-t-blue-500 hover:shadow-xl transition-all duration-300 bg-white border-2 border-blue-200">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <TrendingUp className="h-5 w-5 text-blue-600" />
                        <span>Quick Actions</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-3">
                        <Button
                          variant="outline"
                          className="h-16 flex flex-col items-center justify-center hover:bg-blue-100 border-blue-300 transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg transform hover:border-blue-400"
                          onClick={() => setActiveTab("book-appointment")}
                        >
                          <Calendar className="h-5 w-5 mb-1 text-blue-600" />
                          <span className="text-xs text-blue-700">Book</span>
                        </Button>
                        <Button
                          variant="outline"
                          className="h-16 flex flex-col items-center justify-center hover:bg-cyan-100 border-cyan-300 transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg transform hover:border-cyan-400"
                          onClick={() => setActiveTab("queue")}
                        >
                          <Users className="h-5 w-5 mb-1 text-cyan-600" />
                          <span className="text-xs text-cyan-700">Queue</span>
                        </Button>
                        <Button
                          variant="outline"
                          className="h-16 flex flex-col items-center justify-center hover:bg-purple-100 border-purple-300 transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg transform hover:border-purple-400"
                          onClick={() => setActiveTab("medical-records")}
                        >
                          <FileText className="h-5 w-5 mb-1 text-purple-600" />
                          <span className="text-xs text-purple-700">Records</span>
                        </Button>
                        <Button
                          variant="outline"
                          className="h-16 flex flex-col items-center justify-center hover:bg-amber-100 border-amber-300 transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg transform hover:border-amber-400"
                          onClick={() => setActiveTab("prescriptions")}
                        >
                          <Pill className="h-5 w-5 mb-1 text-amber-600" />
                          <span className="text-xs text-amber-700">Meds</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}

          {activeTab === "ai-companion" && (
            <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-200">
              <InteractiveAIInsights />
            </div>
          )}

          {activeTab === "appointments" && (
            <div className="space-y-6 w-full">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-blue-900">My Appointments</h2>
                <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg transition-all duration-300 hover:shadow-xl transform hover:scale-105"
                  onClick={() => setActiveTab("book-appointment")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Book Appointment
                </Button>
              </div>
              <Card className="shadow-lg hover:shadow-xl transition-all duration-300 bg-white border-2 border-blue-200">
                <CardContent className="p-0">
                  {myAppointments.length === 0 ? (
                    <div className="text-center py-12">
                      <Calendar className="h-12 w-12 mx-auto text-blue-400 mb-4" />
                      <h3 className="text-lg font-medium text-blue-900 mb-2">No Appointments</h3>
                      <p className="text-blue-600 mb-4">You don't have any appointments scheduled.</p>
                      <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
                        onClick={() => setActiveTab("book-appointment")}>
                        Book an Appointment
                      </Button>
                    </div>
                  ) : (
                    <div className="divide-y divide-blue-100">
                      {myAppointments.map((apt) => (
                        <div
                          key={apt.id}
                          className="p-6 hover:bg-blue-50 transition-colors duration-200 cursor-pointer transform hover:scale-[1.01]"
                          onClick={() => {
                            // Add blurry background effect when appointment is clicked
                            console.log("View appointment details", apt.id);
                          }}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center mb-2">
                                <h3 className="font-bold text-lg text-blue-900 mr-3">Dr. {apt.doctorId || "Doctor"}</h3>
                                <Badge
                                  variant="default"
                                  className={
                                    apt.status === "completed" ? "bg-green-500" :
                                      apt.status === "in-progress" ? "bg-blue-500" :
                                        apt.status === "scheduled" ? "bg-yellow-500" :
                                          apt.status === "cancelled" ? "bg-red-500" :
                                            "bg-gray-500"
                                  }
                                >
                                  {apt.status === "scheduled" ? "Pending" :
                                    apt.status === "in-progress" ? "Approved" :
                                      apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                                </Badge>
                              </div>
                              <p className="text-blue-700 mb-3">{apt.symptoms || "General Checkup"}</p>
                              <div className="flex flex-wrap gap-4 text-sm text-blue-600">
                                <div className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  <span>{new Date(apt.scheduledAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center">
                                  <Clock className="h-4 w-4 mr-1" />
                                  <span>{new Date(apt.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                <div className="flex items-center">
                                  <AlertTriangle className="h-4 w-4 mr-1" />
                                  <span className="capitalize">{apt.priority}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col items-end">
                              <Badge variant="outline" className="text-xs bg-blue-100 text-blue-800 mb-2">
                                {apt.priority}
                              </Badge>
                              <Button
                                variant="outline"
                                size="sm"
                                className="mt-2 border-blue-300 text-blue-700 hover:bg-blue-100"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  downloadAppointmentPDF(apt);
                                }}
                              >
                                <Download className="h-4 w-4 mr-1" />
                                PDF
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "book-appointment" && (
            <div className="w-full">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-blue-900">Book New Appointment</h2>
                <p className="text-blue-600">
                  Complete the form below to schedule a new appointment with a doctor
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-blue-200">
                <AppointmentForm onSuccess={() => setActiveTab("appointments")} />
              </div>
            </div>
          )}

          {activeTab === "queue" && (
            <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-amber-200">
              <QueueStatus />
            </div>
          )}

          {activeTab === "medical-records" && (
            <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-purple-200">
              <MedicalRecords />
            </div>
          )}

          {activeTab === "prescriptions" && (
            <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-green-200">
              <Prescriptions />
            </div>
          )}

          {activeTab === "health" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-blue-900">Health Data</h2>
                <Button variant="outline" className="flex items-center border-blue-300 text-blue-700 hover:bg-blue-100 hover:border-blue-400 transition-all duration-200">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Data
                </Button>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-blue-200">
                <FitnessTracker />
              </div>
            </div>
          )}

          {activeTab === "knowledge" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-blue-900">Knowledge Center</h2>
                <Button variant="outline" className="flex items-center border-purple-300 text-purple-700 hover:bg-purple-100 hover:border-purple-400 transition-all duration-200">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Browse Articles
                </Button>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-indigo-200">
                <KnowledgeWidget />
              </div>
            </div>
          )}

          {activeTab === "activity" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-blue-900">Activity Log</h2>
                <Button variant="outline" className="flex items-center border-emerald-300 text-emerald-700 hover:bg-emerald-100 hover:border-emerald-400 transition-all duration-200">
                  <User className="h-4 w-4 mr-2" />
                  View Profile
                </Button>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-cyan-200">
                <ActivityLog />
              </div>
            </div>
          )}

          {activeTab === "chat" && (
            <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-pink-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Internal Chat</h2>
                <Button
                  onClick={() => window.open('/chat', '_blank')}
                  className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white shadow-lg transition-all duration-300 hover:shadow-xl transform hover:scale-105"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Full Screen Chat
                </Button>
              </div>
              <ChatInterface />
            </div>
          )}

          {activeTab === "profile" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-blue-900">My Profile</h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Picture and Basic Info */}
                <div className="lg:col-span-1">
                  <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white border-2 border-blue-200">
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center">
                        {/* Profile Picture */}
                        <div className="relative mb-4">
                          {profileImage ? ( // Use profileImage state instead of user.profileImage
                            <img
                              src={profileImage}
                              alt={user.name}
                              className="w-32 h-32 rounded-full object-cover shadow-lg border-4 border-white"
                            />
                          ) : (
                            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-4xl font-bold shadow-lg border-4 border-white">
                              {user?.name?.charAt(0).toUpperCase() || "U"}
                            </div>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            className="absolute bottom-2 right-2 rounded-full w-8 h-8 p-0 bg-white border-2 border-blue-500 text-blue-600 hover:bg-blue-100 hover:shadow-lg transform hover:scale-110 transition-all duration-200"
                            onClick={() => {
                              // Trigger the file input when clicking the button
                              document.getElementById('profile-image-upload-settings')?.click();
                            }}
                          >
                            <User className="h-4 w-4" />
                          </Button>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleProfileImageUpload}
                            disabled={isUploading}
                            className="hidden"
                            id="profile-image-upload-settings"
                          />
                        </div>

                        <h3 className="text-xl font-bold text-center text-blue-900">{user?.name}</h3>
                        <p className="text-blue-600 text-center">Patient ID: {patient?.id?.substring(0, 8) || "N/A"}</p>

                        <div className="mt-4 w-full space-y-2">
                          <div className="flex items-center text-sm text-blue-700">
                            <UserCheck className="h-4 w-4 mr-2 text-blue-600" />
                            <span>Patient</span>
                          </div>
                          <div className="flex items-center text-sm text-blue-700">
                            <Cake className="h-4 w-4 mr-2 text-blue-600" />
                            <span>Age: {user?.age || "N/A"}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Detailed Profile Information */}
                <div className="lg:col-span-2 space-y-6">
                  <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white border-2 border-blue-200">
                    <CardHeader>
                      <CardTitle className="flex items-center text-blue-900">
                        <User className="h-5 w-5 mr-2 text-blue-600" />
                        Personal Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-blue-700">Full Name</label>
                        <p className="font-medium text-blue-900">{user?.name || "N/A"}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-blue-700">Email</label>
                        <p className="font-medium text-blue-900">{user?.email || "N/A"}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-blue-700">Phone</label>
                        <p className="font-medium text-blue-900">{user?.phone || "N/A"}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-blue-700">Age</label>
                        <p className="font-medium text-blue-900">
                          {user?.age
                            ? `${user.age} years old`
                            : "N/A"}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-blue-700">Gender</label>
                        <p className="font-medium text-blue-900">{user?.gender || "N/A"}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-blue-700">Blood Group</label>
                        <p className="font-medium text-blue-900">{user?.bloodGroup || "N/A"}</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white border-2 border-purple-200">
                    <CardHeader>
                      <CardTitle className="flex items-center text-blue-900">
                        <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                        Address Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div>
                        <label className="text-sm font-medium text-blue-700">Address</label>
                        <p className="font-medium text-blue-900">{user?.address || "N/A"}</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white border-2 border-amber-200">
                    <CardHeader>
                      <CardTitle className="flex items-center text-blue-900">
                        <FileText className="h-5 w-5 mr-2 text-blue-600" />
                        Medical Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-blue-700">Medical History</label>
                        <p className="font-medium text-blue-900">{patient?.medicalHistory || "No medical history recorded"}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-blue-700">Current Medications</label>
                        <p className="font-medium text-blue-900">{patient?.medications || "No current medications"}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-blue-700">Allergies</label>
                        <p className="font-medium text-blue-900">
                          {patient?.allergies && patient.allergies.length > 0
                            ? patient.allergies.join(", ")
                            : "No known allergies"}
                        </p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="text-sm font-medium text-blue-700">Blood Type</label>
                          <p className="font-medium text-blue-900">{patient?.bloodType || "N/A"}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-blue-700">Height</label>
                          <p className="font-medium text-blue-900">
                            {patient?.height ? `${patient.height} cm` : "N/A"}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-blue-700">Weight</label>
                          <p className="font-medium text-blue-900">
                            {patient?.weight ? `${patient.weight} kg` : "N/A"}
                          </p>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-blue-700">BMI</label>
                        <p className="font-medium text-blue-900">{patient?.bmi || "N/A"}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-blue-900">Settings</h2>
              </div>
              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white border-2 border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-blue-900">
                    <Cog className="h-5 w-5 mr-2 text-blue-600" />
                    Account Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Profile Picture Section */}
                    <div>
                      <h3 className="text-lg font-medium mb-2 text-blue-900">Profile Picture</h3>
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          {profileImage ? (
                            <img
                              src={profileImage}
                              alt="Profile"
                              className="w-16 h-16 rounded-full object-cover border-2 border-blue-500"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xl font-bold border-2 border-blue-500">
                              {user?.name?.charAt(0).toUpperCase() || "U"}
                            </div>
                          )}
                        </div>
                        <div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleProfileImageUpload}
                            disabled={isUploading}
                            className="hidden"
                            id="profile-image-upload"
                          />
                          <label
                            htmlFor="profile-image-upload"
                            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${isUploading
                              ? 'bg-blue-400 cursor-not-allowed'
                              : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
                              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200`}
                          >
                            {isUploading ? 'Uploading...' : 'Change Photo'}
                          </label>
                          <p className="mt-1 text-xs text-blue-600">
                            JPG, PNG or GIF (max 5MB)
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-2 text-blue-900">Language Preferences</h3>
                      <select
                        className="w-full border border-blue-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        value={t("language_code") || "en"}
                        onChange={(e) => {
                          // Language change logic would go here
                        }}
                      >
                        <option value="en">English</option>
                        <option value="te">తెలుగు</option>
                        <option value="hi">हिंदी</option>
                      </select>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-2 text-blue-900">Notification Settings</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-blue-700">Email Notifications</span>
                          <Button variant="outline" size="sm" className="hover:bg-blue-100 hover:border-blue-300 transition-colors duration-200">Enabled</Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-blue-700">SMS Notifications</span>
                          <Button variant="outline" size="sm" className="hover:bg-blue-100 hover:border-blue-300 transition-colors duration-200">Enabled</Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-blue-700">Push Notifications</span>
                          <Button variant="outline" size="sm" className="hover:bg-blue-100 hover:border-blue-300 transition-colors duration-200">Enabled</Button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-2 text-blue-900">Security</h3>
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full justify-between hover:bg-blue-100 hover:border-blue-300 transition-colors duration-200">
                          Change Password
                          <span>→</span>
                        </Button>
                        <Button variant="outline" className="w-full justify-between hover:bg-blue-100 hover:border-blue-300 transition-colors duration-200">
                          Two-Factor Authentication
                          <span>→</span>
                        </Button>
                        <Button variant="outline" className="w-full justify-between text-red-600 hover:text-red-700 hover:bg-red-100 hover:border-red-300 transition-colors duration-200">
                          Logout from all devices
                          <span>→</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}