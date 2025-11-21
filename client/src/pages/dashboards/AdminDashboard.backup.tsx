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
  BarChart
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
    avgRating: 4.7
  });

  // Mock data for charts
  const [chartData, setChartData] = useState({
    appointments: [
      { month: "Jan", count: 65 },
      { month: "Feb", count: 78 },
      { month: "Mar", count: 90 },
      { month: "Apr", count: 81 },
      { month: "May", count: 95 },
      { month: "Jun", count: 102 }
    ],
    revenue: [
      { month: "Jan", amount: 24000 },
      { month: "Feb", amount: 28000 },
      { month: "Mar", amount: 32000 },
      { month: "Apr", amount: 29000 },
      { month: "May", amount: 35000 },
      { month: "Jun", amount: 38000 }
    ],
    userGrowth: [
      { month: "Jan", users: 120 },
      { month: "Feb", users: 145 },
      { month: "Mar", users: 180 },
      { month: "Apr", users: 210 },
      { month: "May", users: 250 },
      { month: "Jun", users: 290 }
    ]
  });

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
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
  const EnhancedBarChart = ({ data, dataKey, color = "bg-blue-600", title }: { data: any[]; dataKey: string; color?: string; title?: string }) => {
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
              <div key={i} className="w-full border-t border-gray-100"></div>
            ))}
          </div>

          {/* Chart bars */}
          {data.map((item, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              <div className="text-xs text-gray-500 mb-1">{item[dataKey]}</div>
              <div
                className={`${color} rounded-t hover:opacity-75 transition-opacity w-full`}
                style={{ height: `${maxValue > 0 ? (item[dataKey] / maxValue) * 80 : 0}%` }}
              ></div>
              <div className="text-xs text-gray-500 mt-1">{item.month}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Pie Chart Component
  const PieChartComponent = () => {
    const data = [
      { name: "Completed", value: 85, color: "bg-green-500" },
      { name: "Pending", value: 10, color: "bg-yellow-500" },
      { name: "Canceled", value: 5, color: "bg-red-500" }
    ];

    let startAngle = 0;

    return (
      <div className="flex flex-col items-center">
        <div className="relative w-48 h-48">
          {data.map((item, index) => {
            const percentage = item.value;
            const angle = (percentage / 100) * 360;
            startAngle += angle;

            return (
              <div
                key={index}
                className={`absolute w-full h-full rounded-full ${item.color} opacity-70`}
                style={{
                  clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos((angle - 90) * Math.PI / 180)}% ${50 + 50 * Math.sin((angle - 90) * Math.PI / 180)}%)`
                }}
              ></div>
            );
          })}
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center">
              <div className={`w-3 h-3 rounded-full ${item.color} mr-2`}></div>
              <span className="text-xs">{item.name}: {item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50">
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-l-4 border-l-blue-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white">
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

                <Card className="border-l-4 border-l-green-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white">
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

                <Card className="border-l-4 border-l-amber-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white">
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

                <Card className="border-l-4 border-l-purple-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white">
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
              </div>

              {/* Charts and Analytics */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Appointments Chart */}
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-t-4 border-t-blue-500">
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
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-t-4 border-t-green-500">
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
                        <p className="text-sm text-gray-500">Dr. Sarah Johnson registered 2 minutes ago</p>
                      </div>
                      <div className="ml-auto text-sm text-gray-500">2m ago</div>
                    </div>
                    <div className="flex items-center">
                      <div className="bg-green-100 p-2 rounded-full">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium">Appointment confirmed</p>
                        <p className="text-sm text-gray-500">John Doe's appointment with Dr. Smith confirmed</p>
                      </div>
                      <div className="ml-auto text-sm text-gray-500">10m ago</div>
                    </div>
                    <div className="flex items-center">
                      <div className="bg-red-100 p-2 rounded-full">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium">Appointment canceled</p>
                        <p className="text-sm text-gray-500">Jane Doe canceled her appointment</p>
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
                    <CardTitle className="text-sm font-medium">John Doe</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-gray-500">john.doe@example.com</div>
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
                    <CardTitle className="text-sm font-medium">Jane Smith</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-gray-500">jane.smith@example.com</div>
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
                    <CardTitle className="text-sm font-medium">Dr. Sarah Johnson</CardTitle>
                    <Stethoscope className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-gray-500">sarah.johnson@example.com</div>
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

                <Card className="border-l-4 border-l-green-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Dr. Michael Brown</CardTitle>
                    <Stethoscope className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-gray-500">michael.brown@example.com</div>
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

              {/* Queue List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="border-l-4 border-l-blue-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">John Doe</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-gray-500">Waiting</div>
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
                    <CardTitle className="text-sm font-medium">Jane Smith</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-gray-500">Waiting</div>
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

              {/* Payments List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="border-l-4 border-l-blue-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">John Doe</CardTitle>
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-gray-500">₹1000</div>
                    <div className="text-sm text-gray-500">Paid</div>
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
                    <CardTitle className="text-sm font-medium">Jane Smith</CardTitle>
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-gray-500">₹1500</div>
                    <div className="text-sm text-gray-500">Pending</div>
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
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-t-4 border-t-amber-500">
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

                {/* Pie Chart */}
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-t-4 border-t-purple-500">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>Health Insights</span>
                      <Button variant="outline" size="sm" className="border-purple-300 text-purple-700 hover:bg-purple-50">
                        <Filter className="h-4 w-4 mr-1" />
                        Filter
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <PieChartComponent />
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
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}