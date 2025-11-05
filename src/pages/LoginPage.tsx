import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import { useLocation } from "wouter";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Alert, AlertDescription } from "../components/ui/alert";
import LanguageSelector from "../components/common/LanguageSelector";
import { Heart, AlertCircle, Search, User } from "lucide-react";
import { authService } from "../services/api";

export default function LoginPage() {
  const { login, isLoading } = useAuth();
  const { t } = useLanguage();
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [showPatientProfile, setShowPatientProfile] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);

  // Handle username input change to show profile
  const handleUsernameChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const username = e.target.value;
    setFormData(prev => ({ ...prev, username }));

    if (username.length >= 3) {
      // Fetch actual user data by username
      setLoadingProfile(true);
      try {
        const { data, error } = await authService.getUserByUsername(username);

        if (data && !error) {
          setSelectedPatient({
            id: data._id,
            username: data.username,
            name: data.name,
            email: data.email,
            profileImage: data.profileImage // Use the actual profile image
          });
          setShowPatientProfile(true);
        } else {
          // Show a generic profile for unknown patients
          setSelectedPatient({
            id: username,
            name: "Patient Profile",
            email: "patient@example.com",
            profileImage: null
          });
          setShowPatientProfile(true);
        }
      } catch (err) {
        // Show a generic profile for unknown patients
        setSelectedPatient({
          id: username,
          name: "Patient Profile",
          email: "patient@example.com",
          profileImage: null
        });
        setShowPatientProfile(true);
      } finally {
        setLoadingProfile(false);
      }
    } else {
      setShowPatientProfile(false);
      setSelectedPatient(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await login(formData.username, formData.password);
      // Redirect to success page after successful login
      setLocation("/login-success");
    } catch (err: any) {
      // More detailed error handling
      console.error("Login error:", err);
      if (err.message) {
        setError(err.message);
      } else {
        setError("Authentication failed. Please verify your credentials.");
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === 'username') {
      handleUsernameChange(e);
    } else {
      setFormData(prev => ({
        ...prev,
        [e.target.name]: e.target.value
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-100 to-blue-900 flex items-center justify-center p-4 relative overflow-hidden" data-testid="login-page">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-600/10 to-gray-600/10 backdrop-blur-3xl"></div>
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      <div className="w-full max-w-4xl relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-slate-600 via-gray-500 to-slate-600 rounded-full flex items-center justify-center shadow-2xl border-4 border-white/20">
              <div className="text-white font-bold text-2xl">SM</div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-blue-700 to-blue-800 backdrop-blur-md rounded-xl p-6 shadow-2xl border-2 border-blue-900/50 relative z-20" style={{ boxShadow: '0 20px 40px rgba(0,0,0,0.25)' }}>
            <h1 className="text-5xl font-bold text-white mb-3">
              {t("sevamed_hms")}
            </h1>
            <p className="text-white text-2xl font-bold mb-2">🏥 PATIENT LOGIN</p>
            <p className="text-blue-100 text-lg font-semibold">Access Your Healthcare Portal</p>
          </div>
        </div>

        <Card className="shadow-2xl border-2 border-blue-400/30 bg-white/95 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-blue-700 to-blue-800 text-white rounded-t-lg">
            <CardTitle className="text-center text-xl flex items-center justify-center space-x-2">
              <User className="h-6 w-6" />
              <span>Patient Authentication</span>
            </CardTitle>
            <div className="flex justify-center mt-4">
              <div className="w-48">
                <LanguageSelector />
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Two-column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Credentials Form */}
              <div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="username" className="text-slate-900 font-semibold">Username *</Label>
                    <div className="relative">
                      <Input
                        id="username"
                        name="username"
                        type="text"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Enter your username"
                        required
                        className="border-slate-300 focus:border-slate-500 bg-white text-slate-900 placeholder-slate-400 pl-10 h-14 text-lg"
                        data-testid="input-username"
                      />
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="password" className="text-slate-900 font-semibold">Password *</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      required
                      className="border-slate-300 focus:border-slate-500 bg-white text-slate-900 placeholder-slate-400 h-14 text-lg"
                      data-testid="input-password"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg transition-all duration-300 transform hover:scale-105 h-14 text-lg"
                    disabled={isLoading}
                    data-testid="button-login"
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Authenticating...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <Heart className="h-5 w-5" />
                        <span>Patient Login</span>
                      </div>
                    )}
                  </Button>
                </form>

                {/* Demo Credentials */}
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm font-medium text-blue-800 mb-2 flex items-center">
                    <Heart className="h-4 w-4 mr-2" />
                    Demo Patient Accounts:
                  </p>
                  <div className="text-xs text-blue-700 space-y-1">
                    <p><strong>Patient:</strong> patient1 / patient123</p>
                    <p><strong>Patient:</strong> patient2 / patient123</p>
                    <p><strong>Patient:</strong> john_doe / patient123</p>
                  </div>
                </div>

                <div className="mt-4 text-center">
                  <p className="text-sm text-slate-600">
                    Don't have an account?{" "}
                    <Button
                      variant="link"
                      className="p-0 h-auto text-blue-600 hover:text-blue-800"
                      onClick={() => setLocation("/register")}
                      data-testid="link-register"
                    >
                      Register as Patient
                    </Button>
                  </p>
                  <p className="text-sm text-slate-600 mt-2">
                    Are you staff?{" "}
                    <Button
                      variant="link"
                      className="p-0 h-auto text-blue-600 hover:text-blue-800"
                      onClick={() => setLocation("/staff-login")}
                      data-testid="link-staff-login"
                    >
                      Staff Login
                    </Button>
                  </p>
                </div>
              </div>

              {/* Patient Profile Display */}
              <div className="flex flex-col items-center justify-center">
                {loadingProfile ? (
                  <div className="w-full max-w-sm flex items-center justify-center h-80">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
                  </div>
                ) : showPatientProfile && selectedPatient ? (
                  <div className="w-full max-w-sm">
                    <div className="bg-gradient-to-br from-white/90 to-blue-50/80 rounded-2xl p-6 shadow-xl border border-blue-200/50 backdrop-blur-sm">
                      <div className="flex flex-col items-center">
                        <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-blue-400 shadow-lg mb-6">
                          {selectedPatient.profileImage ? (
                            <img
                              src={selectedPatient.profileImage}
                              alt={selectedPatient.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <User className="h-16 w-16 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="text-center">
                          <h3 className="text-2xl font-bold text-blue-900 mb-2">{selectedPatient.name}</h3>
                          <p className="text-lg text-blue-700 font-semibold mb-1">@{selectedPatient.username || selectedPatient.id}</p>
                          <p className="text-md text-blue-600">{selectedPatient.email}</p>
                          <div className="mt-4 px-4 py-2 bg-blue-100 rounded-full">
                            <p className="text-blue-800 font-medium">Patient ID: {selectedPatient.id?.substring(0, 8) || "N/A"}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="w-full max-w-sm">
                    <div className="bg-gradient-to-br from-white/80 to-gray-100/70 rounded-2xl p-12 shadow-lg border-2 border-dashed border-gray-300/50 backdrop-blur-sm flex flex-col items-center justify-center text-center h-80">
                      <User className="h-16 w-16 text-gray-400 mb-4" />
                      <h3 className="text-xl font-semibold text-gray-500 mb-2">Patient Profile</h3>
                      <p className="text-gray-400">Enter your username to view profile</p>
                    </div>
                  </div>
                )}

                {/* Medical Notice */}
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg w-full max-w-sm">
                  <p className="text-xs text-blue-700 flex items-center">
                    <Heart className="h-4 w-4 mr-1" />
                    <strong>Privacy Notice:</strong> Your information is securely encrypted and protected under healthcare privacy laws.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <Button
            variant="ghost"
            onClick={() => setLocation("/")}
            data-testid="link-home"
            className="text-blue-800 hover:text-blue-900 hover:bg-blue-100 border border-blue-300 px-8 py-3"
          >
            ← Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}