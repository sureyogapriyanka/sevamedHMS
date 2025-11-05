import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import { useLocation } from "wouter";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Alert, AlertDescription } from "../components/ui/alert";
import LanguageSelector from "../components/common/LanguageSelector";
import { Stethoscope, AlertCircle, Clock, User, X, KeyRound, Search } from "lucide-react";

export default function DoctorLoginPage() {
    const { login, isLoading } = useAuth();
    const { t } = useLanguage();
    const [, setLocation] = useLocation();
    const [formData, setFormData] = useState({
        username: "", // Changed from doctorId to username for clarity
        password: "",
        department: "",
        sessionTime: "",
    });
    const [error, setError] = useState("");
    const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
    const [showDoctorProfile, setShowDoctorProfile] = useState(false);
    const [loginLoading, setLoginLoading] = useState(false);

    // Sample doctor data for demonstration (matching the test users)
    const sampleDoctors = [
        {
            id: "DOC001",
            name: "Dr. Sure Yoga Priyanka",
            specialization: "Cardiology",
            experience: "15+ years",
            image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face",
        },
        {
            id: "DOC002",
            name: "Dr. Bhetapudi Manasa",
            specialization: "Neurology",
            experience: "12+ years",
            image: "https://images.unsplash.com/photo-1594824313347-1684dc5de8e8?w=400&h=400&fit=crop&crop=face",
        },
        {
            id: "DOC003",
            name: "Dr. Bhimavarapu Bhavana",
            specialization: "Emergency Medicine",
            experience: "10+ years",
            image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop&crop=face",
        },
        {
            id: "DOC004",
            name: "Dr. Ranjan",
            specialization: "Orthopedics",
            experience: "8+ years",
            image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=400&fit=crop&crop=face",
        },
        {
            id: "DOC005",
            name: "Dr. Pratap",
            specialization: "Pediatrics",
            experience: "10+ years",
            image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop&crop=face",
        }
    ];

    // Handle username input change to show profile
    const handleUsernameChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const username = e.target.value;
        setFormData(prev => ({ ...prev, username }));

        if (username.length >= 3) {
            const doctor = sampleDoctors.find(d => d.id === username);
            if (doctor) {
                setSelectedDoctor(doctor);
                setShowDoctorProfile(true);
            } else {
                // Show a generic profile for unknown doctors
                setSelectedDoctor({
                    id: username,
                    name: "Doctor Profile",
                    specialization: "Medical Professional",
                    experience: "Experienced Practitioner",
                    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face",
                });
                setShowDoctorProfile(true);
            }
        } else {
            setShowDoctorProfile(false);
            setSelectedDoctor(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!formData.username || !formData.password || !formData.department || !formData.sessionTime) {
            setError("Please fill in all required fields.");
            return;
        }

        try {
            setLoginLoading(true);

            // Pass additional data (department and session time) to login
            await login(formData.username, formData.password, {
                department: formData.department,
                sessionTime: formData.sessionTime,
                doctorName: selectedDoctor?.name || "Doctor"
            });

            // Redirect to doctor dashboard after successful login
            setLocation("/doctor");
        } catch (err) {
            setError("Invalid doctor credentials. Please check your username and password.");
        } finally {
            setLoginLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (e.target.name === 'username') {
            handleUsernameChange(e as React.ChangeEvent<HTMLInputElement>);
        } else {
            setFormData(prev => ({
                ...prev,
                [e.target.name]: e.target.value
            }));
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-100 to-blue-900 flex items-center justify-center p-4 relative overflow-hidden" data-testid="doctor-login-page">
            {/* Professional gradient background with medical pattern */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-600/10 to-gray-600/10 backdrop-blur-3xl"></div>
            <div className="absolute inset-0 opacity-5">
                <div className="w-full h-full" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    backgroundSize: '60px 60px'
                }}></div>
            </div>

            <div className="w-full max-w-4xl relative z-10">
                {/* SevaMed Logo and Header */}
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
                        <p className="text-white text-2xl font-bold mb-2">👨‍⚕️ DOCTOR ACCESS</p>
                        <p className="text-blue-100 text-lg font-semibold">Professional Medical Staff Portal</p>
                    </div>
                </div>

                <Card className="shadow-2xl border-2 border-blue-400/30 bg-white/95 backdrop-blur-sm">
                    <CardHeader className="bg-gradient-to-r from-blue-700 to-blue-800 text-white rounded-t-lg">
                        <CardTitle className="text-center text-xl flex items-center justify-center space-x-2">
                            <User className="h-6 w-6" />
                            <span>Doctor Authentication</span>
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
                                        <Label htmlFor="username" className="text-slate-900 font-semibold">Doctor ID *</Label>
                                        <div className="relative">
                                            <Input
                                                id="username"
                                                name="username"
                                                type="text"
                                                value={formData.username}
                                                onChange={handleChange}
                                                placeholder="Enter your Doctor ID (e.g., DOC001)"
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

                                    <div>
                                        <Label htmlFor="department" className="text-slate-900 font-semibold">Department *</Label>
                                        <select
                                            id="department"
                                            name="department"
                                            value={formData.department}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-3 py-3 border border-slate-300 rounded-md focus:border-slate-500 focus:ring-2 focus:ring-slate-200/20 bg-white text-slate-900 h-14 text-lg"
                                            data-testid="select-department"
                                        >
                                            <option value="">Select your department</option>
                                            <option value="cardiology">Cardiology</option>
                                            <option value="neurology">Neurology</option>
                                            <option value="orthopedics">Orthopedics</option>
                                            <option value="pediatrics">Pediatrics</option>
                                            <option value="emergency">Emergency Medicine</option>
                                            <option value="internal">Internal Medicine</option>
                                            <option value="surgery">General Surgery</option>
                                            <option value="radiology">Radiology</option>
                                        </select>
                                    </div>

                                    <div>
                                        <Label htmlFor="sessionTime" className="text-slate-900 font-semibold">Shift Duration *</Label>
                                        <select
                                            id="sessionTime"
                                            name="sessionTime"
                                            value={formData.sessionTime}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-3 py-3 border border-slate-300 rounded-md focus:border-slate-500 focus:ring-2 focus:ring-slate-200/20 bg-white text-slate-900 h-14 text-lg"
                                            data-testid="select-session"
                                        >
                                            <option value="">Select shift duration</option>
                                            <option value="6">6 Hours (Half Shift)</option>
                                            <option value="8">8 Hours (Full Shift)</option>
                                            <option value="12">12 Hours (Extended Shift)</option>
                                            <option value="24">24 Hours (On-Call)</option>
                                        </select>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg transition-all duration-300 transform hover:scale-105 h-14 text-lg"
                                        disabled={isLoading || loginLoading}
                                        data-testid="button-doctor-login"
                                    >
                                        {loginLoading ? (
                                            <div className="flex items-center space-x-2">
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                                <span>Authenticating...</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center space-x-2">
                                                <Stethoscope className="h-5 w-5" />
                                                <span>Doctor Login</span>
                                            </div>
                                        )}
                                    </Button>
                                </form>

                                {/* Demo Credentials */}
                                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                    <p className="text-sm font-medium text-blue-800 mb-2 flex items-center">
                                        <Stethoscope className="h-4 w-4 mr-2" />
                                        Demo Doctor Accounts:
                                    </p>
                                    <div className="text-xs text-blue-700 space-y-1">
                                        <p><strong>DOC001:</strong> CARDIO2024 - Cardiology</p>
                                        <p><strong>DOC002:</strong> NEURO2024 - Neurology</p>
                                        <p><strong>DOC003:</strong> EMERGENCY2024 - Emergency</p>
                                        <p><strong>DOC004:</strong> doctor123 - Orthopedics</p>
                                        <p><strong>DOC005:</strong> doctor123 - Pediatrics</p>
                                    </div>
                                </div>
                            </div>

                            {/* Doctor Profile Display */}
                            <div className="flex flex-col items-center justify-center">
                                {showDoctorProfile && selectedDoctor ? (
                                    <div className="w-full max-w-sm">
                                        <div className="bg-gradient-to-br from-white/90 to-blue-50/80 rounded-2xl p-6 shadow-xl border border-blue-200/50 backdrop-blur-sm">
                                            <div className="flex flex-col items-center">
                                                <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-blue-400 shadow-lg mb-6">
                                                    <img
                                                        src={selectedDoctor.image}
                                                        alt={selectedDoctor.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="text-center">
                                                    <h3 className="text-2xl font-bold text-blue-900 mb-2">{selectedDoctor.name}</h3>
                                                    <p className="text-lg text-blue-700 font-semibold mb-1">{selectedDoctor.specialization}</p>
                                                    <p className="text-md text-blue-600">{selectedDoctor.experience}</p>
                                                    <div className="mt-4 px-4 py-2 bg-blue-100 rounded-full">
                                                        <p className="text-blue-800 font-medium">Username: {selectedDoctor.id}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="w-full max-w-sm">
                                        <div className="bg-gradient-to-br from-white/80 to-gray-100/70 rounded-2xl p-12 shadow-lg border-2 border-dashed border-gray-300/50 backdrop-blur-sm flex flex-col items-center justify-center text-center h-80">
                                            <User className="h-16 w-16 text-gray-400 mb-4" />
                                            <h3 className="text-xl font-semibold text-gray-500 mb-2">Doctor Profile</h3>
                                            <p className="text-gray-400">Enter your username to view profile</p>
                                        </div>
                                    </div>
                                )}

                                {/* Medical Notice */}
                                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg w-full max-w-sm">
                                    <p className="text-xs text-blue-700 flex items-center">
                                        <Clock className="h-4 w-4 mr-1" />
                                        <strong>Medical Protocol:</strong> Please ensure you comply with patient privacy regulations and hospital policies during your session.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="text-center mt-6">
                    <Button
                        variant="ghost"
                        onClick={() => setLocation("/staff-login")}
                        data-testid="link-staff"
                        className="text-blue-800 hover:text-blue-900 hover:bg-blue-100 border border-blue-300 px-8 py-3"
                    >
                        ← Back to Staff Portal
                    </Button>
                </div>
            </div>
        </div>
    );
}