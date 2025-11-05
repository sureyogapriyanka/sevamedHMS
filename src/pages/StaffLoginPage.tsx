import { useState, useEffect } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { useLocation } from "wouter";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import LanguageSelector from "../components/common/LanguageSelector";
import { Heart, Shield, Stethoscope, Users, Eye, Clock, AlertTriangle, Lock, Camera } from "lucide-react";

export default function StaffLoginPage() {
    const { t } = useLanguage();
    const [, setLocation] = useLocation();
    const [currentTime, setCurrentTime] = useState(new Date());
    const [sessionId] = useState(() => `SES-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);

    // Update time every second
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-100 to-blue-900 flex items-center justify-center p-4 relative overflow-hidden" data-testid="staff-login-page">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-blue-600/10 backdrop-blur-3xl"></div>
            <div className="absolute inset-0 opacity-5">
                <div className="w-full h-full" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    backgroundSize: '60px 60px'
                }}></div>
            </div>

            {/* Security Monitoring Banner */}
            <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-700 to-blue-800 text-white text-center py-2 text-sm font-medium z-20 shadow-lg">
                <div className="flex items-center justify-center space-x-2">
                    <Eye className="h-4 w-4 animate-pulse" />
                    <span>🔒 SECURE ACCESS PORTAL - ALL ACTIVITIES MONITORED & LOGGED</span>
                    <Camera className="h-4 w-4 animate-pulse" />
                </div>
            </div>

            <div className="w-full max-w-6xl relative z-10 mt-12">
                {/* Session Info */}
                <div className="bg-blue-800/80 backdrop-blur-sm border border-blue-600 rounded-lg p-3 mb-6 text-white text-xs shadow-md">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                            <Clock className="h-3 w-3" />
                            <span>Session: {sessionId}</span>
                        </div>
                        <div className="text-right">
                            <div>{currentTime.toLocaleDateString()}</div>
                            <div className="font-mono">{currentTime.toLocaleTimeString()}</div>
                        </div>
                    </div>
                </div>

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-6">
                        <div className="w-24 h-24 bg-gradient-to-br from-blue-600 via-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-2xl border-4 border-white/30 relative z-30">
                            <div className="text-white font-bold text-3xl">SM</div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-r from-blue-700 to-blue-800 backdrop-blur-md rounded-xl p-6 shadow-2xl border-2 border-blue-900/50 relative z-20" style={{ boxShadow: '0 20px 40px rgba(0,0,0,0.25)' }}>
                        <h1 className="text-5xl font-bold text-white mb-3">
                            {t("sevamed_hms")}
                        </h1>
                        <p className="text-white text-2xl font-bold mb-2">🛡️ AUTHORIZED STAFF PORTAL 🛡️</p>
                        <p className="text-blue-100 text-lg font-semibold">High Security Healthcare Access System</p>
                    </div>
                </div>

                {/* Security Warning Card */}
                <Card className="shadow-2xl border-2 border-blue-500/50 bg-white/90 backdrop-blur-sm mb-8">
                    <CardHeader className="bg-gradient-to-r from-blue-700 to-blue-800 text-white rounded-t-lg">
                        <CardTitle className="text-center flex items-center justify-center space-x-2">
                            <AlertTriangle className="h-6 w-6 animate-bounce" />
                            <span>SECURITY NOTICE</span>
                            <AlertTriangle className="h-6 w-6 animate-bounce" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 text-blue-900">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div className="flex items-start space-x-3">
                                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 animate-pulse"></div>
                                <p>All login attempts are <strong className="text-blue-700">RECORDED</strong> and monitored by hospital security</p>
                            </div>
                            <div className="flex items-start space-x-3">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 animate-pulse"></div>
                                <p>Unauthorized access attempts trigger <strong className="text-blue-700">IMMEDIATE ALERTS</strong></p>
                            </div>
                            <div className="flex items-start space-x-3">
                                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 animate-pulse"></div>
                                <p>Your IP address and device information are being <strong className="text-blue-700">LOGGED</strong></p>
                            </div>
                            <div className="flex items-start space-x-3">
                                <div className="w-2 h-2 bg-blue-700 rounded-full mt-2 animate-pulse"></div>
                                <p>Session activity monitored for <strong className="text-blue-700">COMPLIANCE</strong> and audit purposes</p>
                            </div>
                        </div>

                        <div className="mt-4 p-3 bg-blue-100/50 border border-blue-500/30 rounded-lg">
                            <p className="text-xs text-blue-800 text-center font-medium">
                                ⚖️ Unauthorized access is a <strong>CRIMINAL OFFENSE</strong> under healthcare privacy laws ⚖️
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Main Login Card - Grid Layout */}
                <Card className="shadow-2xl border-2 border-blue-300 bg-white/98 backdrop-blur-md mb-8 relative z-20" style={{ boxShadow: '0 25px 50px rgba(0,0,0,0.2)' }}>
                    <CardHeader className="bg-gradient-to-r from-blue-700 to-blue-800 text-white rounded-t-lg">
                        <CardTitle className="text-center text-2xl flex items-center justify-center space-x-2">
                            <Lock className="h-8 w-8" />
                            <span>SELECT AUTHORIZED ROLE</span>
                        </CardTitle>
                        <div className="flex justify-center mt-4">
                            <div className="w-48">
                                <LanguageSelector />
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-8">
                        <p className="text-center text-blue-900 mb-8 font-medium text-lg">
                            🔐 Choose your authorized staff category for secure system access
                        </p>

                        {/* Role Buttons Grid - Better Layout */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Admin Login Button */}
                            <div className="flex flex-col items-center">
                                <button
                                    className="group w-full h-48 bg-gradient-to-br from-white/95 via-blue-50/90 to-blue-100/85 hover:from-blue-50/95 hover:via-blue-50/90 hover:to-blue-100/85 border-2 border-blue-400/70 hover:border-blue-500/90 rounded-xl p-6 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-2xl backdrop-blur-sm relative z-20 flex flex-col justify-center"
                                    onClick={() => setLocation("/admin-login")}
                                    data-testid="admin-login-button"
                                    style={{
                                        boxShadow: '0 20px 40px rgba(0,0,0,0.25), 0 10px 25px rgba(59, 130, 246, 0.4), inset 0 1px 0 rgba(255,255,255,0.8)',
                                        background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(219, 234, 254, 0.9) 50%, rgba(199, 210, 254, 0.85) 100%)'
                                    }}
                                >
                                    <Shield className="h-12 w-12 mb-3 text-blue-600 mx-auto group-hover:text-blue-700 transition-colors" />
                                    <div className="text-center">
                                        <div className="font-bold text-lg text-blue-900 mb-1">🛡️ ADMINISTRATOR</div>
                                        <div className="text-sm text-blue-700 mb-1">Maximum Security Access</div>
                                        <div className="text-xs text-blue-600 font-medium bg-blue-100 px-2 py-1 rounded-md inline-block">Registration + Security Code</div>
                                    </div>
                                </button>
                            </div>

                            {/* Doctor Login Button */}
                            <div className="flex flex-col items-center">
                                <button
                                    className="group w-full h-48 bg-gradient-to-br from-white/95 via-blue-50/90 to-blue-100/85 hover:from-blue-50/95 hover:via-blue-50/90 hover:to-blue-100/85 border-2 border-blue-400/70 hover:border-blue-500/90 rounded-xl p-6 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-2xl backdrop-blur-sm relative z-20 flex flex-col justify-center"
                                    onClick={() => setLocation("/doctor-login")}
                                    data-testid="doctor-login-button"
                                    style={{
                                        boxShadow: '0 20px 40px rgba(0,0,0,0.25), 0 10px 25px rgba(59, 130, 246, 0.4), inset 0 1px 0 rgba(255,255,255,0.8)',
                                        background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(219, 234, 254, 0.9) 50%, rgba(199, 210, 254, 0.85) 100%)'
                                    }}
                                >
                                    <Stethoscope className="h-12 w-12 mb-3 text-blue-600 mx-auto group-hover:text-blue-700 transition-colors" />
                                    <div className="text-center">
                                        <div className="font-bold text-lg text-blue-900 mb-1">👨‍⚕️ MEDICAL DOCTOR</div>
                                        <div className="text-sm text-blue-700 mb-1">Clinical Systems Access</div>
                                        <div className="text-xs text-blue-600 font-medium bg-blue-100 px-2 py-1 rounded-md inline-block">Identity + Department + Session</div>
                                    </div>
                                </button>
                            </div>

                            {/* Reception Login Button */}
                            <div className="flex flex-col items-center">
                                <button
                                    className="group w-full h-48 bg-gradient-to-br from-white/95 via-blue-50/90 to-blue-100/85 hover:from-blue-50/95 hover:via-blue-50/90 hover:to-blue-100/85 border-2 border-blue-400/70 hover:border-blue-500/90 rounded-xl p-6 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-2xl backdrop-blur-sm relative z-20 flex flex-col justify-center"
                                    onClick={() => setLocation("/reception-login")}
                                    data-testid="reception-login-button"
                                    style={{
                                        boxShadow: '0 20px 40px rgba(0,0,0,0.25), 0 10px 25px rgba(59, 130, 246, 0.4), inset 0 1px 0 rgba(255,255,255,0.8)',
                                        background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(219, 234, 254, 0.9) 50%, rgba(199, 210, 254, 0.85) 100%)'
                                    }}
                                >
                                    <Users className="h-12 w-12 mb-3 text-blue-600 mx-auto group-hover:text-blue-700 transition-colors" />
                                    <div className="text-center">
                                        <div className="font-bold text-lg text-blue-900 mb-1">🏥 RECEPTION STAFF</div>
                                        <div className="text-sm text-blue-700 mb-1">Front Desk Services</div>
                                        <div className="text-xs text-blue-600 font-medium bg-blue-100 px-2 py-1 rounded-md inline-block">Staff ID + Shift Selection</div>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Activity Monitor */}
                        <div className="mt-8 p-4 bg-blue-700/50 border border-blue-500/30 rounded-lg">
                            <div className="flex items-center justify-center space-x-2 text-blue-100 text-sm">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                <span>System Status: ACTIVE MONITORING</span>
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            </div>
                            <p className="text-center text-blue-200 text-xs mt-2">
                                Your access attempt is being recorded • IP: <span className="font-mono text-blue-300">TRACKED</span> •
                                Time: <span className="font-mono text-blue-300">{currentTime.toLocaleTimeString()}</span>
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Footer - Monitoring Notice */}
                <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-blue-900/95 via-blue-800/95 to-blue-900/95 backdrop-blur-sm border-t-2 border-blue-500/50 z-50">
                    <div className="container mx-auto px-6 py-3">
                        <div className="flex items-center justify-center space-x-4 text-center">
                            <div className="flex items-center space-x-2">
                                <Eye className="h-5 w-5 text-blue-300 animate-pulse" />
                                <Camera className="h-5 w-5 text-blue-300 animate-pulse" />
                            </div>
                            <div className="text-white">
                                <p className="text-sm font-bold">
                                    ⚠️ YOUR ACTIVITY IS BEING MONITORED AND RECORDED ⚠️
                                </p>
                                <p className="text-xs text-blue-200 mt-1">
                                    All access attempts, keystrokes, and session data are logged for security and compliance purposes.
                                    Unauthorized access will result in immediate legal action.
                                </p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Shield className="h-5 w-5 text-blue-300 animate-pulse" />
                                <Lock className="h-5 w-5 text-blue-300 animate-pulse" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Spacer */}
                <div className="h-20"></div>

                {/* Return Home Button */}
                <div className="text-center mb-8">
                    <Button
                        variant="ghost"
                        onClick={() => setLocation("/")}
                        data-testid="link-home"
                        className="text-blue-800 hover:text-blue-900 hover:bg-blue-100 border border-blue-300 px-8 py-3"
                    >
                        ← Return to Public Homepage
                    </Button>
                </div>
            </div>
        </div>
    );
}