import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import {
  Menu,
  X,
  Home,
  Users,
  Calendar,
  Clock,
  Activity,
  Settings,
  LogOut,
  User,
  Stethoscope,
  Heart,
  BookOpen,
  MessageSquare,
  BarChart3,
  CreditCard,
  FileText,
  ChevronDown,
  Edit,
  Key
} from "lucide-react";
import { cn } from "../../lib/utils";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  // Close sidebar when route changes
  useEffect(() => {
    setSidebarOpen(false);
  }, [location]);

  // Account dropdown state
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const accountDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (accountDropdownRef.current && !accountDropdownRef.current.contains(event.target as Node)) {
        setIsAccountDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleEditProfile = () => {
    // Navigate to edit profile page
    navigate("/profile/edit");
    setIsAccountDropdownOpen(false);
  };

  const handleChangePassword = () => {
    // Navigate to change password page
    navigate("/profile/change-password");
    setIsAccountDropdownOpen(false);
  };

  const handleSignOut = () => {
    logout();
    navigate("/login");
    setIsAccountDropdownOpen(false);
  };

  const getSidebarItems = () => {
    if (!user) return [];

    const baseItems = [
      { href: "/", icon: Home, label: t("dashboard"), active: location.pathname === "/" },
    ];

    if (user.role === "admin") {
      return [
        { href: "/admin/overview", icon: Home, label: t("dashboard"), active: location.pathname === "/admin/overview" },
        { href: "/admin/users", icon: Users, label: "Staff Management", active: location.pathname.includes("/users") },
        { href: "/admin/attendance", icon: Clock, label: t("attendance"), active: location.pathname.includes("/attendance") },
        { href: "/admin/system", icon: Activity, label: "System Overview", active: location.pathname.includes("/system") },
      ];
    } else if (user.role === "doctor") {
      return [
        { href: "/doctor/overview", icon: Home, label: t("dashboard"), active: location.pathname === "/doctor/overview" },
        { href: "/doctor/appointments", icon: Calendar, label: t("appointments"), active: location.pathname.includes("/appointments") },
        { href: "/doctor/queue", icon: Users, label: "Patient Queue", active: location.pathname.includes("/queue") },
        { href: "/doctor/patients", icon: FileText, label: "Patient Records", active: location.pathname.includes("/patients") },
        { href: "/doctor/resources", icon: BookOpen, label: "Patient Resources", active: location.pathname.includes("/resources") },
        { href: "/doctor/health-tips", icon: Heart, label: "Health Tips", active: location.pathname.includes("/health-tips") },
        { href: "/doctor/activity", icon: Activity, label: "Activity Log", active: location.pathname.includes("/activity") },
        { href: "/doctor/chat", icon: MessageSquare, label: "Internal Chat", active: location.pathname.includes("/chat") },
        { href: "/doctor/reports", icon: BarChart3, label: "Reports", active: location.pathname.includes("/reports") },
        { href: "/doctor/settings", icon: Settings, label: "System Settings", active: location.pathname.includes("/settings") },
      ];
    } else if (user.role === "reception") {
      return [
        ...baseItems,
        { href: "/reception/queue", icon: Users, label: "Queue Management", active: location.pathname.includes("/queue") },
        { href: "/reception/payments", icon: CreditCard, label: "Payments", active: location.pathname.includes("/payments") },
        { href: "/reception/attendance", icon: Clock, label: t("attendance"), active: location.pathname.includes("/attendance") },
      ];
    } else if (user.role === "patient") {
      return [
        ...baseItems,
        { href: "/patient/appointments", icon: Calendar, label: t("appointments"), active: location.pathname.includes("/appointments") },
        { href: "/patient/fitness", icon: Heart, label: t("fitness_tracker"), active: location.pathname.includes("/fitness") },
      ];
    }

    return baseItems;
  };

  const sidebarItems = getSidebarItems();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar trigger */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className="fixed top-4 left-4 z-50 rounded-full bg-blue-800 shadow-md lg:hidden"
            size="icon"
          >
            <Menu className="h-5 w-5 text-white" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0 bg-blue-800">
          <div className="flex h-full flex-col">
            <div className="flex h-16 items-center border-b border-blue-700 px-4">
              <h2 className="text-lg font-semibold text-white">SevaMed HMS</h2>
              <Button
                variant="ghost"
                size="icon"
                className="ml-auto text-white hover:bg-blue-700 lg:hidden"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <nav className="flex-1 space-y-1 p-2">
              {sidebarItems.map((item) => (
                <Button
                  key={item.href}
                  variant={item.active ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start text-white hover:text-white",
                    item.active ? "bg-blue-600 hover:bg-blue-600" : "hover:bg-blue-700"
                  )}
                  onClick={() => navigate(item.href)}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Button>
              ))}
            </nav>
            <div className="p-2 border-t border-blue-700">
              <Button
                variant="ghost"
                className="w-full justify-start text-white hover:bg-blue-700 hover:text-white"
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                {t("logout")}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex flex-col flex-1 bg-blue-800 border-r border-blue-700">
          <div className="flex items-center h-16 px-4 border-b border-blue-700">
            <h2 className="text-lg font-semibold text-white">SevaMed HMS</h2>
          </div>
          <nav className="flex-1 space-y-1 p-2">
            {sidebarItems.map((item) => (
              <Button
                key={item.href}
                variant={item.active ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start text-white hover:text-white",
                  item.active ? "bg-blue-600 hover:bg-blue-600" : "hover:bg-blue-700"
                )}
                onClick={() => navigate(item.href)}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            ))}
          </nav>
          <div className="p-2 border-t border-blue-700">
            <Button
              variant="ghost"
              className="w-full justify-start text-white hover:bg-blue-700 hover:text-white"
              onClick={() => {
                logout();
                navigate("/login");
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              {t("logout")}
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col lg:pl-64">
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between h-16 px-4">
            <div className="flex items-center">
              <h1 className="text-lg sm:text-xl font-semibold truncate">
                {user?.role === "doctor" ? (
                  <>
                    <span className="hidden sm:inline">Doctor Dashboard - Welcome, Dr. {user.name}</span>
                    <span className="sm:hidden">Dr. {user.name}</span>
                  </>
                ) : (
                  user?.role && t(`${user.role}_dashboard`)
                )}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              {user && (
                <div className="flex items-center space-x-2 relative" ref={accountDropdownRef}>
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div className="text-right hidden sm:block">
                    <span className="text-sm font-medium block">{user.name}</span>
                    {user.role === "doctor" && user.specialization && (
                      <span className="text-xs text-gray-500 block">{user.specialization}</span>
                    )}
                  </div>
                  <div className="text-right sm:hidden">
                    <span className="text-sm font-medium block">Dr. {user.name.split(' ')[0]}</span>
                  </div>
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-1"
                      onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
                    >
                      <ChevronDown className="h-4 w-4 text-gray-600" />
                    </Button>

                    {isAccountDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                        <button
                          onClick={handleEditProfile}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Profile
                        </button>
                        <button
                          onClick={handleChangePassword}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Key className="h-4 w-4 mr-2" />
                          Change Password
                        </button>
                        <button
                          onClick={handleSignOut}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;