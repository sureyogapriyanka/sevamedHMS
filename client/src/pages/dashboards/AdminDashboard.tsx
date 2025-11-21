import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../../components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "../../lib/queryClient";
import { toast } from "../../hooks/use-toast";
import { useNavigate, useLocation } from "react-router-dom";

import {
  Users,
  Calendar,
  Activity,
  Home,
  Settings,
  LogOut,
  User,
  UserPlus,
  Edit3,
  Trash2,
  Stethoscope,
  CreditCard,
  Clock,
  FileText,
  MessageSquare,
  BarChart3,
  Shield,
  Hospital,
  BookOpen,
  Bell,
  Search,
  Plus,
  CheckCircle,
  AlertCircle,
  Phone,
  Video,
  Mail,
  MapPin,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Eye,
  Download,
  Filter,
  RefreshCw,
  Menu,
  X,
  Save,
  Star,
  PieChart,
  LineChart,
  BarChart,
  Package,
  Paperclip,
  Send,
  MoreVertical
} from "lucide-react";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("overview");
  const [editingUser, setEditingUser] = useState<any>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState("");
  const [editSpecialization, setEditSpecialization] = useState("");
  const [editDepartment, setEditDepartment] = useState("");
  const [selectedChartItem, setSelectedChartItem] = useState<any>(null);
  const [chartFilter, setChartFilter] = useState("all");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Navigation items for sidebar
  const navigationItems = [
    { id: "overview", label: "Dashboard", icon: Home },
    { id: "users", label: "User Management", icon: Users },
    { id: "staff", label: "Staff Management", icon: Stethoscope },
    { id: "queue", label: "Queue Management", icon: Users },
    { id: "payments", label: "Payments Management", icon: CreditCard },
    { id: "analytics", label: "Data Analytics", icon: BarChart3 },
    { id: "insights", label: "Health Insights", icon: Activity },
    { id: "chat", label: "Chat System", icon: MessageSquare },
    { id: "reports", label: "Reports", icon: FileText },
    { id: "settings", label: "System Settings", icon: Settings }
  ];

  // Mock data for analytics
  const [analyticsData, setAnalyticsData] = useState({
    totalUsers: 1242,
    totalDoctors: 42,
    totalPatients: 1150,
    totalAppointments: 324,
    totalRevenue: 124500,
    activeSessions: 67,
    pendingPayments: 23,
    completedAppointments: 289,
    canceledAppointments: 12,
    avgRating: 4.7,
    criticalPatients: 18,
    routineCheckups: 156,
    emergencyCases: 42,
    avgRecoveryTime: 7.2,
    totalReports: 1248,
    patientReports: 865,
    financialReports: 212,
    operationalReports: 171,
    systemUptime: 99.8,
    storageUsed: 85,
    securityScore: 92
  });

  // Mock data for charts
  const [chartData, setChartData] = useState({
    appointments: [
      { month: "Jan", count: 65 },
      { month: "Feb", count: 78 },
      { month: "Mar", count: 90 },
      { month: "Apr", count: 81 },
      { month: "May", count: 95 },
      { month: "Jun", count: 102 },
      { month: "Jul", count: 115 },
      { month: "Aug", count: 98 },
      { month: "Sep", count: 108 },
      { month: "Oct", count: 125 },
      { month: "Nov", count: 110 },
      { month: "Dec", count: 130 }
    ],
    revenue: [
      { month: "Jan", amount: 24000 },
      { month: "Feb", amount: 28000 },
      { month: "Mar", amount: 32000 },
      { month: "Apr", amount: 29000 },
      { month: "May", amount: 35000 },
      { month: "Jun", amount: 38000 },
      { month: "Jul", amount: 42000 },
      { month: "Aug", amount: 37000 },
      { month: "Sep", amount: 39000 },
      { month: "Oct", amount: 45000 },
      { month: "Nov", amount: 41000 },
      { month: "Dec", amount: 48000 }
    ],
    userGrowth: [
      { month: "Jan", users: 120 },
      { month: "Feb", users: 145 },
      { month: "Mar", users: 180 },
      { month: "Apr", users: 210 },
      { month: "May", users: 250 },
      { month: "Jun", users: 290 },
      { month: "Jul", users: 310 },
      { month: "Aug", users: 330 },
      { month: "Sep", users: 350 },
      { month: "Oct", users: 370 },
      { month: "Nov", users: 390 },
      { month: "Dec", users: 420 }
    ]
  });

  // Mock data for queue analytics
  const [queueData, setQueueData] = useState({
    waiting: 12,
    inProgress: 8,
    completed: 25,
    averageWaitTime: 15,
    doctorsAvailable: 5,
    todayAppointments: 32
  });

  // Mock data for queue charts
  const [queueChartData, setQueueChartData] = useState({
    waitTimes: [
      { hour: "9AM", waitTime: 20 },
      { hour: "10AM", waitTime: 25 },
      { hour: "11AM", waitTime: 15 },
      { hour: "12PM", waitTime: 30 },
      { hour: "1PM", waitTime: 10 },
      { hour: "2PM", waitTime: 22 },
      { hour: "3PM", waitTime: 18 },
      { hour: "4PM", waitTime: 28 },
      { hour: "5PM", waitTime: 12 }
    ],
    queueStatus: [
      { name: "Waiting", value: 12, color: "bg-yellow-500" },
      { name: "In Progress", value: 8, color: "bg-blue-500" },
      { name: "Completed", value: 25, color: "bg-green-500" }
    ],
    doctorLoad: [
      { doctor: "Dr. Anjali Verma", patients: 6 },
      { doctor: "Dr. Rajiv Malhotra", patients: 5 },
      { doctor: "Dr. Nalini Iyer", patients: 7 },
      { doctor: "Dr. Arjun Nair", patients: 4 },
      { doctor: "Nurse Kavita", patients: 3 },
      { doctor: "Dr. Suresh Kumar", patients: 8 },
      { doctor: "Dr. Priya Menon", patients: 5 }
    ]
  });

  // Mock data for chat messages
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: "Dr. Anjali Verma", message: "Good morning team!", time: "9:00 AM", avatar: "AV" },
    { id: 2, sender: "Nurse Kavita", message: "Good morning Doctor. Ready for today's appointments.", time: "9:02 AM", avatar: "NK" },
    { id: 3, sender: "Dr. Rajiv Malhotra", message: "I need to reschedule my 11 AM appointment.", time: "9:15 AM", avatar: "RM" },
    { id: 4, sender: "Admin", message: "Noted Dr. Malhotra. I'll handle that for you.", time: "9:17 AM", avatar: "AD", isOwn: true }
  ]);

  // State for new chat message
  const [newMessage, setNewMessage] = useState("");

  // Handle sending a new chat message
  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      const message = {
        id: chatMessages.length + 1,
        sender: "Admin",
        message: newMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        avatar: "AD",
        isOwn: true
      };
      setChatMessages([...chatMessages, message]);
      setNewMessage("");
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Handle edit staff
  const handleEditStaff = (staff: any) => {
    setEditingUser(staff);
    setEditName(staff.name || "");
    setEditEmail(staff.email || "");
    setEditSpecialization(staff.specialization || "");
    setEditDepartment(staff.department || "");
    // Set role based on staff type
    if (staff.name?.includes("Dr.")) {
      setEditRole("doctor");
    } else if (staff.name?.includes("Nurse")) {
      setEditRole("nurse");
    } else if (staff.name?.includes("Lab Technician")) {
      setEditRole("lab");
    } else {
      setEditRole("staff");
    }
  };

  // Handle save staff changes
  const handleSaveStaff = async () => {
    // In a real application, this would call an API to update the staff member
    console.log("Saving staff changes:", {
      id: editingUser?.id,
      name: editName,
      email: editEmail,
      specialization: editSpecialization,
      department: editDepartment,
      role: editRole
    });

    // Reset editing state
    setEditingUser(null);

    // Show success message
    alert(`Staff member ${editName} updated successfully!`);
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingUser(null);
  };

  // Handle send message on Enter key
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Close sidebar when route changes (for mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location]);

  // Initialize active tab based on URL
  useEffect(() => {
    const path = location.pathname;
    if (path.includes("/admin/users")) setActiveTab("users");
    else if (path.includes("/admin/staff")) setActiveTab("staff");
    else if (path.includes("/admin/queue")) setActiveTab("queue");
    else if (path.includes("/admin/payments")) setActiveTab("payments");
    else if (path.includes("/admin/analytics")) setActiveTab("analytics");
    else if (path.includes("/admin/insights")) setActiveTab("insights");
    else if (path.includes("/admin/chat")) setActiveTab("chat");
    else if (path.includes("/admin/reports")) setActiveTab("reports");
    else if (path.includes("/admin/settings")) setActiveTab("settings");
    else setActiveTab("overview");
  }, [location]);

  // Progress bar component
  const ProgressBar = ({ value, max, color = "bg-blue-600" }: { value: number; max: number; color?: string }) => (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div
        className={`${color} h-2 rounded-full`}
        style={{ width: `${(value / max) * 100}%` }}
      ></div>
    </div>
  );

  // Enhanced Chart component for analytics with trend lines
  const EnhancedBarChart = ({ data, dataKey, color = "bg-blue-600", title, onBarClick }: { data: any[]; dataKey: string; color?: string; title?: string; onBarClick?: (item: any) => void; }) => {
    const maxValue = Math.max(...data.map(d => d[dataKey]));

    // Calculate trend (simple moving average for demonstration)
    const calculateTrend = () => {
      if (data.length < 2) return "neutral";
      const firstHalf = data.slice(0, Math.floor(data.length / 2));
      const secondHalf = data.slice(Math.floor(data.length / 2));
      const firstAvg = firstHalf.reduce((sum, item) => sum + item[dataKey], 0) / firstHalf.length;
      const secondAvg = secondHalf.reduce((sum, item) => sum + item[dataKey], 0) / secondHalf.length;
      if (secondAvg > firstAvg) return "up";
      if (secondAvg < firstAvg) return "down";
      return "neutral";
    };

    const trend = calculateTrend();

    // Calculate average value
    const averageValue = data.reduce((sum, item) => sum + item[dataKey], 0) / data.length;

    return (
      <div className="p-4">
        {title && (
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            <div className="flex items-center">
              {trend === "up" && <TrendingUp className="h-4 w-4 text-green-500" />}
              {trend === "down" && <TrendingDown className="h-4 w-4 text-red-500" />}
              {trend === "neutral" && <Activity className="h-4 w-4 text-blue-500" />}
              <span className="text-xs ml-1 text-gray-500 font-medium">
                {trend === "up" ? "Increasing" : trend === "down" ? "Decreasing" : "Stable"}
              </span>
            </div>
          </div>
        )}
        <div className="flex items-end space-x-2 h-64 relative">
          {/* Background grid lines for better visibility of gaps */}
          <div className="absolute inset-0 flex flex-col justify-between">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-full border-t border-gray-200"></div>
            ))}
          </div>

          {/* Average line */}
          <div
            className="absolute left-0 right-0 h-0.5 bg-gray-400 opacity-70"
            style={{ bottom: `${maxValue > 0 ? (averageValue / maxValue) * 80 : 0}%` }}
          >
            <div className="absolute -top-6 left-0 text-xs text-gray-600">
              Avg: {Math.round(averageValue)}
            </div>
          </div>

          {/* Chart bars */}
          {data.map((item, index) => (
            <div key={index} className="flex flex-col items-center flex-1 group">
              <div className="text-xs text-gray-500 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">{item[dataKey]}</div>
              <div
                className={`${color} rounded-t hover:opacity-75 transition-all duration-300 w-full shadow-md hover:shadow-lg cursor-pointer`}
                style={{ height: `${maxValue > 0 ? (item[dataKey] / maxValue) * 80 : 0}%` }}
                title={`${item.month || item.doctor}: ${item[dataKey]}`}
                onClick={() => onBarClick && onBarClick(item)}
              >
                <div className="h-full w-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-bold">
                  {item[dataKey]}
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-1">{item.month || item.doctor}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-xs text-gray-500 flex justify-between">
          <span>Min: {Math.min(...data.map(d => d[dataKey]))}</span>
          <span>Max: {Math.max(...data.map(d => d[dataKey]))}</span>
        </div>
      </div>
    );
  };

  // Pie Chart Component
  const PieChartComponent = ({ data, title }: { data: { name: string; value: number; color: string }[]; title?: string }) => {
    const chartData = data || [
      { name: "Completed", value: 85, color: "bg-green-500" },
      { name: "Pending", value: 10, color: "bg-yellow-500" },
      { name: "Canceled", value: 5, color: "bg-red-500" }
    ];

    let startAngle = 0;

    // Calculate total for accurate percentages
    const total = chartData.reduce((sum, item) => sum + item.value, 0);

    return (
      <div className="flex flex-col items-center">
        {title && <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>}
        <div className="relative w-48 h-48">
          {chartData.map((item, index) => {
            const percentage = (item.value / total) * 100;
            const angle = (percentage / 100) * 360;
            const endAngle = startAngle + angle;

            // Store the start angle for the next item
            const currentStartAngle = startAngle;
            startAngle = endAngle;

            return (
              <div
                key={index}
                className={`absolute w-full h-full rounded-full ${item.color} opacity-80 hover:opacity-100 transition-opacity duration-300 cursor-pointer`}
                style={{
                  clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos((currentStartAngle - 90) * Math.PI / 180)}% ${50 + 50 * Math.sin((currentStartAngle - 90) * Math.PI / 180)}%, ${50 + 50 * Math.cos((endAngle - 90) * Math.PI / 180)}% ${50 + 50 * Math.sin((endAngle - 90) * Math.PI / 180)}%)`
                }}
                title={`${item.name}: ${item.value} (${percentage.toFixed(1)}%)`}
              >
                <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xs opacity-0 hover:opacity-100 transition-opacity duration-300">
                  {percentage.toFixed(0)}%
                </div>
              </div>
            );
          })}
          {/* Center circle for better visual */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
            <span className="text-xs font-bold text-gray-700">{total}</span>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-2 w-full max-w-xs">
          {chartData.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              <div className="flex items-center">
                <div className={`w-4 h-4 rounded-full ${item.color} mr-3`}></div>
                <span className="text-sm font-medium text-gray-700">{item.name}</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm font-bold text-gray-900 mr-2">{item.value}</span>
                <span className="text-xs text-gray-500">({((item.value / total) * 100).toFixed(1)}%)</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Edit Staff Modal
  const EditStaffModal = () => {
    if (!editingUser) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Edit Staff Member</h3>
              <button
                onClick={handleCancelEdit}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                <input
                  type="text"
                  value={editSpecialization}
                  onChange={(e) => setEditSpecialization(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <input
                  type="text"
                  value={editDepartment}
                  onChange={(e) => setEditDepartment(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="doctor">Doctor</option>
                  <option value="nurse">Nurse</option>
                  <option value="lab">Lab Technician</option>
                  <option value="staff">Staff</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <Button
                variant="outline"
                onClick={handleCancelEdit}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveStaff}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <EditStaffModal />
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-blue-600 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-blue-500">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <Hospital className="h-5 w-5 text-blue-600" />
              </div>
              <span className="text-lg font-bold">Admin Panel</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-white hover:bg-blue-700"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === item.id
                        ? "bg-blue-700 text-white"
                        : "text-blue-100 hover:bg-blue-700"
                        }`}
                    >
                      <Icon className="h-5 w-5 mr-3" />
                      {item.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Bottom section */}
          <div className="p-4 border-t border-blue-500">
            <Button
              variant="outline"
              className="w-full justify-start border-white text-white hover:bg-blue-700"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Header */}
        <header className="bg-blue-600 border-b border-blue-500 text-white">
          <div className="flex items-center justify-between h-16 px-4">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden mr-2 text-white hover:bg-blue-700"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <Hospital className="h-5 w-5 text-blue-600" />
                </div>
                <span className="text-lg font-bold hidden sm:block text-white">Admin Dashboard</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-200" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-white bg-blue-700 text-white placeholder-blue-200 border-blue-500"
                />
              </div>

              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative text-white hover:bg-blue-700">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-white text-blue-600">
                  3
                </Badge>
              </Button>

              {/* User menu */}
              {user && (
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="hidden md:block">
                    <p className="text-sm font-medium text-white">{user.name}</p>
                    <p className="text-xs text-blue-200 capitalize">
                      {user.role}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Mobile search bar */}
        <div className="p-4 border-b md:hidden border-blue-500 bg-blue-600">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-200" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-white bg-blue-700 text-white placeholder-blue-200 border-blue-500"
            />
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-background">
          {/* Overview Dashboard */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <Button variant="outline" className="flex items-center">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Data
                </Button>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
                <Card className="border-l-4 border-l-blue-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white transform hover:scale-105 transition-transform duration-300">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analyticsData.totalUsers}</div>
                    <p className="text-xs text-green-600 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +12% from last month
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white transform hover:scale-105 transition-transform duration-300">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Doctors</CardTitle>
                    <Stethoscope className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analyticsData.totalDoctors}</div>
                    <p className="text-xs text-green-600 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +3 doctors this month
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-amber-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white transform hover:scale-105 transition-transform duration-300">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Appointments</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analyticsData.totalAppointments}</div>
                    <p className="text-xs text-green-600 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +8% from last week
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white transform hover:scale-105 transition-transform duration-300">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">₹{analyticsData.totalRevenue.toLocaleString()}</div>
                    <p className="text-xs text-green-600 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +5.2% from last month
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-cyan-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white transform hover:scale-105 transition-transform duration-300">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Reports Generated</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analyticsData.totalReports}</div>
                    <p className="text-xs text-green-600 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +15% from last month
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-indigo-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white transform hover:scale-105 transition-transform duration-300">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analyticsData.systemUptime}%</div>
                    <p className="text-xs text-green-600 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +0.2% from last week
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Charts and Analytics */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Appointments Chart */}
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-t-4 border-t-blue-500 transform hover:scale-105 transition-transform duration-300">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>Appointments Trend</span>
                      <Button variant="outline" size="sm" className="border-blue-300 text-blue-700 hover:bg-blue-50">
                        <Filter className="h-4 w-4 mr-1" />
                        Filter
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <EnhancedBarChart data={chartData.appointments} dataKey="count" color="bg-blue-600" title="Monthly Appointments" />
                  </CardContent>
                </Card>

                {/* Revenue Chart */}
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-t-4 border-t-green-500 transform hover:scale-105 transition-transform duration-300">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>Revenue Trend</span>
                      <Button variant="outline" size="sm" className="border-green-300 text-green-700 hover:bg-green-50">
                        <Download className="h-4 w-4 mr-1" />
                        Export
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <EnhancedBarChart data={chartData.revenue} dataKey="amount" color="bg-green-600" title="Monthly Revenue" />
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <UserPlus className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium">New user registered</p>
                        <p className="text-sm text-gray-500">Dr. Anjali Verma registered 2 minutes ago</p>
                      </div>
                      <div className="ml-auto text-sm text-gray-500">2m ago</div>
                    </div>
                    <div className="flex items-center">
                      <div className="bg-green-100 p-2 rounded-full">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium">Appointment confirmed</p>
                        <p className="text-sm text-gray-500">Rajesh Kumar's appointment with Dr. Malhotra confirmed</p>
                      </div>
                      <div className="ml-auto text-sm text-gray-500">10m ago</div>
                    </div>
                    <div className="flex items-center">
                      <div className="bg-red-100 p-2 rounded-full">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium">Appointment canceled</p>
                        <p className="text-sm text-gray-500">Priya Sharma canceled her appointment</p>
                      </div>
                      <div className="ml-auto text-sm text-gray-500">15m ago</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* User Management Dashboard */}
          {activeTab === "users" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                <Button variant="outline" className="flex items-center">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Data
                </Button>
              </div>

              {/* User List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="border-l-4 border-l-blue-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Rajesh Kumar</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-gray-500">rajesh.kumar@example.com</div>
                    <div className="text-sm text-gray-500">Patient</div>
                    <div className="flex items-center space-x-2 mt-2">
                      <Button variant="outline" size="sm" className="border-blue-300 text-blue-700 hover:bg-blue-50">
                        <Edit3 className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="border-red-300 text-red-700 hover:bg-red-50">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Priya Sharma</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-gray-500">priya.sharma@example.com</div>
                    <div className="text-sm text-gray-500">Doctor</div>
                    <div className="flex items-center space-x-2 mt-2">
                      <Button variant="outline" size="sm" className="border-blue-300 text-blue-700 hover:bg-blue-50">
                        <Edit3 className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="border-red-300 text-red-700 hover:bg-red-50">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-amber-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Amit Patel</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-gray-500">amit.patel@example.com</div>
                    <div className="text-sm text-gray-500">Patient</div>
                    <div className="flex items-center space-x-2 mt-2">
                      <Button variant="outline" size="sm" className="border-blue-300 text-blue-700 hover:bg-blue-50">
                        <Edit3 className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="border-red-300 text-red-700 hover:bg-red-50">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Sneha Reddy</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-gray-500">sneha.reddy@example.com</div>
                    <div className="text-sm text-gray-500">Reception</div>
                    <div className="flex items-center space-x-2 mt-2">
                      <Button variant="outline" size="sm" className="border-blue-300 text-blue-700 hover:bg-blue-50">
                        <Edit3 className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="border-red-300 text-red-700 hover:bg-red-50">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-cyan-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Vikram Singh</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-gray-500">vikram.singh@example.com</div>
                    <div className="text-sm text-gray-500">Patient</div>
                    <div className="flex items-center space-x-2 mt-2">
                      <Button variant="outline" size="sm" className="border-blue-300 text-blue-700 hover:bg-blue-50">
                        <Edit3 className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="border-red-300 text-red-700 hover:bg-red-50">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Staff Management Dashboard */}
          {activeTab === "staff" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Staff Management</h1>
                <Button variant="outline" className="flex items-center">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Data
                </Button>
              </div>

              {/* Staff List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="border-l-4 border-l-blue-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Dr. Anjali Verma</CardTitle>
                    <Stethoscope className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-gray-500">anjali.verma@example.com</div>
                    <div className="text-sm text-gray-500">Cardiologist</div>
                    <div className="text-sm text-gray-500">Department: Cardiology</div>
                    <div className="flex items-center space-x-2 mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-blue-300 text-blue-700 hover:bg-blue-50"
                        onClick={() => handleEditStaff({
                          name: "Dr. Anjali Verma",
                          email: "anjali.verma@example.com",
                          specialization: "Cardiologist",
                          department: "Cardiology"
                        })}
                      >
                        <Edit3 className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="border-red-300 text-red-700 hover:bg-red-50">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Dr. Rajiv Malhotra</CardTitle>
                    <Stethoscope className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-gray-500">rajiv.malhotra@example.com</div>
                    <div className="text-sm text-gray-500">Neurologist</div>
                    <div className="text-sm text-gray-500">Department: Neurology</div>
                    <div className="flex items-center space-x-2 mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-blue-300 text-blue-700 hover:bg-blue-50"
                        onClick={() => handleEditStaff({
                          name: "Dr. Rajiv Malhotra",
                          email: "rajiv.malhotra@example.com",
                          specialization: "Neurologist",
                          department: "Neurology"
                        })}
                      >
                        <Edit3 className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="border-red-300 text-red-700 hover:bg-red-50">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-amber-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Dr. Nalini Iyer</CardTitle>
                    <Stethoscope className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-gray-500">nalini.iyer@example.com</div>
                    <div className="text-sm text-gray-500">Pediatrician</div>
                    <div className="text-sm text-gray-500">Department: Pediatrics</div>
                    <div className="flex items-center space-x-2 mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-blue-300 text-blue-700 hover:bg-blue-50"
                        onClick={() => handleEditStaff({
                          name: "Dr. Nalini Iyer",
                          email: "nalini.iyer@example.com",
                          specialization: "Pediatrician",
                          department: "Pediatrics"
                        })}
                      >
                        <Edit3 className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="border-red-300 text-red-700 hover:bg-red-50">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Dr. Arjun Nair</CardTitle>
                    <Stethoscope className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-gray-500">arjun.nair@example.com</div>
                    <div className="text-sm text-gray-500">Orthopedic Surgeon</div>
                    <div className="text-sm text-gray-500">Department: Orthopedics</div>
                    <div className="flex items-center space-x-2 mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-blue-300 text-blue-700 hover:bg-blue-50"
                        onClick={() => handleEditStaff({
                          name: "Dr. Arjun Nair",
                          email: "arjun.nair@example.com",
                          specialization: "Orthopedic Surgeon",
                          department: "Orthopedics"
                        })}
                      >
                        <Edit3 className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="border-red-300 text-red-700 hover:bg-red-50">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-cyan-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Nurse Kavita Desai</CardTitle>
                    <Stethoscope className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-gray-500">kavita.desai@example.com</div>
                    <div className="text-sm text-gray-500">Registered Nurse</div>
                    <div className="text-sm text-gray-500">Department: Emergency</div>
                    <div className="flex items-center space-x-2 mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-blue-300 text-blue-700 hover:bg-blue-50"
                        onClick={() => handleEditStaff({
                          name: "Nurse Kavita Desai",
                          email: "kavita.desai@example.com",
                          specialization: "Registered Nurse",
                          department: "Emergency"
                        })}
                      >
                        <Edit3 className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="border-red-300 text-red-700 hover:bg-red-50">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-pink-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Lab Technician Ramesh</CardTitle>
                    <Stethoscope className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-gray-500">ramesh.lab@example.com</div>
                    <div className="text-sm text-gray-500">Lab Technician</div>
                    <div className="text-sm text-gray-500">Department: Laboratory</div>
                    <div className="flex items-center space-x-2 mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-blue-300 text-blue-700 hover:bg-blue-50"
                        onClick={() => handleEditStaff({
                          name: "Lab Technician Ramesh",
                          email: "ramesh.lab@example.com",
                          specialization: "Lab Technician",
                          department: "Laboratory"
                        })}
                      >
                        <Edit3 className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="border-red-300 text-red-700 hover:bg-red-50">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Queue Management Dashboard */}
          {activeTab === "queue" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Queue Management</h1>
                <Button variant="outline" className="flex items-center">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Data
                </Button>
              </div>

              {/* Queue Analytics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Patients Waiting */}
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-l-yellow-500 transform hover:scale-105 transition-transform duration-300">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>Patients Waiting</span>
                      <Users className="h-5 w-5 text-yellow-500" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-gray-900">{queueData.waiting}</div>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="h-4 w-4 text-red-500 mr-1" />
                      <span className="text-sm text-red-600">+2 from last hour</span>
                    </div>
                  </CardContent>
                </Card>

                {/* In Progress */}
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-l-blue-500 transform hover:scale-105 transition-transform duration-300">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>In Progress</span>
                      <Activity className="h-5 w-5 text-blue-500" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-gray-900">{queueData.inProgress}</div>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-600">+1 from last hour</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Average Wait Time */}
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-l-amber-500 transform hover:scale-105 transition-transform duration-300">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>Avg Wait Time</span>
                      <Clock className="h-5 w-5 text-amber-500" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-gray-900">{queueData.averageWaitTime} min</div>
                    <div className="flex items-center mt-2">
                      <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-600">-3 min from avg</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Doctors Available */}
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-l-green-500 transform hover:scale-105 transition-transform duration-300">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>Doctors Available</span>
                      <Stethoscope className="h-5 w-5 text-green-500" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-gray-900">{queueData.doctorsAvailable}</div>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-600">+1 from last hour</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Queue Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Wait Time Trend */}
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-t-4 border-t-blue-500">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>Wait Time Trend</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <EnhancedBarChart
                      data={queueChartData.waitTimes}
                      dataKey="waitTime"
                      color="bg-blue-600"
                      title=""
                      onBarClick={(item) => alert(`Clicked on ${item.hour}: ${item.waitTime} minutes`)}
                    />
                  </CardContent>
                </Card>

                {/* Queue Status Distribution */}
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-t-4 border-t-purple-500">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>Queue Status Distribution</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col md:flex-row items-center justify-between">
                      <PieChartComponent
                        data={queueChartData.queueStatus}
                        title=""
                      />
                      <div className="mt-4 md:mt-0 md:ml-6 w-full md:w-1/2">
                        <div className="space-y-3">
                          {queueChartData.queueStatus.map((status, index) => (
                            <div key={index}>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="font-medium text-gray-700">{status.name}</span>
                                <span className="font-bold text-gray-900">{status.value}</span>
                              </div>
                              <ProgressBar value={status.value} max={50} color={status.color} />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Doctor Load Chart */}
              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-t-4 border-t-amber-500">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>Doctor Workload</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <EnhancedBarChart
                    data={queueChartData.doctorLoad}
                    dataKey="patients"
                    color="bg-amber-600"
                    title=""
                    onBarClick={(item) => alert(`Clicked on ${item.doctor}: ${item.patients} patients`)}
                  />
                </CardContent>
              </Card>

              {/* Queue List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="border-l-4 border-l-blue-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Rajesh Kumar</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-gray-500">Assigned to: Dr. Anjali Verma</div>
                    <div className="text-sm text-gray-500">Status: Waiting</div>
                    <div className="text-sm text-gray-500">Estimated wait time: 15 minutes</div>
                    <div className="flex items-center space-x-2 mt-2">
                      <Button variant="outline" size="sm" className="border-blue-300 text-blue-700 hover:bg-blue-50">
                        <Edit3 className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="border-red-300 text-red-700 hover:bg-red-50">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Priya Sharma</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-gray-500">Assigned to: Dr. Rajiv Malhotra</div>
                    <div className="text-sm text-gray-500">Status: Waiting</div>
                    <div className="text-sm text-gray-500">Estimated wait time: 10 minutes</div>
                    <div className="flex items-center space-x-2 mt-2">
                      <Button variant="outline" size="sm" className="border-blue-300 text-blue-700 hover:bg-blue-50">
                        <Edit3 className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="border-red-300 text-red-700 hover:bg-red-50">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-amber-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Amit Patel</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-gray-500">Assigned to: Dr. Nalini Iyer</div>
                    <div className="text-sm text-gray-500">Status: In Progress</div>
                    <div className="text-sm text-gray-500">Estimated wait time: 5 minutes</div>
                    <div className="flex items-center space-x-2 mt-2">
                      <Button variant="outline" size="sm" className="border-blue-300 text-blue-700 hover:bg-blue-50">
                        <Edit3 className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="border-red-300 text-red-700 hover:bg-red-50">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Sneha Reddy</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-gray-500">Assigned to: Dr. Arjun Nair</div>
                    <div className="text-sm text-gray-500">Status: Waiting</div>
                    <div className="text-sm text-gray-500">Estimated wait time: 20 minutes</div>
                    <div className="flex items-center space-x-2 mt-2">
                      <Button variant="outline" size="sm" className="border-blue-300 text-blue-700 hover:bg-blue-50">
                        <Edit3 className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="border-red-300 text-red-700 hover:bg-red-50">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-cyan-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Vikram Singh</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-gray-500">Assigned to: Nurse Kavita Desai</div>
                    <div className="text-sm text-gray-500">Status: Waiting</div>
                    <div className="text-sm text-gray-500">Estimated wait time: 8 minutes</div>
                    <div className="flex items-center space-x-2 mt-2">
                      <Button variant="outline" size="sm" className="border-blue-300 text-blue-700 hover:bg-blue-50">
                        <Edit3 className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="border-red-300 text-red-700 hover:bg-red-50">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Payments Management Dashboard */}
          {activeTab === "payments" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Payments Management</h1>
                <Button variant="outline" className="flex items-center">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Data
                </Button>
              </div>

              {/* Payment Analytics Charts */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Revenue Card */}
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-l-blue-500 transform hover:scale-105 transition-transform duration-300">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>Total Revenue</span>
                      <DollarSign className="h-5 w-5 text-blue-500" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-gray-900">₹8,500</div>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-600">+12% from last month</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Payments Status Distribution */}
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-l-green-500 transform hover:scale-105 transition-transform duration-300 md:col-span-2 lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>Payment Status Distribution</span>
                      <PieChart className="h-5 w-5 text-green-500" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col md:flex-row items-center justify-between">
                      <PieChartComponent
                        data={[{ name: "Paid", value: 5800, color: "bg-green-500" }, { name: "Pending", value: 2700, color: "bg-yellow-500" }]}
                        title=""
                      />
                      <div className="mt-4 md:mt-0 md:ml-6">
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="font-medium text-gray-700">Paid</span>
                              <span className="font-bold text-gray-900">₹5,800</span>
                            </div>
                            <ProgressBar value={5800} max={8500} color="bg-green-500" />
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="font-medium text-gray-700">Pending</span>
                              <span className="font-bold text-gray-900">₹2,700</span>
                            </div>
                            <ProgressBar value={2700} max={8500} color="bg-yellow-500" />
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium text-gray-700">Total</span>
                            <span className="font-bold text-gray-900">₹8,500</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Revenue by Doctor */}
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-l-purple-500 transform hover:scale-105 transition-transform duration-300">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>Top Doctor</span>
                      <Stethoscope className="h-5 w-5 text-purple-500" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900 mb-1">Dr. Nalini Iyer</div>
                    <div className="text-lg font-semibold text-purple-600 mb-2">₹2,000</div>
                    <div className="flex items-center text-sm text-gray-500">
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                      <span>+15% from last month</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Payments by Doctor */}
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-t-4 border-t-green-500">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>Revenue by Doctor</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <EnhancedBarChart
                      data={[{ doctor: "Dr. Anjali Verma", amount: 1000 }, { doctor: "Dr. Rajiv Malhotra", amount: 1500 }, { doctor: "Dr. Nalini Iyer", amount: 2000 }, { doctor: "Dr. Arjun Nair", amount: 1200 }, { doctor: "Nurse Kavita", amount: 800 }]}
                      dataKey="amount"
                      color="bg-green-600"
                      title=""
                      onBarClick={(item) => alert(`Clicked on ${item.doctor}: ₹${item.amount}`)}
                    />
                  </CardContent>
                </Card>

                {/* Monthly Trend */}
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-t-4 border-t-purple-500">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>Monthly Revenue Trend</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <EnhancedBarChart
                      data={[{ month: "Jan", amount: 12000 }, { month: "Feb", amount: 15000 }, { month: "Mar", amount: 18000 }, { month: "Apr", amount: 14000 }, { month: "May", amount: 16000 }, { month: "Jun", amount: 17500 }]}
                      dataKey="amount"
                      color="bg-purple-600"
                      title=""
                      onBarClick={(item) => alert(`Clicked on ${item.month}: ₹${item.amount}`)}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Payments List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="border-l-4 border-l-blue-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Rajesh Kumar</CardTitle>
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-gray-500">Patient: Rajesh Kumar</div>
                    <div className="text-sm text-gray-500">Doctor: Dr. Anjali Verma</div>
                    <div className="text-sm text-gray-500">Amount: ₹1000</div>
                    <div className="text-sm text-gray-500">Status: Paid</div>
                    <div className="flex items-center space-x-2 mt-2">
                      <Button variant="outline" size="sm" className="border-blue-300 text-blue-700 hover:bg-blue-50">
                        <Edit3 className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="border-red-300 text-red-700 hover:bg-red-50">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Priya Sharma</CardTitle>
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-gray-500">Patient: Priya Sharma</div>
                    <div className="text-sm text-gray-500">Doctor: Dr. Rajiv Malhotra</div>
                    <div className="text-sm text-gray-500">Amount: ₹1500</div>
                    <div className="text-sm text-gray-500">Status: Pending</div>
                    <div className="flex items-center space-x-2 mt-2">
                      <Button variant="outline" size="sm" className="border-blue-300 text-blue-700 hover:bg-blue-50">
                        <Edit3 className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="border-red-300 text-red-700 hover:bg-red-50">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-amber-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Amit Patel</CardTitle>
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-gray-500">Patient: Amit Patel</div>
                    <div className="text-sm text-gray-500">Doctor: Dr. Nalini Iyer</div>
                    <div className="text-sm text-gray-500">Amount: ₹2000</div>
                    <div className="text-sm text-gray-500">Status: Paid</div>
                    <div className="flex items-center space-x-2 mt-2">
                      <Button variant="outline" size="sm" className="border-blue-300 text-blue-700 hover:bg-blue-50">
                        <Edit3 className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="border-red-300 text-red-700 hover:bg-red-50">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Sneha Reddy</CardTitle>
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-gray-500">Patient: Sneha Reddy</div>
                    <div className="text-sm text-gray-500">Doctor: Dr. Arjun Nair</div>
                    <div className="text-sm text-gray-500">Amount: ₹1200</div>
                    <div className="text-sm text-gray-500">Status: Paid</div>
                    <div className="flex items-center space-x-2 mt-2">
                      <Button variant="outline" size="sm" className="border-blue-300 text-blue-700 hover:bg-blue-50">
                        <Edit3 className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="border-red-300 text-red-700 hover:bg-red-50">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-cyan-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Vikram Singh</CardTitle>
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-gray-500">Patient: Vikram Singh</div>
                    <div className="text-sm text-gray-500">Doctor: Nurse Kavita Desai</div>
                    <div className="text-sm text-gray-500">Amount: ₹800</div>
                    <div className="text-sm text-gray-500">Status: Paid</div>
                    <div className="flex items-center space-x-2 mt-2">
                      <Button variant="outline" size="sm" className="border-blue-300 text-blue-700 hover:bg-blue-50">
                        <Edit3 className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="border-red-300 text-red-700 hover:bg-red-50">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Inventory Management Dashboard */}
          {activeTab === "inventory" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
                <Button variant="outline" className="flex items-center">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Data
                </Button>
              </div>

              {/* Inventory Analytics Charts */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Inventory Value */}
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-l-blue-500 transform hover:scale-105 transition-transform duration-300">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>Total Inventory Value</span>
                      <DollarSign className="h-5 w-5 text-blue-500" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-gray-900">₹12,000</div>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-600">+10% from last month</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Inventory Status Distribution */}
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-l-green-500 transform hover:scale-105 transition-transform duration-300 md:col-span-2 lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>Inventory Status Distribution</span>
                      <PieChart className="h-5 w-5 text-green-500" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col md:flex-row items-center justify-between">
                      <PieChartComponent
                        data={[{ name: "In Stock", value: 8000, color: "bg-green-500" }, { name: "Out of Stock", value: 4000, color: "bg-red-500" }]}
                        title=""
                      />
                      <div className="mt-4 md:mt-0 md:ml-6">
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="font-medium text-gray-700">In Stock</span>
                              <span className="font-bold text-gray-900">₹8,000</span>
                            </div>
                            <ProgressBar value={8000} max={12000} color="bg-green-500" />
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="font-medium text-gray-700">Out of Stock</span>
                              <span className="font-bold text-gray-900">₹4,000</span>
                            </div>
                            <ProgressBar value={4000} max={12000} color="bg-red-500" />
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium text-gray-700">Total</span>
                            <span className="font-bold text-gray-900">₹12,000</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Most Expensive Item */}
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-l-purple-500 transform hover:scale-105 transition-transform duration-300">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>Most Expensive Item</span>
                      <Package className="h-5 w-5 text-purple-500" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900 mb-1">Advanced MRI Machine</div>
                    <div className="text-lg font-semibold text-purple-600 mb-2">₹5,000</div>
                    <div className="flex items-center text-sm text-gray-500">
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                      <span>+20% from last month</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Inventory by Category */}
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-t-4 border-t-green-500">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>Inventory by Category</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <EnhancedBarChart
                      data={[{ category: "Medicines", amount: 3000 }, { category: "Equipment", amount: 4000 }, { category: "Supplies", amount: 5000 }]}
                      dataKey="amount"
                      color="bg-green-600"
                      title=""
                      onBarClick={(item) => alert(`Clicked on ${item.category}: ₹${item.amount}`)}
                    />
                  </CardContent>
                </Card>

                {/* Monthly Trend */}
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-t-4 border-t-purple-500">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>Monthly Inventory Trend</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <EnhancedBarChart
                      data={[{ month: "Jan", amount: 10000 }, { month: "Feb", amount: 12000 }, { month: "Mar", amount: 14000 }, { month: "Apr", amount: 13000 }, { month: "May", amount: 15000 }, { month: "Jun", amount: 16000 }]}
                      dataKey="amount"
                      color="bg-purple-600"
                      title=""
                      onBarClick={(item) => alert(`Clicked on ${item.month}: ₹${item.amount}`)}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Inventory List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="border-l-4 border-l-blue-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Paracetamol</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-gray-500">Category: Medicines</div>
                    <div className="text-sm text-gray-500">Quantity: 100</div>
                    <div className="text-sm text-gray-500">Price: ₹10</div>
                    <div className="text-sm text-gray-500">Status: In Stock</div>
                    <div className="flex items-center space-x-2 mt-2">
                      <Button variant="outline" size="sm" className="border-blue-300 text-blue-700 hover:bg-blue-50">
                        <Edit3 className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="border-red-300 text-red-700 hover:bg-red-50">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Stethoscope</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-gray-500">Category: Equipment</div>
                    <div className="text-sm text-gray-500">Quantity: 50</div>
                    <div className="text-sm text-gray-500">Price: ₹200</div>
                    <div className="text-sm text-gray-500">Status: In Stock</div>
                    <div className="flex items-center space-x-2 mt-2">
                      <Button variant="outline" size="sm" className="border-blue-300 text-blue-700 hover:bg-blue-50">
                        <Edit3 className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="border-red-300 text-red-700 hover:bg-red-50">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-amber-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Gloves</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-gray-500">Category: Supplies</div>
                    <div className="text-sm text-gray-500">Quantity: 200</div>
                    <div className="text-sm text-gray-500">Price: ₹5</div>
                    <div className="text-sm text-gray-500">Status: In Stock</div>
                    <div className="flex items-center space-x-2 mt-2">
                      <Button variant="outline" size="sm" className="border-blue-300 text-blue-700 hover:bg-blue-50">
                        <Edit3 className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="border-red-300 text-red-700 hover:bg-red-50">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Bandages</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-gray-500">Category: Supplies</div>
                    <div className="text-sm text-gray-500">Quantity: 150</div>
                    <div className="text-sm text-gray-500">Price: ₹10</div>
                    <div className="text-sm text-gray-500">Status: In Stock</div>
                    <div className="flex items-center space-x-2 mt-2">
                      <Button variant="outline" size="sm" className="border-blue-300 text-blue-700 hover:bg-blue-50">
                        <Edit3 className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="border-red-300 text-red-700 hover:bg-red-50">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-cyan-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Syringes</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-gray-500">Category: Equipment</div>
                    <div className="text-sm text-gray-500">Quantity: 300</div>
                    <div className="text-sm text-gray-500">Price: ₹20</div>
                    <div className="text-sm text-gray-500">Status: In Stock</div>
                    <div className="flex items-center space-x-2 mt-2">
                      <Button variant="outline" size="sm" className="border-blue-300 text-blue-700 hover:bg-blue-50">
                        <Edit3 className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="border-red-300 text-red-700 hover:bg-red-50">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-amber-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Amit Patel</CardTitle>
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-gray-500">Patient: Amit Patel</div>
                    <div className="text-sm text-gray-500">Doctor: Dr. Nalini Iyer</div>
                    <div className="text-sm text-gray-500">Amount: ₹2000</div>
                    <div className="text-sm text-gray-500">Status: Paid</div>
                    <div className="flex items-center space-x-2 mt-2">
                      <Button variant="outline" size="sm" className="border-blue-300 text-blue-700 hover:bg-blue-50">
                        <Edit3 className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="border-red-300 text-red-700 hover:bg-red-50">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Sneha Reddy</CardTitle>
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-gray-500">Patient: Sneha Reddy</div>
                    <div className="text-sm text-gray-500">Doctor: Dr. Arjun Nair</div>
                    <div className="text-sm text-gray-500">Amount: ₹1200</div>
                    <div className="text-sm text-gray-500">Status: Pending</div>
                    <div className="flex items-center space-x-2 mt-2">
                      <Button variant="outline" size="sm" className="border-blue-300 text-blue-700 hover:bg-blue-50">
                        <Edit3 className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="border-red-300 text-red-700 hover:bg-red-50">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-cyan-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Vikram Singh</CardTitle>
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-gray-500">Patient: Vikram Singh</div>
                    <div className="text-sm text-gray-500">Doctor: Nurse Kavita Desai</div>
                    <div className="text-sm text-gray-500">Amount: ₹800</div>
                    <div className="text-sm text-gray-500">Status: Paid</div>
                    <div className="flex items-center space-x-2 mt-2">
                      <Button variant="outline" size="sm" className="border-blue-300 text-blue-700 hover:bg-blue-50">
                        <Edit3 className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="border-red-300 text-red-700 hover:bg-red-50">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Data Analytics Dashboard */}
          {activeTab === "analytics" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Data Analytics</h1>
                <Button variant="outline" className="flex items-center">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Data
                </Button>
              </div>

              {/* Analytics Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* User Growth Chart */}
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-l-amber-500 transform hover:scale-105 transition-transform duration-300">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>User Growth</span>
                      <Button variant="outline" size="sm" className="border-amber-300 text-amber-700 hover:bg-amber-50">
                        <Download className="h-4 w-4 mr-1" />
                        Export
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <EnhancedBarChart data={chartData.userGrowth} dataKey="users" color="bg-amber-600" title="Monthly User Growth" />
                  </CardContent>
                </Card>

                {/* Appointment Status Distribution */}
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-l-purple-500 transform hover:scale-105 transition-transform duration-300">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>Appointment Status</span>
                      <Button variant="outline" size="sm" className="border-purple-300 text-purple-700 hover:bg-purple-50">
                        <Filter className="h-4 w-4 mr-1" />
                        Filter
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <PieChartComponent
                      data={[{ name: "Completed", value: 85, color: "bg-green-500" }, { name: "Pending", value: 10, color: "bg-yellow-500" }, { name: "Canceled", value: 5, color: "bg-red-500" }]}
                      title="Appointment Distribution"
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Additional Analytics Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Trend */}
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-l-blue-500 transform hover:scale-105 transition-transform duration-300">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>Revenue Trend</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <EnhancedBarChart
                      data={chartData.revenue}
                      dataKey="amount"
                      color="bg-blue-600"
                      title="Monthly Revenue"
                    />
                  </CardContent>
                </Card>

                {/* Appointment Trend */}
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-l-green-500 transform hover:scale-105 transition-transform duration-300">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>Appointment Trend</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <EnhancedBarChart
                      data={chartData.appointments}
                      dataKey="count"
                      color="bg-green-600"
                      title="Monthly Appointments"
                    />
                  </CardContent>
                </Card>

                {/* Patient Satisfaction */}
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-l-cyan-500 transform hover:scale-105 transition-transform duration-300">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>Patient Satisfaction</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center justify-center h-full">
                      <div className="text-4xl font-bold text-cyan-600 mb-2">4.7</div>
                      <div className="text-sm text-gray-500 mb-4">Average Rating</div>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      <div className="mt-4 w-full">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium text-gray-700">Satisfaction Rate</span>
                          <span className="font-bold text-gray-900">94%</span>
                        </div>
                        <ProgressBar value={94} max={100} color="bg-cyan-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Health Insights Dashboard */}
          {activeTab === "insights" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Health Insights</h1>
                <Button variant="outline" className="flex items-center">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Data
                </Button>
              </div>

              {/* Insights Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-l-4 border-l-blue-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analyticsData.activeSessions}</div>
                    <p className="text-xs text-green-600 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +5% from last week
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analyticsData.pendingPayments}</div>
                    <p className="text-xs text-green-600 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +2 payments this month
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-amber-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Completed Appointments</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analyticsData.completedAppointments}</div>
                    <p className="text-xs text-green-600 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +10% from last week
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Canceled Appointments</CardTitle>
                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analyticsData.canceledAppointments}</div>
                    <p className="text-xs text-red-600 flex items-center">
                      <TrendingDown className="h-3 w-3 mr-1" />
                      -2% from last week
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-red-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Critical Patients</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analyticsData.criticalPatients}</div>
                    <p className="text-xs text-red-600 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +3 from last week
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-cyan-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Routine Checkups</CardTitle>
                    <Stethoscope className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analyticsData.routineCheckups}</div>
                    <p className="text-xs text-green-600 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +12% from last month
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-yellow-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Emergency Cases</CardTitle>
                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analyticsData.emergencyCases}</div>
                    <p className="text-xs text-red-600 flex items-center">
                      <TrendingDown className="h-3 w-3 mr-1" />
                      -1 from yesterday
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-indigo-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg. Recovery Time</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analyticsData.avgRecoveryTime} days</div>
                    <p className="text-xs text-green-600 flex items-center">
                      <TrendingDown className="h-3 w-3 mr-1" />
                      -0.5 days from avg
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Health Insights Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Patient Health Metrics */}
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-t-4 border-t-blue-500">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>Patient Health Metrics</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <EnhancedBarChart
                      data={[{ metric: "Blood Pressure", value: 120 }, { metric: "Heart Rate", value: 72 }, { metric: "Cholesterol", value: 180 }, { metric: "Glucose", value: 90 }, { metric: "BMI", value: 24 }]}
                      dataKey="value"
                      color="bg-blue-600"
                      title=""
                      onBarClick={(item) => alert(`Clicked on ${item.metric}: ${item.value}`)}
                    />
                  </CardContent>
                </Card>

                {/* Treatment Outcomes */}
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-t-4 border-t-green-500">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>Treatment Outcomes</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <PieChartComponent
                      data={[{ name: "Recovered", value: 75, color: "bg-green-500" }, { name: "In Treatment", value: 20, color: "bg-blue-500" }, { name: "Follow-up Required", value: 5, color: "bg-yellow-500" }]}
                      title=""
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Additional Health Insights Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Monthly Health Trends */}
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-l-amber-500 transform hover:scale-105 transition-transform duration-300">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>Monthly Health Trends</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <EnhancedBarChart
                      data={chartData.appointments}
                      dataKey="count"
                      color="bg-amber-600"
                      title="Patient Visits Trend"
                    />
                  </CardContent>
                </Card>

                {/* Department Performance */}
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-l-purple-500 transform hover:scale-105 transition-transform duration-300">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>Department Performance</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <EnhancedBarChart
                      data={[{ dept: "Cardiology", patients: 120 }, { dept: "Neurology", patients: 95 }, { dept: "Pediatrics", patients: 140 }, { dept: "Orthopedics", patients: 85 }, { dept: "Emergency", patients: 160 }]}
                      dataKey="patients"
                      color="bg-purple-600"
                      title="Patients by Department"
                    />
                  </CardContent>
                </Card>

                {/* Patient Satisfaction */}
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-l-cyan-500 transform hover:scale-105 transition-transform duration-300">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>Patient Satisfaction</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center justify-center h-full">
                      <div className="text-4xl font-bold text-cyan-600 mb-2">{analyticsData.avgRating}</div>
                      <div className="text-sm text-gray-500 mb-4">Average Rating</div>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${i < Math.floor(analyticsData.avgRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      <div className="mt-4 w-full">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium text-gray-700">Satisfaction Rate</span>
                          <span className="font-bold text-gray-900">94%</span>
                        </div>
                        <ProgressBar value={94} max={100} color="bg-cyan-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Critical Patient Monitoring */}
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-l-red-500 transform hover:scale-105 transition-transform duration-300">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>Critical Patient Monitoring</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <EnhancedBarChart
                      data={[{ condition: "Heart Disease", count: 8 }, { condition: "Diabetes", count: 5 }, { condition: "Respiratory", count: 3 }, { condition: "Neurological", count: 2 }]}
                      dataKey="count"
                      color="bg-red-600"
                      title="Critical Conditions"
                    />
                  </CardContent>
                </Card>

                {/* Treatment Effectiveness */}
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-l-green-500 transform hover:scale-105 transition-transform duration-300">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>Treatment Effectiveness</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <PieChartComponent
                      data={[{ name: "Highly Effective", value: 65, color: "bg-green-500" }, { name: "Moderately Effective", value: 25, color: "bg-blue-500" }, { name: "Needs Improvement", value: 10, color: "bg-yellow-500" }]}
                      title="Treatment Outcomes"
                    />
                  </CardContent>
                </Card>

                {/* Recovery Time Analysis */}
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-l-indigo-500 transform hover:scale-105 transition-transform duration-300">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>Recovery Time Analysis</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <EnhancedBarChart
                      data={[{ treatment: "Surgery A", days: 7.2 }, { treatment: "Surgery B", days: 5.8 }, { treatment: "Therapy C", days: 12.4 }, { treatment: "Procedure D", days: 3.5 }]}
                      dataKey="days"
                      color="bg-indigo-600"
                      title="Avg. Recovery Days by Treatment"
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Chat System Dashboard */}
          {activeTab === "chat" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Chat System</h1>
                <Button variant="outline" className="flex items-center">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Data
                </Button>
              </div>

              {/* Chat Container */}
              <div className="flex flex-col h-[calc(100vh-200px)] bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Chat Header */}
                <div className="bg-blue-600 text-white p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-600 font-bold">
                        T
                      </div>
                      <div>
                        <h3 className="font-semibold">Team Chat</h3>
                        <p className="text-blue-200 text-sm">5 members online</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="icon" className="text-white hover:bg-blue-700">
                        <Phone className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-white hover:bg-blue-700">
                        <Video className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-white hover:bg-blue-700">
                        <MoreVertical className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                  <div className="space-y-4">
                    {chatMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs md:max-w-md lg:max-w-lg rounded-lg p-3 ${msg.isOwn ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none shadow'}`}
                        >
                          {!msg.isOwn && (
                            <div className="flex items-center space-x-2 mb-1">
                              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                {msg.avatar}
                              </div>
                              <span className="font-semibold text-sm">{msg.sender}</span>
                            </div>
                          )}
                          <p className="text-sm">{msg.message}</p>
                          <p className={`text-xs mt-1 ${msg.isOwn ? 'text-blue-200' : 'text-gray-500'}`}>
                            {msg.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Chat Input */}
                <div className="border-t border-gray-200 p-4 bg-white">
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700">
                      <Paperclip className="h-5 w-5" />
                    </Button>
                    <div className="flex-1 relative">
                      <textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type a message..."
                        className="w-full border border-gray-300 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        rows={1}
                      />
                    </div>
                    <Button
                      onClick={handleSendMessage}
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2"
                      disabled={!newMessage.trim()}
                    >
                      <Send className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Online Users */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-1">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="h-5 w-5 mr-2" />
                      Online Users
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { name: "Dr. Anjali Verma", role: "Cardiologist", status: "online" },
                        { name: "Dr. Rajiv Malhotra", role: "Neurologist", status: "online" },
                        { name: "Dr. Nalini Iyer", role: "Pediatrician", status: "online" },
                        { name: "Dr. Arjun Nair", role: "Orthopedic", status: "away" },
                        { name: "Nurse Kavita Desai", role: "Nurse", status: "online" }
                      ].map((user, index) => (
                        <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                          <div className="flex items-center space-x-3">
                            <div className="relative">
                              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                                {user.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${user.status === 'online' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                            </div>
                            <div>
                              <p className="font-medium text-sm">{user.name}</p>
                              <p className="text-xs text-gray-500">{user.role}</p>
                            </div>
                          </div>
                          <Badge
                            variant="outline"
                            className={`text-xs ${user.status === 'online' ? 'bg-green-100 text-green-800 border-green-300' : 'bg-yellow-100 text-yellow-800 border-yellow-300'}`}
                          >
                            {user.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Conversations */}
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MessageSquare className="h-5 w-5 mr-2" />
                      Recent Conversations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { name: "Dr. Anjali Verma", message: "Good morning team!", time: "9:00 AM", unread: 0 },
                        { name: "Nurse Kavita", message: "Ready for today's appointments.", time: "9:02 AM", unread: 0 },
                        { name: "Dr. Rajiv Malhotra", message: "I need to reschedule my 11 AM appointment.", time: "9:15 AM", unread: 1 },
                        { name: "Lab Technician Ramesh", message: "Blood test results are ready.", time: "8:45 AM", unread: 3 }
                      ].map((conv, index) => (
                        <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                              {conv.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <p className="font-medium text-sm">{conv.name}</p>
                              <p className="text-xs text-gray-500 truncate max-w-xs">{conv.message}</p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="text-xs text-gray-500">{conv.time}</span>
                            {conv.unread > 0 && (
                              <Badge className="bg-blue-600 text-white text-xs mt-1">
                                {conv.unread}
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Reports Dashboard */}
          {activeTab === "reports" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
                <div className="flex space-x-2">
                  <Button variant="outline" className="flex items-center">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh Data
                  </Button>
                  <Button className="flex items-center bg-blue-600 hover:bg-blue-700 text-white">
                    <Download className="h-4 w-4 mr-2" />
                    Export Reports
                  </Button>
                </div>
              </div>

              {/* Report Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-l-4 border-l-blue-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Reports Generated</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">1,248</div>
                    <p className="text-xs text-green-600 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +15% from last month
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Patient Reports</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">865</div>
                    <p className="text-xs text-green-600 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +8% from last week
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-amber-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Financial Reports</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">212</div>
                    <p className="text-xs text-green-600 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +12% from last month
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Operational Reports</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">171</div>
                    <p className="text-xs text-red-600 flex items-center">
                      <TrendingDown className="h-3 w-3 mr-1" />
                      -3% from last quarter
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Report Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Reports by Category */}
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-t-4 border-t-blue-500">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>Reports by Category</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <PieChartComponent
                      data={[{ name: "Patient Reports", value: 865, color: "bg-blue-500" }, { name: "Financial Reports", value: 212, color: "bg-green-500" }, { name: "Operational Reports", value: 171, color: "bg-amber-500" }]}
                      title=""
                    />
                  </CardContent>
                </Card>

                {/* Monthly Report Generation Trend */}
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-t-4 border-t-green-500">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>Monthly Report Generation</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <EnhancedBarChart
                      data={[{ month: "Jan", count: 95 }, { month: "Feb", count: 102 }, { month: "Mar", count: 115 }, { month: "Apr", count: 98 }, { month: "May", count: 108 }, { month: "Jun", count: 125 }]}
                      dataKey="count"
                      color="bg-green-600"
                      title=""
                      onBarClick={(item) => alert(`Clicked on ${item.month}: ${item.count} reports`)}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Report Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Patient Report Types */}
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-l-blue-500 transform hover:scale-105 transition-transform duration-300">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>Patient Report Types</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <EnhancedBarChart
                      data={[{ type: "Diagnosis", count: 320 }, { type: "Treatment", count: 280 }, { type: "Lab Results", count: 190 }, { type: "Prescription", count: 150 }, { type: "Follow-up", count: 125 }]}
                      dataKey="count"
                      color="bg-blue-600"
                      title=""
                    />
                  </CardContent>
                </Card>

                {/* Financial Report Distribution */}
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-l-green-500 transform hover:scale-105 transition-transform duration-300">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>Financial Report Distribution</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <PieChartComponent
                      data={[{ name: "Revenue", value: 85, color: "bg-green-500" }, { name: "Expenses", value: 65, color: "bg-red-500" }, { name: "Profit", value: 45, color: "bg-blue-500" }]}
                      title=""
                    />
                  </CardContent>
                </Card>

                {/* Report Generation by Department */}
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-l-purple-500 transform hover:scale-105 transition-transform duration-300">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>Reports by Department</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <EnhancedBarChart
                      data={[{ dept: "Cardiology", count: 120 }, { dept: "Neurology", count: 95 }, { dept: "Pediatrics", count: 140 }, { dept: "Orthopedics", count: 85 }, { dept: "Emergency", count: 160 }]}
                      dataKey="count"
                      color="bg-purple-600"
                      title=""
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Report List */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Recent Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report Name</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Generated</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">Monthly Patient Summary</div>
                            <div className="text-sm text-gray-500">Rajesh Kumar</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">Patient Report</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Jun 15, 2023</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Completed</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <Button variant="outline" size="sm" className="border-blue-300 text-blue-700 hover:bg-blue-50 mr-2">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button variant="outline" size="sm" className="border-green-300 text-green-700 hover:bg-green-50">
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </Button>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">Quarterly Financial Report</div>
                            <div className="text-sm text-gray-500">Hospital Administration</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">Financial Report</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Jun 10, 2023</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Completed</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <Button variant="outline" size="sm" className="border-blue-300 text-blue-700 hover:bg-blue-50 mr-2">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button variant="outline" size="sm" className="border-green-300 text-green-700 hover:bg-green-50">
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </Button>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">Daily Operations Summary</div>
                            <div className="text-sm text-gray-500">Operations Team</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">Operational Report</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Jun 5, 2023</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Processing</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <Button variant="outline" size="sm" className="border-blue-300 text-blue-700 hover:bg-blue-50 mr-2">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button variant="outline" size="sm" className="border-green-300 text-green-700 hover:bg-green-50">
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </Button>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">Patient Treatment Analysis</div>
                            <div className="text-sm text-gray-500">Dr. Anjali Verma</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">Patient Report</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Jun 1, 2023</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Completed</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <Button variant="outline" size="sm" className="border-blue-300 text-blue-700 hover:bg-blue-50 mr-2">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button variant="outline" size="sm" className="border-green-300 text-green-700 hover:bg-green-50">
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </Button>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">Inventory Usage Report</div>
                            <div className="text-sm text-gray-500">Pharmacy Department</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">Operational Report</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">May 28, 2023</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Completed</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <Button variant="outline" size="sm" className="border-blue-300 text-blue-700 hover:bg-blue-50 mr-2">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button variant="outline" size="sm" className="border-green-300 text-green-700 hover:bg-green-50">
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </Button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* System Settings Dashboard */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
                <Button className="flex items-center bg-blue-600 hover:bg-blue-700 text-white">
                  <Save className="h-4 w-4 mr-2" />
                  Save Settings
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* General Settings */}
                <Card className="lg:col-span-2 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Settings className="h-5 w-5 mr-2" />
                      General Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Hospital Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Hospital Name</label>
                            <input
                              type="text"
                              defaultValue="SevaMed Multi-Specialty Hospital"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                            <input
                              type="email"
                              defaultValue="info@sevamedhospital.com"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                            <input
                              type="text"
                              defaultValue="+91 98765 43210"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                            <input
                              type="text"
                              defaultValue="123 Healthcare Avenue, Medical District, Bangalore, Karnataka 560001"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">System Configuration</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Default Language</label>
                            <Select defaultValue="english">
                              <SelectTrigger>
                                <SelectValue placeholder="Select language" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="english">English</SelectItem>
                                <SelectItem value="hindi">Hindi</SelectItem>
                                <SelectItem value="telugu">Telugu</SelectItem>
                                <SelectItem value="tamil">Tamil</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
                            <Select defaultValue="ist">
                              <SelectTrigger>
                                <SelectValue placeholder="Select timezone" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="ist">India Standard Time (IST)</SelectItem>
                                <SelectItem value="utc">UTC</SelectItem>
                                <SelectItem value="est">Eastern Standard Time (EST)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                            <Select defaultValue="inr">
                              <SelectTrigger>
                                <SelectValue placeholder="Select currency" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="inr">Indian Rupee (₹)</SelectItem>
                                <SelectItem value="usd">US Dollar ($)</SelectItem>
                                <SelectItem value="eur">Euro (€)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date Format</label>
                            <Select defaultValue="dd-mm-yyyy">
                              <SelectTrigger>
                                <SelectValue placeholder="Select date format" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="dd-mm-yyyy">DD-MM-YYYY</SelectItem>
                                <SelectItem value="mm-dd-yyyy">MM-DD-YYYY</SelectItem>
                                <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Settings</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-900">Email Notifications</p>
                              <p className="text-sm text-gray-500">Send system alerts via email</p>
                            </div>
                            <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                              Enabled
                            </Button>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-900">SMS Notifications</p>
                              <p className="text-sm text-gray-500">Send alerts via SMS</p>
                            </div>
                            <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                              Enabled
                            </Button>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-900">Push Notifications</p>
                              <p className="text-sm text-gray-500">Send alerts via push notifications</p>
                            </div>
                            <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                              Enabled
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* System Status and Controls */}
                <div className="space-y-6">
                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Activity className="h-5 w-5 mr-2" />
                        System Status
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">Database Connection</p>
                          </div>
                          <Badge className="bg-green-100 text-green-800">Connected</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">Server Status</p>
                          </div>
                          <Badge className="bg-green-100 text-green-800">Online</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">API Services</p>
                          </div>
                          <Badge className="bg-green-100 text-green-800">Operational</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">Storage</p>
                            <p className="text-xs text-gray-500">85% of 500GB used</p>
                          </div>
                          <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <ProgressBar value={85} max={100} color="bg-blue-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Shield className="h-5 w-5 mr-2" />
                        Security
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">Two-Factor Authentication</p>
                          </div>
                          <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                            Enabled
                          </Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">Last Security Scan</p>
                            <p className="text-xs text-gray-500">2 hours ago</p>
                          </div>
                          <Badge className="bg-green-100 text-green-800">Clean</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">SSL Certificate</p>
                          </div>
                          <Badge className="bg-green-100 text-green-800">Valid</Badge>
                        </div>
                      </div>
                      <div className="mt-4">
                        <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50">
                          Run Security Scan
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <RefreshCw className="h-5 w-5 mr-2" />
                        System Maintenance
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Maintenance Window</label>
                          <Select defaultValue="night">
                            <SelectTrigger>
                              <SelectValue placeholder="Select maintenance window" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="night">Night (12AM - 4AM)</SelectItem>
                              <SelectItem value="weekend">Weekend</SelectItem>
                              <SelectItem value="custom">Custom</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">Auto Backup</p>
                          </div>
                          <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                            Enabled
                          </Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">System Updates</p>
                          </div>
                          <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                            Enabled
                          </Button>
                        </div>
                      </div>
                      <div className="mt-4 grid grid-cols-2 gap-2">
                        <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                          Backup Now
                        </Button>
                        <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                          Restart Services
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* User Management Settings */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    User Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Role Permissions</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm font-medium text-gray-700">Admin</span>
                          <Badge className="bg-blue-100 text-blue-800">Full Access</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm font-medium text-gray-700">Doctor</span>
                          <Badge className="bg-green-100 text-green-800">Limited Access</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm font-medium text-gray-700">Nurse</span>
                          <Badge className="bg-yellow-100 text-yellow-800">Restricted</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm font-medium text-gray-700">Reception</span>
                          <Badge className="bg-purple-100 text-purple-800">Basic Access</Badge>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Authentication</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Password Policy</label>
                          <Select defaultValue="standard">
                            <SelectTrigger>
                              <SelectValue placeholder="Select policy" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="standard">Standard</SelectItem>
                              <SelectItem value="strong">Strong</SelectItem>
                              <SelectItem value="enterprise">Enterprise</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">Session Timeout</p>
                            <p className="text-xs text-gray-500">Auto logout after inactivity</p>
                          </div>
                          <Select defaultValue="30">
                            <SelectTrigger className="w-24">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="15">15 min</SelectItem>
                              <SelectItem value="30">30 min</SelectItem>
                              <SelectItem value="60">60 min</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Audit Logs</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">Log Retention</p>
                          </div>
                          <Select defaultValue="90">
                            <SelectTrigger className="w-24">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="30">30 days</SelectItem>
                              <SelectItem value="90">90 days</SelectItem>
                              <SelectItem value="365">365 days</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">Export Logs</p>
                          </div>
                          <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                            <Download className="h-4 w-4 mr-1" />
                            Export
                          </Button>
                        </div>
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