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
import { Users, AlertCircle, Clock, Phone, X, KeyRound } from "lucide-react";

// Receptionist profiles data with Indian names
const receptionProfiles = [
    {
        id: "REC001",
        name: "Priya Sharma",
        position: "Senior Receptionist",
        experience: "8+ years",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face",
        credentials: { staffId: "REC001", password: "RECEPTION2024" }
    },
    {
        id: "REC002",
        name: "Anjali Patel",
        position: "Receptionist",
        experience: "5+ years",
        image: "https://images.unsplash.com/photo-1587778083301-f60a5d2f0b4e?w=400&h=400&fit=crop&crop=face",
        credentials: { staffId: "REC002", password: "PAT2024" }
    },
    {
        id: "REC003",
        name: "Sneha Reddy",
        position: "Junior Receptionist",
        experience: "3+ years",
        image: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=400&h=400&fit=crop&crop=face",
        credentials: { staffId: "REC003", password: "REDDY2024" }
    }
];

export default function ReceptionLoginPage() {
    const { login, isLoading } = useAuth();
    const { t } = useLanguage();
    const [, setLocation] = useLocation();
    const [selectedReceptionist, setSelectedReceptionist] = useState(null);
    const [showLoginForm, setShowLoginForm] = useState(false);
    const [loginLoading, setLoginLoading] = useState(false);
    const [formData, setFormData] = useState({
        staffId: "",
        password: "",
        shift: "",
        sessionTime: "",
    });
    const [error, setError] = useState("");

    const handleReceptionistSelect = (receptionist) => {
        setSelectedReceptionist(receptionist);
        setFormData({
            staffId: receptionist.credentials.staffId,
            password: "",
            shift: "",
            sessionTime: ""
        });
        setShowLoginForm(true);
        setError("");
    };

    const handleCloseForm = () => {
        setShowLoginForm(false);
        setSelectedReceptionist(null);
        setFormData({ staffId: "", password: "", shift: "", sessionTime: "" });
        setError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!selectedReceptionist) {
            setError("No receptionist selected.");
            return;
        }

        if (!formData.password) {
            setError("Please enter your password.");
            return;
        }

        if (!formData.shift) {
            setError("Please select your shift.");
            return;
        }

        if (!formData.sessionTime) {
            setError("Please select session duration.");
            return;
        }

        try {
            setLoginLoading(true);

            // 3-second loading simulation
            await new Promise(resolve => setTimeout(resolve, 3000));

            // Use staff ID as username for login
            await login(formData.staffId, formData.password, {
                shift: formData.shift,
                sessionTime: formData.sessionTime,
                receptionistName: selectedReceptionist.name
            });

            // Add delay to ensure token is saved before redirection
            setTimeout(() => {
                // Check if token exists before redirecting
                const token = localStorage.getItem("token");
                if (token) {
                    // Redirect to reception dashboard
                    setLocation("/reception");
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
        <div className="min-h-screen bg-gradient-to-b from-slate-700 via-sky-100 to-slate-700 flex items-center justify-center p-4 relative overflow-hidden" data-testid="reception-login-page">
            {/* Professional gradient background with medical pattern */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-600/10 to-sky-600/10 backdrop-blur-3xl"></div>
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
                        <div className="w-24 h-24 bg-gradient-to-br from-slate-700 via-sky-500 to-slate-700 rounded-full flex items-center justify-center shadow-2xl border-4 border-white/30 relative z-30">
                            <div className="text-white font-bold text-3xl">SM</div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-r from-slate-700 to-sky-700 backdrop-blur-md rounded-xl p-6 shadow-2xl border-2 border-sky-900/50 relative z-20" style={{ boxShadow: '0 20px 40px rgba(0,0,0,0.25)' }}>
                        <h1 className="text-5xl font-bold text-white mb-3">
                            {t("sevamed_hms")}
                        </h1>
                        <p className="text-white text-2xl font-bold mb-2">🏥 RECEPTION ACCESS</p>
                        <p className="text-sky-100 text-lg font-semibold">Professional Front Desk Portal</p>
                    </div>
                </div>

                {!showLoginForm ? (
                    /* Receptionist Profile Selection */
                    <Card className="shadow-2xl border-2 border-gray-300 bg-white/98 backdrop-blur-md relative z-20" style={{ boxShadow: '0 25px 50px rgba(0,0,0,0.2)' }}>
                        <CardHeader className="bg-gradient-to-r from-slate-600 to-sky-600 text-white rounded-t-lg">
                            <CardTitle className="text-center text-2xl flex items-center justify-center space-x-2">
                                <Phone className="h-8 w-8" />
                                <span>Select Receptionist Profile</span>
                            </CardTitle>
                            <div className="flex justify-center mt-4">
                                <div className="w-48">
                                    <LanguageSelector />
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="p-8">
                            <p className="text-center text-slate-700 mb-8 font-medium text-lg">
                                📞 Choose your receptionist profile to access front desk dashboard
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {receptionProfiles.map((receptionist) => (
                                    <div key={receptionist.id} className="flex flex-col items-center">
                                        <button
                                            onClick={() => handleReceptionistSelect(receptionist)}
                                            className="group w-full bg-gradient-to-br from-white/95 via-sky-50/90 to-indigo-100/85 hover:from-sky-50/95 hover:via-indigo-50/90 hover:to-purple-50/85 border-2 border-sky-400/70 hover:border-indigo-500/90 rounded-xl p-6 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-2xl backdrop-blur-sm relative z-20"
                                            style={{
                                                boxShadow: '0 20px 40px rgba(0,0,0,0.25), 0 10px 25px rgba(14, 165, 233, 0.4), inset 0 1px 0 rgba(255,255,255,0.8)',
                                                background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(224, 242, 254, 0.9) 50%, rgba(186, 230, 253, 0.85) 100%)'
                                            }}
                                        >
                                            {/* Round Profile Image */}
                                            <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-3 border-sky-400 group-hover:border-indigo-500 transition-all duration-300 shadow-md">
                                                <img
                                                    src={receptionist.image}
                                                    alt={receptionist.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>

                                            {/* Receptionist Info */}
                                            <div className="text-center">
                                                <h3 className="text-gray-800 font-bold text-lg mb-1">{receptionist.name}</h3>
                                                <p className="text-sky-600 text-sm mb-1 font-medium">{receptionist.position}</p>
                                                <p className="text-gray-600 text-xs font-medium mb-1">{receptionist.experience}</p>
                                                <p className="text-gray-500 text-xs font-medium bg-sky-100 px-2 py-1 rounded-md inline-block">{receptionist.id}</p>
                                            </div>

                                            {/* Hover Effect */}
                                            <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <div className="flex items-center justify-center space-x-2 text-sky-700 text-sm font-medium bg-sky-100 px-3 py-2 rounded-md">
                                                    <Users className="h-4 w-4" />
                                                    <span>Click to Authenticate</span>
                                                </div>
                                            </div>
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Service Notice */}
                            <div className="mt-8 p-4 bg-sky-50 border border-sky-200 rounded-lg">
                                <p className="text-center text-sky-700 text-sm flex items-center justify-center space-x-2">
                                    <Phone className="h-4 w-4" />
                                    <span>All reception access attempts are logged and monitored for service quality</span>
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
                            <Card className="w-full max-w-md shadow-2xl border-2 border-sky-400/50 bg-white/95 backdrop-blur-md">
                                <CardHeader className="bg-gradient-to-r from-sky-600 to-indigo-600 text-white rounded-t-lg relative">
                                    <button
                                        onClick={handleCloseForm}
                                        className="absolute top-4 right-4 text-white hover:text-purple-200 transition-colors"
                                    >
                                        <X className="h-6 w-6" />
                                    </button>

                                    <div className="text-center">
                                        <div className="w-16 h-16 mx-auto mb-4 rounded-full overflow-hidden border-4 border-white/30">
                                            <img
                                                src={selectedReceptionist?.image}
                                                alt={selectedReceptionist?.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <CardTitle className="text-xl flex items-center justify-center space-x-2">
                                            <Users className="h-5 w-5" />
                                            <span>{selectedReceptionist?.name}</span>
                                        </CardTitle>
                                        <p className="text-sky-100 text-sm mt-1">{selectedReceptionist?.position}</p>
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
                                            <Label htmlFor="staffId" className="text-slate-700">Staff ID</Label>
                                            <Input
                                                id="staffId"
                                                name="staffId"
                                                type="text"
                                                value={formData.staffId}
                                                readOnly
                                                className="border-slate-300 bg-slate-50 text-slate-800"
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="password" className="text-slate-700">Password *</Label>
                                            <Input
                                                id="password"
                                                name="password"
                                                type="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                placeholder="Enter your password"
                                                required
                                                className="border-slate-300 focus:border-slate-500 bg-white text-slate-800"
                                                data-testid="input-password"
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="shift" className="text-slate-700">Work Shift *</Label>
                                            <select
                                                id="shift"
                                                name="shift"
                                                value={formData.shift}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:border-slate-500 focus:ring-2 focus:ring-slate-200 bg-white text-slate-800"
                                                data-testid="select-shift"
                                            >
                                                <option value="">Select your shift</option>
                                                <option value="morning">Morning Shift (7 AM - 3 PM)</option>
                                                <option value="afternoon">Afternoon Shift (3 PM - 11 PM)</option>
                                                <option value="night">Night Shift (11 PM - 7 AM)</option>
                                                <option value="weekend">Weekend Shift</option>
                                            </select>
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
                                                <option value="4">4 Hours (Half Shift)</option>
                                                <option value="8">8 Hours (Full Shift)</option>
                                                <option value="12">12 Hours (Double Shift)</option>
                                            </select>
                                        </div>

                                        <Button
                                            type="submit"
                                            className="w-full bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white shadow-lg transition-all duration-300 transform hover:scale-105"
                                            disabled={loginLoading}
                                            data-testid="button-reception-login"
                                        >
                                            {loginLoading ? (
                                                <div className="flex items-center space-x-2">
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                    <span>Authenticating...</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-center space-x-2">
                                                    <KeyRound className="h-4 w-4" />
                                                    <span>Reception Login</span>
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