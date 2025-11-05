import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import { AuthProvider } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { ThemeProvider } from "./contexts/ThemeContext";

import ProtectedRoute from "./components/common/ProtectedRoute";
import Layout from "./components/common/Layout";
import IndexPage from "./pages/IndexPage";
import LoginPage from "./pages/LoginPage";
import StaffLoginPage from "./pages/StaffLoginPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import DoctorLoginPage from "./pages/DoctorLoginPage";
import ReceptionLoginPage from "./pages/ReceptionLoginPage";
import RegisterPage from "./pages/RegisterPage";
import RedirectPage from "./pages/RedirectPage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import CookiePolicy from "./pages/CookiePolicy";
import AccessibilityPage from "./pages/AccessibilityPage";
import AboutUsPage from "./pages/AboutUsPage";
import TermsOfServicePage from "./pages/TermsOfServicePage";
import AdminDashboard from "./pages/dashboards/AdminDashboard";
import DoctorDashboard from "./pages/dashboards/DoctorDashboard";
import ReceptionDashboard from "./pages/dashboards/ReceptionDashboard";
import PatientDashboard from "./pages/dashboards/PatientDashboard";
import NotFound from "./pages/not-found";
import ChatPage from "./pages/ChatPage";
import BMICalculatorTestPage from "./pages/BMICalculatorTestPage";
import BMICalculatorDebugPage from "./pages/BMICalculatorDebugPage";
import BMICalculatorPage from "./pages/BMICalculatorPage";

// Service Pages
import PatientManagementPage from "./pages/services/PatientManagementPage";
import EmergencyCarePage from "./pages/services/EmergencyCarePage";
import SpecializedTreatmentPage from "./pages/services/SpecializedTreatmentPage";
import AppointmentSchedulingPage from "./pages/services/AppointmentSchedulingPage";
import AIHealthInsightsPage from "./pages/services/AIHealthInsightsPage";
import HealthMonitoringPage from "./pages/services/HealthMonitoringPage";
import VaccinationProgramsPage from "./pages/services/VaccinationProgramsPage";

// Mission, Vision, Facilities Pages
import MissionPage from "./pages/MissionPage";
import VisionPage from "./pages/VisionPage";
import FacilitiesPage from "./pages/FacilitiesPage";

// Individual Facility Pages
import EmergencyDepartmentPage from "./pages/facilities/EmergencyDepartmentPage";
import PatientRoomsPage from "./pages/facilities/PatientRoomsPage";
import OperatingTheatersPage from "./pages/facilities/OperatingTheatersPage";

// Department Pages
import EmergencyPage from "./pages/departments/EmergencyPage";
import CardiologyPage from "./pages/departments/CardiologyPage";
import NeurologyPage from "./pages/departments/NeurologyPage";
import OrthopedicsPage from "./pages/departments/OrthopedicsPage";
import PediatricsPage from "./pages/departments/PediatricsPage";
import OncologyPage from "./pages/departments/OncologyPage";
import RadiologyPage from "./pages/departments/RadiologyPage";
import GynecologyPage from "./pages/departments/GynecologyPage";

import SettingsPage from "./pages/SettingsPage";

// Import the base path
import { BASE_PATH } from "./lib/utils";

function Router() {
  return (
    <WouterRouter base={BASE_PATH}>
      <Switch>
        <Route path="/" component={IndexPage} />
        <Route path="/login" component={LoginPage} />
        <Route path="/staff-login" component={StaffLoginPage} />
        <Route path="/admin-login" component={AdminLoginPage} />
        <Route path="/doctor-login" component={DoctorLoginPage} />
        <Route path="/reception-login" component={ReceptionLoginPage} />
        <Route path="/register" component={RegisterPage} />

        {/* Redirect Pages */}
        <Route path="/login-success">
          {() => (
            <RedirectPage
              title="Login Successful!"
              message="Welcome back to SevaMed HMS"
              redirectMessage="You'll be redirected to your dashboard in a moment."
              redirectTo="/"
              delay={2000}
            />
          )}
        </Route>

        <Route path="/register-success">
          {() => (
            <RedirectPage
              title="Registration Successful!"
              message="Welcome to SevaMed HMS"
              redirectMessage="You'll be redirected to the login page in a moment. Use your username and password to access your personalized healthcare dashboard."
              redirectTo="/login"
              delay={3000}
            />
          )}
        </Route>

        <Route path="/privacy-policy" component={PrivacyPolicy} />
        <Route path="/cookie-policy" component={CookiePolicy} />
        <Route path="/accessibility" component={AccessibilityPage} />
        <Route path="/about-us" component={AboutUsPage} />
        <Route path="/terms-of-service" component={TermsOfServicePage} />

        {/* Service Routes */}
        <Route path="/services/patient-management" component={PatientManagementPage} />
        <Route path="/services/emergency-care" component={EmergencyCarePage} />
        <Route path="/services/specialized-treatment" component={SpecializedTreatmentPage} />
        <Route path="/services/appointment-scheduling" component={AppointmentSchedulingPage} />
        <Route path="/services/ai-health-insights" component={AIHealthInsightsPage} />
        <Route path="/services/health-monitoring" component={HealthMonitoringPage} />
        <Route path="/services/vaccination-programs" component={VaccinationProgramsPage} />

        {/* Mission, Vision, Facilities Routes */}
        <Route path="/mission" component={MissionPage} />
        <Route path="/vision" component={VisionPage} />
        <Route path="/facilities" component={FacilitiesPage} />

        {/* Individual Facility Routes */}
        <Route path="/facilities/emergency-department" component={EmergencyDepartmentPage} />
        <Route path="/facilities/patient-rooms" component={PatientRoomsPage} />
        <Route path="/facilities/operating-theaters" component={OperatingTheatersPage} />

        {/* Department Routes */}
        <Route path="/departments/emergency" component={EmergencyPage} />
        <Route path="/departments/cardiology" component={CardiologyPage} />
        <Route path="/departments/neurology" component={NeurologyPage} />
        <Route path="/departments/orthopedics" component={OrthopedicsPage} />
        <Route path="/departments/pediatrics" component={PediatricsPage} />
        <Route path="/departments/oncology" component={OncologyPage} />
        <Route path="/departments/radiology" component={RadiologyPage} />
        <Route path="/departments/gynecology" component={GynecologyPage} />

        {/* Chat Route - only accessible to patient, reception, and doctor */}
        <Route path="/chat">
          <ProtectedRoute allowedRoles={["patient", "reception", "doctor"]}>
            <ChatPage /> {/* Removed Layout wrapper for full-screen chat */}
          </ProtectedRoute>
        </Route>

        {/* BMI Calculator Test Route */}
        <Route path="/bmi-test" component={BMICalculatorTestPage} />

        {/* BMI Calculator Route */}
        <Route path="/bmi-calculator" component={BMICalculatorPage} />

        {/* Settings Route - only accessible to patient and reception */}
        <Route path="/settings">
          <ProtectedRoute allowedRoles={["patient", "reception"]}>
            <Layout>
              <SettingsPage />
            </Layout>
          </ProtectedRoute>
        </Route>

        <Route path="/admin">
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        </Route>

        <Route path="/reception">
          <ProtectedRoute allowedRoles={["reception"]}>
            <ReceptionDashboard />
          </ProtectedRoute>
        </Route>

        <Route path="/patient">
          <ProtectedRoute allowedRoles={["patient"]}>
            <PatientDashboard />
          </ProtectedRoute>
        </Route>

        {/* Doctor Dashboard Route */}
        <Route path="/doctor">
          <ProtectedRoute allowedRoles={["doctor"]}>
            <DoctorDashboard />
          </ProtectedRoute>
        </Route>

        <Route component={NotFound} />
      </Switch>
    </WouterRouter>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <AuthProvider>
            <LanguageProvider>
              <Toaster />
              <Router />
            </LanguageProvider>
          </AuthProvider>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;