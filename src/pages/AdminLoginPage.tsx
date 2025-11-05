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
import { Shield, AlertCircle, Clock, Lock, X, User, KeyRound } from "lucide-react";

// Admin profiles data - now with actual usernames and passwords for backend authentication
const adminProfiles = [
    {
        id: "ADM001",
        name: "Sure Yoga Priyanka",
        rollNumber: "231FA07046",
        title: "Chief Administrator",
        image: "https://images.unsplash.com/photo-1594824352837-b73b8b8bb1d4?auto=format&fit=crop&w=150&q=80",
        credentials: { username: "ADM001", password: "YOGA2024" }
    },
    {
        id: "ADM002",
        name: "Bhetapudi Manasa",
        rollNumber: "231FA07036",
        title: "System Administrator",
        image: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?auto=format&fit=crop&w=150&q=80",
        credentials: { username: "ADM002", password: "MANASA2024" }
    },
    {
        id: "ADM003",
        name: "Bhimavarapu Bhavana",
        rollNumber: "231FA07049",
        title: "Operations Administrator",
        image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=150&q=80",
        credentials: { username: "ADM003", password: "BHAVANA2024" }
    }
];

export default function AdminLoginPage() {
    const { login, isLoading } = useAuth();
    const { t } = useLanguage();
    const [, setLocation] = useLocation();
    const [selectedAdmin, setSelectedAdmin] = useState(null);
    const [showLoginForm, setShowLoginForm] = useState(false);
    const [loginLoading, setLoginLoading] = useState(false);
    const [formData, setFormData] = useState({
        registrationNumber: "",
        uniqueCode: "",
        sessionTime: "",
    });
    const [error, setError] = useState("");

    const handleAdminSelect = (admin) => {
        setSelectedAdmin(admin);
        setFormData({
            registrationNumber: admin.credentials.username,
            uniqueCode: "",
            sessionTime: ""
        });
        setShowLoginForm(true);
        setError("");
    };

    const handleCloseForm = () => {
        setShowLoginForm(false);
        setSelectedAdmin(null);
        setFormData({ registrationNumber: "", uniqueCode: "", sessionTime: "" });
        setError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!selectedAdmin) {
            setError("No administrator selected.");
            return;
        }

        // Removed the local security code check since we want to validate against the database
        // if (formData.uniqueCode !== selectedAdmin.credentials.code) {
        //     setError("Invalid security code for " + selectedAdmin.name);
        //     return;
        // }

        if (!formData.uniqueCode) {
            setError("Please enter the security code.");
            return;
        }

        if (!formData.sessionTime) {
            setError("Please select session duration.");
            return;
        }

        try {
            setLoginLoading(true);

            // Use the actual username and password for authentication
            await login(formData.registrationNumber, formData.uniqueCode, {
                sessionTime: formData.sessionTime,
                adminName: selectedAdmin.name
            });

            // Wait a moment to ensure token is saved before redirecting
            setTimeout(() => {
                // Verify token exists before redirecting
                const token = localStorage.getItem('token');
                if (token) {
                    // Redirect to admin dashboard after successful login
                    setLocation("/admin");
                } else {
                    setError("Authentication failed. Token not received.");
                }
            }, 500);
        } catch (err) {
            setError("Authentication failed. Please verify your credentials.");
        } finally {
            setLoginLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-100 to-blue-900 flex items-center justify-center p-4 relative overflow-hidden" data-testid="admin-login-page">
            {/* Professional gradient background with medical pattern */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-600/10 to-gray-600/10 backdrop-blur-3xl"></div>
            <div className="absolute inset-0 opacity-5">
                <div className="w-full h-full" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    backgroundSize: '60px 60px'
                }}></div>
            </div>

            <div className="w-full max-w-6xl relative z-10">
                {/* SevaMed Logo and Header */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-6">
                        <div className="w-24 h-24 bg-gradient-to-br from-slate-700 via-gray-600 to-slate-700 rounded-full flex items-center justify-center shadow-2xl border-4 border-white/30 relative z-30">
                            <div className="text-white font-bold text-3xl">SM</div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-r from-blue-700 to-blue-800 backdrop-blur-md rounded-xl p-6 shadow-2xl border-2 border-blue-900/50 relative z-20" style={{ boxShadow: '0 20px 40px rgba(0,0,0,0.25)' }}>
                        <h1 className="text-5xl font-bold text-white mb-3">
                            {t("sevamed_hms")}
                        </h1>
                        <p className="text-white text-2xl font-bold mb-2">🔒 ADMINISTRATOR ACCESS</p>
                        <p className="text-blue-100 text-lg font-semibold">Maximum Security Administrative Portal</p>
                    </div>
                </div>

                {!showLoginForm ? (
                    /* Admin Profile Selection */
                    <Card className="shadow-2xl border-2 border-gray-300 bg-white/98 backdrop-blur-md relative z-20" style={{ boxShadow: '0 25px 50px rgba(0,0,0,0.2)' }}>
                        <CardHeader className="bg-gradient-to-r from-slate-600 to-gray-600 text-white rounded-t-lg">
                            <CardTitle className="text-center text-2xl flex items-center justify-center space-x-2">
                                <Shield className="h-8 w-8" />
                                <span>Select Administrator Profile</span>
                            </CardTitle>
                            <div className="flex justify-center mt-4">
                                <div className="w-48">
                                    <LanguageSelector />
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="p-8">
                            <p className="text-center text-slate-700 mb-8 font-medium text-lg">
                                🛡️ Choose your administrator profile to access secure dashboard
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {adminProfiles.map((admin) => (
                                    <div key={admin.id} className="flex flex-col items-center">
                                        <button
                                            onClick={() => handleAdminSelect(admin)}
                                            className="group w-full bg-white/95 hover:bg-gray-50/95 border border-gray-300 hover:border-gray-400 rounded-lg p-6 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl backdrop-blur-sm relative z-20"
                                            style={{
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.05)'
                                            }}
                                        >
                                            {/* Round Profile Image */}
                                            <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-3 border-gray-300 group-hover:border-gray-400 transition-all duration-300 shadow-md">
                                                <img
                                                    src={admin.image}
                                                    alt={admin.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>

                                            {/* Admin Info */}
                                            <div className="text-center">
                                                <h3 className="text-gray-800 font-bold text-lg mb-1">{admin.name}</h3>
                                                <p className="text-gray-600 text-sm mb-1 font-medium">{admin.title}</p>
                                                <p className="text-gray-500 text-xs font-medium mb-1">Roll: {admin.rollNumber}</p>
                                                <p className="text-gray-500 text-xs font-medium bg-gray-100 px-2 py-1 rounded-md inline-block">{admin.id}</p>
                                            </div>

                                            {/* Hover Effect */}
                                            <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <div className="flex items-center justify-center space-x-2 text-gray-700 text-sm font-medium bg-gray-100 px-3 py-2 rounded-md">
                                                    <Lock className="h-4 w-4" />
                                                    <span>Click to Authenticate</span>
                                                </div>
                                            </div>
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Security Notice */}
                            <div className="mt-8 p-4 bg-slate-100 border border-slate-300 rounded-lg">
                                <p className="text-center text-slate-700 text-sm flex items-center justify-center space-x-2">
                                    <Shield className="h-4 w-4" />
                                    <span>All administrator access attempts are logged and monitored for security compliance</span>
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    /* Login Form Popup */
                    <>
                        {/* Overlay */}
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={handleCloseForm}></div>

                        {/* Popup Form */}
                        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                            <Card className="w-full max-w-md shadow-2xl border-2 border-slate-400/50 bg-white/95 backdrop-blur-md">
                                <CardHeader className="bg-gradient-to-r from-slate-600 to-gray-600 text-white rounded-t-lg relative">
                                    <button
                                        onClick={handleCloseForm}
                                        className="absolute top-4 right-4 text-white hover:text-purple-200 transition-colors"
                                    >
                                        <X className="h-6 w-6" />
                                    </button>

                                    <div className="text-center">
                                        <div className="w-16 h-16 mx-auto mb-4 rounded-full overflow-hidden border-4 border-white/30">
                                            <img
                                                src={selectedAdmin?.image}
                                                alt={selectedAdmin?.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <CardTitle className="text-xl flex items-center justify-center space-x-2">
                                            <User className="h-5 w-5" />
                                            <span>{selectedAdmin?.name}</span>
                                        </CardTitle>
                                        <p className="text-slate-200 text-sm mt-1">{selectedAdmin?.title}</p>
                                    </div>
                                </CardHeader>

                                <CardContent className="p-6">
                                    {error && (
                                        <Alert variant="destructive" className="mb-4">
                                            <AlertCircle className="h-4 w-4" />
                                            <AlertDescription>{error}</AlertDescription>
                                        </Alert>
                                    )}

                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div>
                                            <Label htmlFor="registrationNumber" className="text-slate-700">Registration Number</Label>
                                            <Input
                                                id="registrationNumber"
                                                name="registrationNumber"
                                                type="text"
                                                value={formData.registrationNumber}
                                                readOnly
                                                className="border-slate-300 bg-slate-50 text-slate-800"
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="uniqueCode" className="text-slate-700">Security Code *</Label>
                                            <Input
                                                id="uniqueCode"
                                                name="uniqueCode"
                                                type="password"
                                                value={formData.uniqueCode}
                                                onChange={handleChange}
                                                placeholder="Enter your unique security code"
                                                required
                                                className="border-slate-300 focus:border-slate-500 bg-white text-slate-800"
                                                data-testid="input-code"
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="sessionTime" className="text-slate-700">Session Duration *</Label>
                                            <select
                                                id="sessionTime"
                                                name="sessionTime"
                                                value={formData.sessionTime}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:border-slate-500 focus:ring-2 focus:ring-slate-200 bg-white text-slate-800"
                                                data-testid="select-session"
                                            >
                                                <option value="">Select session duration</option>
                                                <option value="2">2 Hours</option>
                                                <option value="4">4 Hours</option>
                                                <option value="8">8 Hours (Full Day)</option>
                                                <option value="12">12 Hours (Extended)</option>
                                            </select>
                                        </div>

                                        <Button
                                            type="submit"
                                            className="w-full bg-gradient-to-r from-slate-600 to-gray-600 hover:from-slate-700 hover:to-gray-700 text-white shadow-lg transition-all duration-300 transform hover:scale-105"
                                            disabled={loginLoading}
                                            data-testid="button-admin-login"
                                        >
                                            {loginLoading ? (
                                                <div className="flex items-center space-x-2">
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                    <span>Authenticating...</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-center space-x-2">
                                                    <KeyRound className="h-4 w-4" />
                                                    <span>Secure Login</span>
                                                </div>
                                            )}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>
                    </>
                )}

                <div className="text-center mt-6">
                    <Button
                        variant="ghost"
                        onClick={() => setLocation("/staff-login")}
                        data-testid="link-staff"
                        className="text-slate-600 hover:text-slate-800 hover:bg-slate-200/50 border border-slate-400/30 px-8 py-3"
                    >
                        ← Back to Staff Portal
                    </Button>
                </div>
            </div>
        </div>
    );
}