import { useAuth } from "../../contexts/AuthContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import LanguageSelector from "./LanguageSelector";
import ChatInterface from "../chat/ChatInterface";
import NotificationPanel from "./NotificationPanel";
import {
  Heart,
  Calendar,
  Clock,
  MessageSquare,
  Brain,
  Settings,
  Bell,
  Menu,
  ChevronDown,
  UserCheck,
  Users,
  Activity,
  CreditCard
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user) return null;

  const getNavigationItems = () => {
    const baseItems = [
      { href: `/${user.role}`, icon: Activity, label: t("dashboard"), active: location === `/${user.role}` },
    ];

    if (user.role === "admin") {
      return [
        ...baseItems,
        { href: "/admin/users", icon: Users, label: "Staff Management", active: location.includes("/users") },
        { href: "/admin/attendance", icon: Clock, label: t("attendance"), active: location.includes("/attendance") },
        { href: "/admin/overview", icon: Activity, label: "System Overview", active: location.includes("/overview") },
      ];
    } else if (user.role === "doctor") {
      return [
        ...baseItems,
        { href: "/doctor/patients", icon: Users, label: t("patients"), active: location.includes("/patients") },
        { href: "/doctor/appointments", icon: Calendar, label: t("appointments"), active: location.includes("/appointments") },
        { href: "/doctor/attendance", icon: Clock, label: t("attendance"), active: location.includes("/attendance") },
      ];
    } else if (user.role === "reception") {
      return [
        ...baseItems,
        { href: "/reception/queue", icon: Users, label: "Queue Management", active: location.includes("/queue") },
        { href: "/reception/payments", icon: CreditCard, label: "Payments", active: location.includes("/payments") },
        { href: "/reception/attendance", icon: Clock, label: t("attendance"), active: location.includes("/attendance") },
      ];
    } else if (user.role === "patient") {
      return [
        ...baseItems,
        { href: "/patient/appointments", icon: Calendar, label: t("appointments"), active: location.includes("/appointments") },
        { href: "/patient/fitness", icon: Heart, label: t("fitness_tracker"), active: location.includes("/fitness") },
      ];
    }

    return baseItems;
  };

  const navigationItems = getNavigationItems();

  return (
    <div className="min-h-screen flex bg-background" data-testid="layout-container">
      {/* Sidebar */}
      <aside
        className={`w-64 bg-card border-r border-border sidebar-transition transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:transform-none lg:translate-x-0 fixed lg:relative z-30 h-full`}
        data-testid="sidebar"
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center">
              <img
                src="/sevamed logo.png"
                alt="SevaMed Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">{t("sevamed_hms")}</h1>
              <p className="text-sm text-muted-foreground">{t("healthcare_management")}</p>
            </div>
          </div>
        </div>

        {/* User Profile */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
              <span className="text-secondary-foreground font-medium">
                {user.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <p className="font-medium text-foreground" data-testid="user-name">{user.name}</p>
              <p className="text-sm text-muted-foreground" data-testid="user-role">
                {t(user.role)} {user.department && `- ${user.department}`}
              </p>
            </div>
            <span className="w-3 h-3 bg-secondary rounded-full" title={t("online")}></span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          <div className="space-y-2">
            {navigationItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <a
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${item.active
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted text-foreground'
                    }`}
                  data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </a>
              </Link>
            ))}

            <Link href="/chat">
              <a className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted text-foreground">
                <MessageSquare className="h-5 w-5" />
                <span>{t("internal_chat")}</span>
                <Badge variant="secondary" className="ml-auto">2</Badge>
              </a>
            </Link>

            <Link href="/ai-insights">
              <a className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted text-foreground">
                <Brain className="h-5 w-5" />
                <span>{t("ai_insights")}</span>
              </a>
            </Link>
          </div>

          <div className="mt-8 pt-4 border-t border-border">
            <p className="text-xs font-medium text-muted-foreground mb-3">SETTINGS</p>
            <div className="space-y-2">
              <div className="flex items-center space-x-3 p-3 rounded-lg">
                <LanguageSelector />
              </div>
              <Link href="/settings">
                <a className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted text-foreground">
                  <Settings className="h-5 w-5" />
                  <span>{t("settings")}</span>
                </a>
              </Link>
            </div>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:ml-0">
        {/* Top Bar */}
        <header className="bg-card border-b border-border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                data-testid="sidebar-toggle"
              >
                <Menu className="h-4 w-4" />
              </Button>
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  {t(`${user.role}_dashboard`)}
                </h2>
                <p className="text-muted-foreground">
                  {user.role === "doctor" && t("manage_patients")}
                  {user.role === "patient" && t("welcome_patient")}
                  {user.role === "admin" && t("monitor_activities")}
                  {user.role === "reception" && t("manage_queue")}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <NotificationPanel />
              <Button variant="ghost" size="sm" className="relative" data-testid="notifications">
                <Bell className="h-4 w-4" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center">
                  3
                </Badge>
              </Button>

              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                  <span className="text-secondary-foreground text-sm font-medium">
                    {user.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  data-testid="logout-button"
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {children}
        </div>
      </main>

      {/* Chat Interface */}
      <ChatInterface />

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}