import { useAuth } from "../../contexts/AuthContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Users, Clock, Activity, AlertTriangle, TrendingUp, UserCheck, Send, Plus, Home, Calendar,
  FileText, Pill, MessageSquare, Settings, LogOut, Bell, Search, BarChart3, MessageCircle,
  Cog, Download, Menu, X, Heart, Brain, Scale, Thermometer, Zap, Dna, Stethoscope, Bot,
  Phone, Mail, MapPin, Cake, Shield, User as UserIcon, Edit, Trash2
} from "lucide-react";
import { queueService, appointmentService, authService } from "../../services/api";
import { toast } from "../../hooks/use-toast";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { User as UserType, Appointment, QueueEntry } from "../../types/schema";
import AdminMessaging from "../../components/admin/AdminMessaging";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const [showEmergencyForm, setShowEmergencyForm] = useState(false);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [showEditStaffForm, setShowEditStaffForm] = useState(false);
  const [editingStaff, setEditingStaff] = useState<UserType | null>(null);
  const [emergencyPatientId, setEmergencyPatientId] = useState("");
  const [emergencyPriority, setEmergencyPriority] = useState("urgent");
  const [currentTime, setCurrentTime] = useState(new Date());

  // Edit staff form state
  const [editName, setEditName] = useState("");
  const [editUsername, setEditUsername] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState(5);
  const [notificationPanelOpen, setNotificationPanelOpen] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(user?.profileImage || null);

  // System settings state
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState(language || "en");

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Update profile image when user changes
  useEffect(() => {
    setProfileImage(user?.profileImage || null);
  }, [user]);

  const { data: allUsers = [] } = useQuery({
    queryKey: ["/api/users/role/all"],
    queryFn: async (): Promise<UserType[]> => {
      const response = await fetch("/api/users/role/all", {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      return response.json();
    },
  });

  const { data: todaysAttendance = [] } = useQuery({
    queryKey: ["/api/attendance/today"],
    queryFn: async (): Promise<any[]> => {
      const response = await fetch("/api/attendance/today", {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error('Failed to fetch attendance');
      }
      return response.json();
    },
  });

  const { data: todaysAppointments = [] } = useQuery({
    queryKey: ["/api/appointments/today"],
    queryFn: async (): Promise<Appointment[]> => {
      const response = await fetch("/api/appointments/today", {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error('Failed to fetch appointments');
      }
      return response.json();
    },
  });

  // NEW: Fetch all appointments for the admin dashboard
  const { data: allAppointments = [] } = useQuery({
    queryKey: ["/api/appointments"],
    queryFn: async (): Promise<Appointment[]> => {
      const response = await fetch("/api/appointments", {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error('Failed to fetch all appointments');
      }
      return response.json();
    },
  });

  const { data: currentQueue = [] } = useQuery({
    queryKey: ["/api/queue"],
    queryFn: async (): Promise<QueueEntry[]> => {
      const response = await fetch("/api/queue", {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error('Failed to fetch queue');
      }
      return response.json();
    },
  });

  const { data: doctors = [] } = useQuery({
    queryKey: ["/api/users/role/doctor"],
    queryFn: async (): Promise<UserType[]> => {
      const response = await fetch("/api/users/role/doctor", {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error('Failed to fetch doctors');
      }
      return response.json();
    },
  });

  // Mutation to add emergency patient to queue
  const addEmergencyPatientMutation = useMutation({
    mutationFn: async (queueData: any) => {
      return queueService.create(queueData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/queue"] });
      toast({
        title: "Success",
        description: "Emergency patient added to the front of the queue"
      });
      setShowEmergencyForm(false);
      setEmergencyPatientId("");
      setEmergencyPriority("urgent");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add emergency patient",
        variant: "destructive"
      });
    }
  });

  // Mutation to update staff member
  const updateStaffMutation = useMutation({
    mutationFn: async (staffData: { id: string; userData: any }) => {
      const { id, userData } = staffData;
      return authService.updateUserById(id, userData);
    },
    onSuccess: (data) => {
      if (data.error) {
        toast({
          title: "Error",
          description: data.error,
          variant: "destructive"
        });
      } else {
        queryClient.invalidateQueries({ queryKey: ["/api/users/role/all"] });
        queryClient.invalidateQueries({ queryKey: ["/api/users/role/doctor"] });
        toast({
          title: "Success",
          description: "Staff member updated successfully"
        });
        setShowEditStaffForm(false);
      }
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update staff member",
        variant: "destructive"
      });
    }
  });

  const doctorsCount = allUsers.filter((u: UserType) => u.role === "doctor").length;
  const receptionCount = allUsers.filter((u: UserType) => u.role === "reception").length;
  const patientsCount = allUsers.filter((u: UserType) => u.role === "patient").length;
  const criticalCases = currentQueue.filter((q: QueueEntry) => q.priority === "critical").length;

  // Get completed patients count
  const completedPatients = currentQueue.filter((q: QueueEntry) => q.status === "completed").length;

  // Get active queue (excluding completed)
  const activeQueue = currentQueue.filter((q: QueueEntry) => q.status !== "completed");

  // Navigation items for sidebar
  const navigationItems = [
    { id: "overview", label: "Dashboard", icon: Home },
    { id: "appointments", label: "Appointments", icon: Calendar },
    { id: "queue", label: "Patient Queue", icon: Users },
    { id: "staff", label: "Staff Management", icon: UserCheck },
    { id: "reports", label: "Reports", icon: BarChart3 },
    { id: "messaging", label: "Messaging", icon: MessageSquare },
    { id: "settings", label: "System Settings", icon: Settings }
  ];

  // Handle adding emergency patient
  const handleAddEmergencyPatient = () => {
    if (!emergencyPatientId) {
      toast({
        title: "Error",
        description: "Please select a patient",
        variant: "destructive"
      });
      return;
    }

    // Find the most recent available doctor (in a real implementation, you would check doctor availability)
    // For now, we'll just pick the first doctor
    const availableDoctors = doctors.filter((doctor: UserType) => {
      return doctor.role === "doctor";
    });

    if (availableDoctors.length === 0) {
      toast({
        title: "Error",
        description: "No doctors available",
        variant: "destructive"
      });
      return;
    }

    // Assign to the first available doctor (in a real system, you'd implement better logic)
    const assignedDoctor = availableDoctors[0];

    // Create emergency queue entry at position 1 (front of queue)
    const emergencyQueueEntry = {
      patientId: emergencyPatientId,
      doctorId: assignedDoctor.id,
      position: 1,
      estimatedWaitTime: 0,
      status: "waiting",
      priority: emergencyPriority
    };

    addEmergencyPatientMutation.mutate(emergencyQueueEntry);
  };

  // Handle editing staff member
  const handleEditStaff = (staff: UserType) => {
    setEditingStaff(staff);
    setEditName(staff.name || "");
    setEditUsername(staff.username || "");
    setEditEmail(staff.email || "");
    setEditRole(staff.role || "");
    setEditPhone(staff.phone || "");
    setEditAddress(staff.address || "");
    setShowEditStaffForm(true);
  };

  // Handle saving edited staff member
  const handleSaveEditedStaff = () => {
    if (!editingStaff) return;

    const updatedData = {
      name: editName,
      username: editUsername,
      email: editEmail,
      role: editRole,
      phone: editPhone,
      address: editAddress
    };

    updateStaffMutation.mutate({
      id: editingStaff.id,
      userData: updatedData
    });
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

  return (
    <div className="flex h-screen w-full bg-gray-50">
      {/* Blurry overlay when sidebar is open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Comprehensive Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-blue-800 to-indigo-900 text-white transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 shadow-xl`}>
        <div className="flex items-center justify-between p-4 border-b border-blue-600">
          <div className="flex items-center space-x-2">
            <div className="bg-white/20 p-2 rounded-lg">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xl font-bold">SevaMed HMS</span>
              <p className="text-xs text-blue-200">Admin Dashboard</p>
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
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-blue-700/50 border border-blue-600 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    ? 'bg-white/20 text-white shadow-md'
                    : 'text-blue-100 hover:bg-blue-700/30 hover:text-white'
                    }`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  <span>{t(item.label.toLowerCase().replace(/\s+/g, "_")) || item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        <div className="p-4 border-t border-blue-700">
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
                    {user?.name?.charAt(0).toUpperCase() || "A"}
                  </div>
                )}
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-blue-800"></div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium truncate max-w-[100px]">{user?.name}</p>
                <p className="text-xs text-blue-200">Administrator</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-blue-200 hover:text-white hover:bg-blue-700/30"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>

          {/* System Status Section in Sidebar */}
          <div className="mb-4">
            <h3 className="text-xs font-semibold text-blue-200 uppercase tracking-wider mb-2">System Status</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-blue-200/80">Active Users</span>
                <span className="font-medium">{allUsers.length}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-blue-200/80">Active Doctors</span>
                <span className="font-medium">{doctorsCount}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-blue-200/80">Patients in Queue</span>
                <span className="font-medium">{activeQueue.length}</span>
              </div>
            </div>
          </div>

          {/* Language Selector */}
          <div className="mt-4">
            <select
              className="w-full bg-blue-700/50 border border-blue-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        <header className="bg-white shadow-md z-10 border-b border-gray-200">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="mr-4 text-gray-700 hover:text-gray-900 transition-colors duration-200"
              >
                <Menu className="h-6 w-6" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                  <img
                    src="/sevamed logo.png"
                    alt="SevaMed Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Welcome, {user?.name || "Administrator"}</h1>
                  <p className="text-sm text-gray-600">
                    {currentTime.toLocaleDateString()}
                  </p>
                </div>
              </div>

            </div>

            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                className="hidden md:flex items-center border-gray-300 text-gray-700 hover:bg-gray-100 transition-all duration-200"
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
                  className="relative text-gray-700 hover:text-gray-900 transition-colors duration-200"
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
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50 border border-gray-200">
                    <div className="p-4 border-b border-gray-200 bg-gray-50">
                      <h3 className="font-semibold text-gray-900">Notifications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {/* Sample notifications */}
                      <div className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                              <Users className="h-4 w-4 text-blue-600" />
                            </div>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">New Patient Registration</p>
                            <p className="text-sm text-gray-600">John Doe has registered as a new patient</p>
                            <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                              <AlertTriangle className="h-4 w-4 text-amber-600" />
                            </div>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">Critical Case Alert</p>
                            <p className="text-sm text-gray-600">Patient requires immediate attention</p>
                            <p className="text-xs text-gray-400 mt-1">5 hours ago</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                              <FileText className="h-4 w-4 text-purple-600" />
                            </div>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">System Report Ready</p>
                            <p className="text-sm text-gray-600">Daily system report is now available</p>
                            <p className="text-xs text-gray-400 mt-1">1 day ago</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 text-center">
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
                    className="w-8 h-8 rounded-full object-cover border-2 border-gray-300"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-sm font-bold border-2 border-gray-300">
                    {user?.name?.charAt(0).toUpperCase() || "A"}
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Content Area with bright, accessible background */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50 w-full">
          {activeTab === "overview" && (
            <div className="space-y-8 fade-in" data-testid="admin-dashboard">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">System Overview</h1>
                <p className="text-gray-600">Manage your healthcare facility efficiently</p>
              </div>

              {/* Stats Cards with Enhanced Styling */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-l-4 border-l-blue-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white cursor-pointer transform hover:scale-[1.02] border-2 border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm">Active Doctors</p>
                        <p className="text-3xl font-bold text-gray-900">{doctorsCount}</p>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <UserCheck className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm">
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-green-600">All active</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-amber-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white cursor-pointer transform hover:scale-[1.02] border-2 border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm">Reception Staff</p>
                        <p className="text-3xl font-bold text-gray-900">{receptionCount}</p>
                      </div>
                      <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                        <Users className="h-6 w-6 text-amber-600" />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm">
                      <Clock className="h-4 w-4 text-gray-500 mr-1" />
                      <span className="text-gray-600">On duty</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white cursor-pointer transform hover:scale-[1.02] border-2 border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm">Total Patients</p>
                        <p className="text-3xl font-bold text-gray-900">{patientsCount}</p>
                      </div>
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Activity className="h-6 w-6 text-purple-600" />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm">
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-green-600">Growing</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-red-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white cursor-pointer transform hover:scale-[1.02] border-2 border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm">Critical Cases</p>
                        <p className="text-3xl font-bold text-red-600">{criticalCases}</p>
                      </div>
                      <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                        <AlertTriangle className="h-6 w-6 text-red-600" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <span className="text-red-600 text-sm font-medium">
                        {criticalCases > 0 ? "Requires attention" : "All stable"}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Staff Attendance Overview */}
                <Card className="border-t-4 border-t-blue-500 hover:shadow-xl transition-all duration-300 bg-white border-2 border-gray-200">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Clock className="h-5 w-5 text-blue-600" />
                      <span>Today's Staff Attendance</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {todaysAttendance.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No attendance records for today</p>
                      ) : (
                        todaysAttendance.map((attendance: any, index: number) => (
                          <div key={attendance.id || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium text-gray-900">Staff Member</p>
                              <p className="text-sm text-gray-600">{attendance.location || "General"}</p>
                            </div>
                            <div className="text-right">
                              <Badge variant={attendance.status === "present" ? "default" : "secondary"}>
                                {attendance.status}
                              </Badge>
                              <p className="text-sm text-gray-500 mt-1">
                                {attendance.checkIn ? new Date(attendance.checkIn).toLocaleTimeString() : "Not checked in"}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* System Activities */}
                <Card className="border-t-4 border-t-green-500 hover:shadow-xl transition-all duration-300 bg-white border-2 border-gray-200">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Activity className="h-5 w-5 text-green-600" />
                      <span>System Activities</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                          <div>
                            <p className="font-medium text-gray-900">System Health Check</p>
                            <p className="text-sm text-gray-600">All systems operational</p>
                            <span className="text-xs text-gray-500">2 minutes ago</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-amber-500 rounded-full mt-2"></div>
                          <div>
                            <p className="font-medium text-gray-900">New Patient Registration</p>
                            <p className="text-sm text-gray-600">{patientsCount} total patients registered</p>
                            <span className="text-xs text-gray-500">10 minutes ago</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                          <div>
                            <p className="font-medium text-gray-900">Queue Updated</p>
                            <p className="text-sm text-gray-600">{activeQueue.length} patients in queue</p>
                            <span className="text-xs text-gray-500">15 minutes ago</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Admin Messaging System */}
              <Card className="border-t-4 border-t-indigo-500 hover:shadow-xl transition-all duration-300 bg-white border-2 border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageSquare className="h-5 w-5 text-indigo-600" />
                    <span>Admin Messaging System</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <AdminMessaging />
                </CardContent>
              </Card>

              {/* Current Queue Status */}
              <Card className="border-t-4 border-t-cyan-500 hover:shadow-xl transition-all duration-300 bg-white border-2 border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="h-5 w-5 text-cyan-600" />
                      <span>Current Patient Queue</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowEmergencyForm(!showEmergencyForm)}
                        data-testid="add-emergency-patient"
                        className="border-cyan-300 text-cyan-700 hover:bg-cyan-100"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Emergency
                      </Button>
                      <Button variant="outline" size="sm" data-testid="refresh-queue" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                        Refresh
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {activeQueue.length === 0 ? (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No patients in queue</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {activeQueue.map((entry: QueueEntry, index: number) => (
                        <div key={entry.id || index} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                          <div>
                            <p className="font-medium text-gray-900">Patient #{entry.position}</p>
                            <p className="text-sm text-gray-600">
                              Waiting time: {entry.estimatedWaitTime || 0} minutes
                            </p>
                          </div>
                          <div className="flex items-center space-x-4">
                            <Badge variant={
                              entry.priority === "critical" ? "destructive" :
                                entry.priority === "urgent" ? "secondary" : "default"
                            }>
                              {entry.priority}
                            </Badge>
                            <Badge variant="outline">
                              {entry.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                      {completedPatients > 0 && (
                        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                          <p className="text-green-800">
                            {completedPatients} patient(s) completed sessions and removed from queue
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "appointments" && (
            <div className="space-y-6 w-full">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Patient Appointments</h2>
                <Button
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg transition-all duration-300 hover:shadow-xl transform hover:scale-105"
                  onClick={() => setShowAppointmentForm(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Appointment
                </Button>
              </div>

              {showAppointmentForm && (
                <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-blue-900">Create New Appointment</h3>
                    <Button variant="outline" onClick={() => setShowAppointmentForm(false)}>
                      Close
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="patient">Select Patient</Label>
                      <Select onValueChange={(value) => console.log(value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a patient" />
                        </SelectTrigger>
                        <SelectContent>
                          {allUsers
                            .filter((u: UserType) => u.role === "patient")
                            .map((patient: UserType) => (
                              <SelectItem key={patient.id} value={patient.id}>
                                {patient.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="doctor">Select Doctor</Label>
                      <Select onValueChange={(value) => console.log(value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a doctor" />
                        </SelectTrigger>
                        <SelectContent>
                          {doctors.map((doctor: UserType) => (
                            <SelectItem key={doctor.id} value={doctor.id}>
                              {doctor.name} - {doctor.specialization}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="date">Appointment Date</Label>
                      <Input type="date" onChange={(e) => console.log(e.target.value)} />
                    </div>
                    <div>
                      <Label htmlFor="time">Appointment Time</Label>
                      <Input type="time" onChange={(e) => console.log(e.target.value)} />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="symptoms">Symptoms</Label>
                      <Input placeholder="Describe patient symptoms" onChange={(e) => console.log(e.target.value)} />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Select onValueChange={(value) => console.log(value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                          <SelectItem value="critical">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setShowAppointmentForm(false)}>
                      Cancel
                    </Button>
                    <Button
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => {
                        toast({
                          title: "Success",
                          description: "Appointment created successfully!"
                        });
                        setShowAppointmentForm(false);
                        queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
                      }}
                    >
                      Create Appointment
                    </Button>
                  </div>
                </div>
              )}

              <Card className="shadow-lg hover:shadow-xl transition-all duration-300 bg-white border-2 border-gray-200">
                <CardContent className="p-0">
                  {allAppointments.length === 0 ? (
                    <div className="text-center py-12">
                      <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Patient Appointments</h3>
                      <p className="text-gray-600 mb-4">There are no appointments submitted by patients.</p>
                      <Button
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
                        onClick={() => setShowAppointmentForm(true)}
                      >
                        Create Appointment
                      </Button>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {allAppointments.map((apt: Appointment, index: number) => (
                        <div
                          key={apt.id || index}
                          className="p-6 hover:bg-gray-50 transition-colors duration-200 cursor-pointer transform hover:scale-[1.01]"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center mb-2">
                                <h3 className="font-bold text-lg text-gray-900 mr-3">Patient: {apt.patientId || "Unknown"}</h3>
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
                              <p className="text-gray-700 mb-3">{apt.symptoms || "General Checkup"}</p>
                              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
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
                              <Badge variant="outline" className="text-xs bg-gray-100 text-gray-800 mb-2">
                                {apt.priority}
                              </Badge>
                              <Button
                                variant="outline"
                                size="sm"
                                className="mt-2 border-gray-300 text-gray-700 hover:bg-gray-100"
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

          {activeTab === "queue" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Patient Queue Management</h2>
                <Button
                  className="bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white shadow-lg transition-all duration-300 hover:shadow-xl transform hover:scale-105"
                  onClick={() => setShowEmergencyForm(!showEmergencyForm)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Emergency Patient
                </Button>
              </div>

              {/* Emergency Patient Form */}
              {showEmergencyForm && (
                <Card className="border-t-4 border-t-red-500 hover:shadow-xl transition-all duration-300 bg-white border-2 border-gray-200">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                      <span>Add Emergency Patient</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="patient">Select Patient</Label>
                      <Select value={emergencyPatientId} onValueChange={setEmergencyPatientId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a patient" />
                        </SelectTrigger>
                        <SelectContent>
                          {allUsers
                            .filter((u: UserType) => u.role === "patient")
                            .map((patient: UserType) => (
                              <SelectItem key={patient.id} value={patient.id}>
                                {patient.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="priority">Priority</Label>
                      <Select value={emergencyPriority} onValueChange={setEmergencyPriority}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="critical">Critical</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                          <SelectItem value="normal">Normal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      variant="default"
                      className="bg-red-500 hover:bg-red-600 text-white"
                      onClick={handleAddEmergencyPatient}
                    >
                      Add Patient
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Current Queue Status */}
              <Card className="border-t-4 border-t-cyan-500 hover:shadow-xl transition-all duration-300 bg-white border-2 border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="h-5 w-5 text-cyan-600" />
                      <span>Current Patient Queue</span>
                    </div>
                    <Button variant="outline" size="sm" data-testid="refresh-queue" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                      Refresh
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {activeQueue.length === 0 ? (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No patients in queue</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {activeQueue.map((entry: QueueEntry, index: number) => (
                        <div key={entry.id || index} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                          <div>
                            <p className="font-medium text-gray-900">Patient #{entry.position}</p>
                            <p className="text-sm text-gray-600">
                              Waiting time: {entry.estimatedWaitTime || 0} minutes
                            </p>
                          </div>
                          <div className="flex items-center space-x-4">
                            <Badge variant={
                              entry.priority === "critical" ? "destructive" :
                                entry.priority === "urgent" ? "secondary" : "default"
                            }>
                              {entry.priority}
                            </Badge>
                            <Badge variant="outline">
                              {entry.status}
                            </Badge>
                            <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                              Manage
                            </Button>
                          </div>
                        </div>
                      ))}
                      {completedPatients > 0 && (
                        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                          <p className="text-green-800">
                            {completedPatients} patient(s) completed sessions and removed from queue
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "staff" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Staff Management</h2>
                <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg transition-all duration-300 hover:shadow-xl transform hover:scale-105">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Staff Member
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-t-4 border-t-blue-500 hover:shadow-xl transition-all duration-300 bg-white border-2 border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className="rounded-full bg-blue-100 p-3 mr-4">
                        <UserCheck className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Total Doctors</p>
                        <p className="text-2xl font-bold text-gray-900">{doctorsCount}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-t-4 border-t-amber-500 hover:shadow-xl transition-all duration-300 bg-white border-2 border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className="rounded-full bg-amber-100 p-3 mr-4">
                        <Users className="h-6 w-6 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Reception Staff</p>
                        <p className="text-2xl font-bold text-gray-900">{receptionCount}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-t-4 border-t-purple-500 hover:shadow-xl transition-all duration-300 bg-white border-2 border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className="rounded-full bg-purple-100 p-3 mr-4">
                        <Settings className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Admin Staff</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {allUsers.filter((u: UserType) => u.role === "admin").length}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-t-4 border-t-indigo-500 hover:shadow-xl transition-all duration-300 bg-white border-2 border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-indigo-600" />
                    <span>All Staff Members</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {allUsers.map((staff: UserType, index: number) => (
                          <tr key={staff.id || index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold">
                                    {staff.name?.charAt(0).toUpperCase() || "S"}
                                  </div>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{staff.name}</div>
                                  <div className="text-sm text-gray-500">{staff.username}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge variant={
                                staff.role === "admin" ? "default" :
                                  staff.role === "doctor" ? "secondary" :
                                    staff.role === "reception" ? "outline" : "default"
                              }>
                                {staff.role}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{staff.email || "N/A"}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                Active
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <Button
                                variant="outline"
                                size="sm"
                                className="mr-2 border-gray-300 text-gray-700 hover:bg-gray-100"
                                onClick={() => handleEditStaff(staff)}
                              >
                                Edit
                              </Button>
                              <Button variant="outline" size="sm" className="border-red-300 text-red-700 hover:bg-red-100">
                                Remove
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Edit Staff Member Modal */}
              {showEditStaffForm && editingStaff && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Edit Staff Member</h3>
                        <button
                          onClick={() => setShowEditStaffForm(false)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="editName">Full Name</Label>
                          <Input
                            id="editName"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                          />
                        </div>

                        <div>
                          <Label htmlFor="editUsername">Username</Label>
                          <Input
                            id="editUsername"
                            value={editUsername}
                            onChange={(e) => setEditUsername(e.target.value)}
                          />
                        </div>

                        <div>
                          <Label htmlFor="editEmail">Email</Label>
                          <Input
                            id="editEmail"
                            type="email"
                            value={editEmail}
                            onChange={(e) => setEditEmail(e.target.value)}
                          />
                        </div>

                        <div>
                          <Label htmlFor="editRole">Role</Label>
                          <Select value={editRole} onValueChange={setEditRole}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="doctor">Doctor</SelectItem>
                              <SelectItem value="reception">Reception</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="editPhone">Phone</Label>
                          <Input
                            id="editPhone"
                            value={editPhone}
                            onChange={(e) => setEditPhone(e.target.value)}
                          />
                        </div>

                        <div>
                          <Label htmlFor="editAddress">Address</Label>
                          <Input
                            id="editAddress"
                            value={editAddress}
                            onChange={(e) => setEditAddress(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="mt-6 flex justify-end space-x-3">
                        <Button
                          variant="outline"
                          onClick={() => setShowEditStaffForm(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleSaveEditedStaff}
                          disabled={updateStaffMutation.isPending}
                        >
                          {updateStaffMutation.isPending ? "Saving..." : "Save Changes"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "reports" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">System Reports</h2>
                <Button variant="outline" className="flex items-center border-gray-300 text-gray-700 hover:bg-gray-100">
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-t-4 border-t-blue-500 hover:shadow-xl transition-all duration-300 bg-white border-2 border-gray-200">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <BarChart3 className="h-5 w-5 text-blue-600" />
                      <span>Appointments Overview</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center">
                      <div className="text-center">
                        <BarChart3 className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                        <p className="text-gray-500">Chart visualization would appear here</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-t-4 border-t-green-500 hover:shadow-xl transition-all duration-300 bg-white border-2 border-gray-200">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Activity className="h-5 w-5 text-green-600" />
                      <span>Patient Flow</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center">
                      <div className="text-center">
                        <Activity className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                        <p className="text-gray-500">Chart visualization would appear here</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-t-4 border-t-purple-500 hover:shadow-xl transition-all duration-300 bg-white border-2 border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-purple-600" />
                    <span>Recent Reports</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Daily Patient Summary</p>
                        <p className="text-sm text-gray-600">Generated today at 08:00 AM</p>
                      </div>
                      <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                        Download
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Monthly Revenue Report</p>
                        <p className="text-sm text-gray-600">Generated yesterday at 11:30 PM</p>
                      </div>
                      <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                        Download
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Staff Performance Report</p>
                        <p className="text-sm text-gray-600">Generated 2 days ago</p>
                      </div>
                      <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                        Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "messaging" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">System Messaging</h2>
              </div>

              {/* Use the enhanced AdminMessaging component */}
              <AdminMessaging />
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">System Settings</h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Picture and Basic Info */}
                <div className="lg:col-span-1">
                  <Card className="border-t-4 border-t-blue-500 hover:shadow-xl transition-all duration-300 bg-white border-2 border-gray-200">
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center">
                        {/* Profile Picture */}
                        <div className="relative mb-4">
                          {profileImage ? (
                            <img
                              src={profileImage}
                              alt={user.name}
                              className="w-32 h-32 rounded-full object-cover shadow-lg border-4 border-white"
                            />
                          ) : (
                            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg border-4 border-white">
                              {user?.name?.charAt(0).toUpperCase() || "A"}
                            </div>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            className="absolute bottom-2 right-2 rounded-full w-8 h-8 p-0 bg-white border-2 border-blue-500 text-blue-600 hover:bg-blue-100 hover:shadow-lg transform hover:scale-110 transition-all duration-200"
                          >
                            <UserIcon className="h-4 w-4" />
                          </Button>
                        </div>

                        <h3 className="text-xl font-bold text-center text-gray-900">{user?.name}</h3>
                        <p className="text-gray-600 text-center">Administrator</p>

                        <div className="mt-4 w-full space-y-2">
                          <div className="flex items-center text-sm text-gray-700">
                            <UserCheck className="h-4 w-4 mr-2 text-blue-600" />
                            <span>System Administrator</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-700">
                            <Shield className="h-4 w-4 mr-2 text-blue-600" />
                            <span>Admin ID: {user?.id?.substring(0, 8) || "N/A"}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Detailed Settings */}
                <div className="lg:col-span-2 space-y-6">
                  <Card className="border-t-4 border-t-indigo-500 hover:shadow-xl transition-all duration-300 bg-white border-2 border-gray-200">
                    <CardHeader>
                      <CardTitle className="flex items-center text-gray-900">
                        <Cog className="h-5 w-5 mr-2 text-indigo-600" />
                        System Configuration
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h3 className="text-lg font-medium mb-2 text-gray-900">General Settings</h3>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-gray-700">Email Notifications</span>
                            <Button
                              variant="outline"
                              size="sm"
                              className={`hover:bg-gray-100 hover:border-gray-300 ${emailNotifications ? 'bg-green-100 border-green-300 hover:bg-green-200' : 'bg-red-100 border-red-300 hover:bg-red-200'}`}
                              onClick={() => setEmailNotifications(!emailNotifications)}
                            >
                              {emailNotifications ? 'Enabled' : 'Disabled'}
                            </Button>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-gray-700">SMS Notifications</span>
                            <Button
                              variant="outline"
                              size="sm"
                              className={`hover:bg-gray-100 hover:border-gray-300 ${smsNotifications ? 'bg-green-100 border-green-300 hover:bg-green-200' : 'bg-red-100 border-red-300 hover:bg-red-200'}`}
                              onClick={() => setSmsNotifications(!smsNotifications)}
                            >
                              {smsNotifications ? 'Enabled' : 'Disabled'}
                            </Button>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-gray-700">Push Notifications</span>
                            <Button
                              variant="outline"
                              size="sm"
                              className={`hover:bg-gray-100 hover:border-gray-300 ${pushNotifications ? 'bg-green-100 border-green-300 hover:bg-green-200' : 'bg-red-100 border-red-300 hover:bg-red-200'}`}
                              onClick={() => setPushNotifications(!pushNotifications)}
                            >
                              {pushNotifications ? 'Enabled' : 'Disabled'}
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-2 text-gray-900">Security</h3>
                        <div className="space-y-2">
                          <Button
                            variant="outline"
                            className="w-full justify-between hover:bg-gray-100 hover:border-gray-300"
                            onClick={() => {
                              // Show change password modal or navigate to password change page
                              toast({
                                title: "Feature Coming Soon",
                                description: "Password change functionality will be implemented in the next update."
                              });
                            }}
                          >
                            Change Password
                            <span>→</span>
                          </Button>
                          <Button
                            variant="outline"
                            className="w-full justify-between hover:bg-gray-100 hover:border-gray-300"
                            onClick={() => {
                              // Show 2FA setup modal
                              toast({
                                title: "Feature Coming Soon",
                                description: "Two-factor authentication setup will be implemented in the next update."
                              });
                            }}
                          >
                            Two-Factor Authentication
                            <span>→</span>
                          </Button>
                          <Button
                            variant="outline"
                            className="w-full justify-between text-red-600 hover:text-red-700 hover:bg-red-100 hover:border-red-300"
                            onClick={() => {
                              // Confirm and logout from all devices
                              if (window.confirm("Are you sure you want to logout from all devices?")) {
                                logout();
                                toast({
                                  title: "Logged Out",
                                  description: "You have been logged out from all devices."
                                });
                              }
                            }}
                          >
                            Logout from all devices
                            <span>→</span>
                          </Button>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-2 text-gray-900">Language Preferences</h3>
                        <select
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                          value={selectedLanguage}
                          onChange={(e) => {
                            const newLanguage = e.target.value as "en" | "te" | "hi";
                            setSelectedLanguage(newLanguage);
                            setLanguage(newLanguage);
                            toast({
                              title: "Language Changed",
                              description: `Interface language changed to ${newLanguage === 'en' ? 'English' : newLanguage === 'te' ? 'తెలుగు' : 'हिंदी'}`
                            });
                          }}
                        >
                          <option value="en">English</option>
                          <option value="te">తెలుగు</option>
                          <option value="hi">हिंदी</option>
                        </select>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}