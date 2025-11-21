import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "../../lib/queryClient";
import { queueService } from "../../services/api";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { toast } from "../../hooks/use-toast";
import {
    Users,
    Calendar,
    AlertTriangle,
    Clock,
    Activity,
    UserCheck,
    TrendingUp,
    CheckCircle,
    Home,
    Settings,
    LogOut,
    Bell,
    Search,
    BarChart3,
    MessageCircle,
    Cog,
    Download,
    Plus,
    User,
    BookOpen,
    Phone,
    Mail,
    MapPin,
    Cake,
    UserPlus,
    Menu,
    X,
    Stethoscope,
    Heart,
    Thermometer,
    Scale,
    FileText,
    Pill,
    Dna,
    Zap,
    Upload,
    Lock
} from "lucide-react";
import { Appointment, QueueEntry, Attendance, User as UserType } from "../../types/schema";

export default function DoctorOverviewPage() {
    const { user } = useAuth();
    const { t, language } = useLanguage();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [currentTime, setCurrentTime] = useState(new Date());
    const [profileImage, setProfileImage] = useState<string | null>(user?.profileImage || null);

    // Mock patient data with 5 male and 5 female patients
    const mockPatients: UserType[] = [
        // Male patients
        {
            id: "pat-001",
            username: "rohit_sharma",
            role: "patient",
            name: "Rohit Sharma",
            email: "rohit.sharma@example.com",
            age: 35,
            gender: "male",
            bloodGroup: "O+",
            phone: "+91 98765 43210",
            address: "Mumbai, Maharashtra"
        },
        {
            id: "pat-002",
            username: "arjun_patel",
            role: "patient",
            name: "Arjun Patel",
            email: "arjun.patel@example.com",
            age: 28,
            gender: "male",
            bloodGroup: "A+",
            phone: "+91 98765 43211",
            address: "Ahmedabad, Gujarat"
        },
        {
            id: "pat-003",
            username: "vikram_singh",
            role: "patient",
            name: "Vikram Singh",
            email: "vikram.singh@example.com",
            age: 42,
            gender: "male",
            bloodGroup: "B+",
            phone: "+91 98765 43212",
            address: "Delhi, India"
        },
        {
            id: "pat-004",
            username: "rahul_mehra",
            role: "patient",
            name: "Rahul Mehra",
            email: "rahul.mehra@example.com",
            age: 31,
            gender: "male",
            bloodGroup: "AB+",
            phone: "+91 98765 43213",
            address: "Chandigarh, Punjab"
        },
        {
            id: "pat-005",
            username: "sumit_kumar",
            role: "patient",
            name: "Sumit Kumar",
            email: "sumit.kumar@example.com",
            age: 26,
            gender: "male",
            bloodGroup: "O-",
            phone: "+91 98765 43214",
            address: "Kolkata, West Bengal"
        },
        // Female patients
        {
            id: "pat-006",
            username: "priya_verma",
            role: "patient",
            name: "Priya Verma",
            email: "priya.verma@example.com",
            age: 30,
            gender: "female",
            bloodGroup: "A-",
            phone: "+91 98765 43215",
            address: "Bangalore, Karnataka"
        },
        {
            id: "pat-007",
            username: "ananya_gupta",
            role: "patient",
            name: "Ananya Gupta",
            email: "ananya.gupta@example.com",
            age: 24,
            gender: "female",
            bloodGroup: "B-",
            phone: "+91 98765 43216",
            address: "Pune, Maharashtra"
        },
        {
            id: "pat-008",
            username: "sneha_reddy",
            role: "patient",
            name: "Sneha Reddy",
            email: "sneha.reddy@example.com",
            age: 29,
            gender: "female",
            bloodGroup: "AB-",
            phone: "+91 98765 43217",
            address: "Hyderabad, Telangana"
        },
        {
            id: "pat-009",
            username: "poonam_shah",
            role: "patient",
            name: "Poonam Shah",
            email: "poonam.shah@example.com",
            age: 33,
            gender: "female",
            bloodGroup: "O+",
            phone: "+91 98765 43218",
            address: "Chennai, Tamil Nadu"
        },
        {
            id: "pat-010",
            username: "kriti_jain",
            role: "patient",
            name: "Kriti Jain",
            email: "kriti.jain@example.com",
            age: 27,
            gender: "female",
            bloodGroup: "A+",
            phone: "+91 98765 43219",
            address: "Jaipur, Rajasthan"
        }
    ];

    // Mock appointments data
    const mockAppointments: Appointment[] = [
        {
            id: "apt-001",
            patientId: "pat-001", // Rohit Sharma
            doctorId: user?.id,
            scheduledAt: new Date(new Date().setHours(10, 30)),
            status: "scheduled",
            priority: "normal",
            symptoms: "Back pain and stiffness"
        },
        {
            id: "apt-002",
            patientId: "pat-002", // Arjun Patel
            doctorId: user?.id,
            scheduledAt: new Date(new Date().setHours(11, 15)),
            status: "scheduled",
            priority: "urgent",
            symptoms: "Chronic neck pain"
        },
        {
            id: "apt-003",
            patientId: "pat-003", // Vikram Singh
            doctorId: user?.id,
            scheduledAt: new Date(new Date().setHours(14, 0)),
            status: "scheduled",
            priority: "critical",
            symptoms: "Severe headache and dizziness"
        },
        {
            id: "apt-004",
            patientId: "pat-004", // Rahul Mehra
            doctorId: user?.id,
            scheduledAt: new Date(new Date().setHours(15, 30)),
            status: "scheduled",
            priority: "normal",
            symptoms: "Stress and anxiety"
        },
        {
            id: "apt-005",
            patientId: "pat-005", // Sumit Kumar
            doctorId: user?.id,
            scheduledAt: new Date(new Date().setDate(new Date().getDate() + 1)),
            status: "scheduled",
            priority: "normal",
            symptoms: "Joint pain"
        }
    ];

    // Mock queue data
    const mockQueue: QueueEntry[] = [
        {
            id: "queue-001",
            patientId: "pat-006", // Priya Verma
            doctorId: user?.id,
            position: 1,
            estimatedWaitTime: 15,
            status: "waiting",
            priority: "urgent"
        },
        {
            id: "queue-002",
            patientId: "pat-003", // Vikram Singh
            doctorId: user?.id,
            position: 2,
            estimatedWaitTime: 30,
            status: "waiting",
            priority: "normal"
        },
        {
            id: "queue-003",
            patientId: "pat-008", // Sneha Reddy
            doctorId: user?.id,
            position: 3,
            estimatedWaitTime: 45,
            status: "waiting",
            priority: "critical"
        },
        {
            id: "queue-004",
            patientId: "pat-001", // Rohit Sharma
            doctorId: user?.id,
            position: 4,
            estimatedWaitTime: 60,
            status: "waiting",
            priority: "normal"
        },
        {
            id: "queue-005",
            patientId: "pat-009", // Poonam Shah
            doctorId: user?.id,
            position: 5,
            estimatedWaitTime: 75,
            status: "waiting",
            priority: "urgent"
        }
    ];

    // Mock attendance data
    const mockAttendance: Attendance[] = [
        {
            id: "att-001",
            userId: user?.id,
            date: new Date(),
            checkIn: new Date(new Date().setHours(9, 0)),
            status: "present",
            location: "consulting",
            totalHours: "8"
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    // Update profile image when user changes
    useEffect(() => {
        setProfileImage(user?.profileImage || null);
    }, [user]);

    const { data: todaysAppointments = [] } = useQuery<Appointment[]>({
        queryKey: ["/api/appointments/doctor", user?.id],
        queryFn: async () => {
            const response = await apiRequest("GET", `/api/appointments/doctor/${user?.id}`);
            return response.json();
        }
    });

    // Fetch patient data for appointments
    const { data: patientsData = [] } = useQuery<UserType[]>({
        queryKey: ["/api/users"],
        queryFn: async () => {
            const response = await apiRequest("GET", "/api/users?role=patient");
            return response.json();
        },
        enabled: !!user?.id
    });

    const { data: myQueue = [] } = useQuery<QueueEntry[]>({
        queryKey: ["/api/queue/doctor", user?.id],
        queryFn: async () => {
            const response = await apiRequest("GET", `/api/queue/doctor/${user?.id}?status=waiting`);
            return response.json();
        }
    });

    const { data: myAttendance = [] } = useQuery<Attendance[]>({
        queryKey: ["/api/attendance/user", user?.id],
        queryFn: async () => {
            const response = await apiRequest("GET", `/api/attendance/user/${user?.id}`);
            return response.json();
        }
    });

    const updateAttendanceMutation = useMutation({
        mutationFn: async (status: string) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const existingAttendance = (myAttendance as Attendance[]).find((att: Attendance) => {
                const attDate = new Date(att.date);
                attDate.setHours(0, 0, 0, 0);
                return attDate.getTime() === today.getTime();
            });

            if (existingAttendance) {
                return apiRequest("PUT", `/api/attendance/${existingAttendance.id}`, {
                    status,
                    location: status
                });
            } else {
                return apiRequest("POST", "/api/attendance", {
                    userId: user?.id,
                    date: new Date(),
                    status: "present",
                    location: status,
                    checkIn: new Date()
                });
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/attendance/user", user?.id] });
        }
    });

    // Mutation to update queue entry (complete session)
    const updateQueueMutation = useMutation({
        mutationFn: async ({ queueId, status }: { queueId: string, status: string }) => {
            return queueService.update(queueId, { status });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/queue"] });
            queryClient.invalidateQueries({ queryKey: ["/api/queue/doctor", user?.id] });
            toast({
                title: "Success",
                description: "Patient session completed and removed from queue"
            });
        },
        onError: () => {
            toast({
                title: "Error",
                description: "Failed to complete patient session",
                variant: "destructive"
            });
        }
    });

    // Get patient name by ID
    const getPatientName = (patientId?: string) => {
        if (!patientId) return "Unknown Patient";
        const patient = patientsData.find(p => p.id === patientId);
        return patient ? patient.name : "Unknown Patient";
    };

    // Complete patient session
    const completePatientSession = (queueId: string) => {
        updateQueueMutation.mutate({ queueId, status: "completed" });
    };

    const todaysPatients = (todaysAppointments as Appointment[]).length;
    const criticalCases = (myQueue as QueueEntry[]).filter((q: QueueEntry) => q.priority === "critical").length;

    // Find today's attendance first
    const todaysAttendance = (myAttendance as Attendance[]).find((att: Attendance) => {
        const today = new Date();
        const attDate = new Date(att.date);
        return attDate.toDateString() === today.toDateString();
    });

    // Calculate shift progress based on attendance data
    const calculateShiftProgress = () => {
        if (!todaysAttendance) return 0;

        const checkInTime = new Date(todaysAttendance.checkIn);
        const now = new Date();
        const shiftStart = new Date(now);
        shiftStart.setHours(9, 0, 0, 0); // Assuming 9 AM shift start

        const totalShiftHours = 8; // 8-hour shift
        const hoursWorked = (now.getTime() - checkInTime.getTime()) / (1000 * 60 * 60);
        const progress = Math.min(100, Math.max(0, (hoursWorked / totalShiftHours) * 100));

        return Math.round(progress);
    };

    const shiftProgress = calculateShiftProgress();

    return (
        <div className="space-y-8 fade-in" data-testid="doctor-dashboard">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Doctor Dashboard</h1>
                <p className="text-gray-600">Manage your patients and appointments efficiently</p>
            </div>

            {/* Stats Cards with Enhanced Styling */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-l-4 border-l-blue-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white cursor-pointer transform hover:scale-[1.02] border-2 border-gray-200">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">Today's Appointments</p>
                                <p className="text-3xl font-bold text-gray-900">{todaysPatients}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Calendar className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm">
                            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                            <span className="text-green-600">All scheduled</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-amber-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white cursor-pointer transform hover:scale-[1.02] border-2 border-gray-200">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">Patients in Queue</p>
                                <p className="text-3xl font-bold text-gray-900">{myQueue.length}</p>
                            </div>
                            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                                <Users className="h-6 w-6 text-amber-600" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm">
                            <Clock className="h-4 w-4 text-gray-500 mr-1" />
                            <span className="text-gray-600">Avg. wait: 25 min</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white cursor-pointer transform hover:scale-[1.02] border-2 border-gray-200">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">Critical Cases</p>
                                <p className="text-3xl font-bold text-red-600">{criticalCases}</p>
                            </div>
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                <AlertTriangle className="h-6 w-6 text-purple-600" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <span className="text-red-600 text-sm font-medium">
                                {criticalCases > 0 ? "Requires attention" : "All stable"}
                            </span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white cursor-pointer transform hover:scale-[1.02] border-2 border-gray-200">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">Shift Progress</p>
                                <p className="text-3xl font-bold text-gray-900">{shiftProgress}%</p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <UserCheck className="h-6 w-6 text-green-600" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-green-600 h-2 rounded-full"
                                    style={{ width: `${shiftProgress}%` }}
                                ></div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Today's Appointments */}
                <Card className="border-t-4 border-t-blue-500 hover:shadow-xl transition-all duration-300 bg-white border-2 border-gray-200">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Calendar className="h-5 w-5 text-blue-600" />
                                <span>Today's Appointments</span>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                className="border-blue-300 text-blue-700 hover:bg-blue-100"
                                onClick={() => navigate("/doctor/appointments")}
                            >
                                View All
                            </Button>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {todaysAppointments.length === 0 ? (
                                <p className="text-gray-500 text-center py-4">No appointments scheduled for today</p>
                            ) : (
                                (todaysAppointments as Appointment[]).slice(0, 3).map((apt: Appointment, index: number) => (
                                    <div
                                        key={apt.id || index}
                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
                                    >
                                        <div>
                                            <p className="font-medium text-gray-900">{getPatientName(apt.patientId)}</p>
                                            <p className="text-sm text-gray-600">
                                                {new Date(apt.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Badge
                                                variant={
                                                    apt.priority === "critical" ? "destructive" :
                                                        apt.priority === "urgent" ? "secondary" : "default"
                                                }
                                            >
                                                {apt.priority}
                                            </Badge>
                                            <Badge variant="outline">
                                                {apt.status}
                                            </Badge>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Patient Queue */}
                <Card className="border-t-4 border-t-amber-500 hover:shadow-xl transition-all duration-300 bg-white border-2 border-gray-200">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Users className="h-5 w-5 text-amber-600" />
                                <span>Current Patient Queue</span>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                className="border-amber-300 text-amber-700 hover:bg-amber-100"
                                onClick={() => navigate("/doctor/queue")}
                            >
                                Manage Queue
                            </Button>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {myQueue.length === 0 ? (
                                <p className="text-gray-500 text-center py-4">No patients in queue</p>
                            ) : (
                                (myQueue as QueueEntry[]).slice(0, 3).map((entry: QueueEntry, index: number) => (
                                    <div key={entry.id || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div>
                                            <p className="font-medium text-gray-900">#{entry.position} - {getPatientName(entry.patientId)}</p>
                                            <p className="text-sm text-gray-600">
                                                Wait time: {entry.estimatedWaitTime || 0} minutes
                                            </p>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Badge
                                                variant={
                                                    entry.priority === "critical" ? "destructive" :
                                                        entry.priority === "urgent" ? "secondary" : "default"
                                                }
                                            >
                                                {entry.priority}
                                            </Badge>
                                            <Badge variant="outline">
                                                {entry.status}
                                            </Badge>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Health Tips and Resources */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Health Tips Card */}
                <Card className="border-t-4 border-t-green-500 hover:shadow-xl transition-all duration-300 bg-white border-2 border-gray-200">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Heart className="h-5 w-5 text-green-600" />
                                <span>Health Tips</span>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                className="border-green-300 text-green-700 hover:bg-green-100"
                                onClick={() => navigate("/doctor/health-tips")}
                            >
                                View All Tips
                            </Button>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                                <h4 className="font-medium text-green-900">Stay Hydrated</h4>
                                <p className="text-sm text-green-700">Drink at least 8 glasses of water daily for optimal health.</p>
                            </div>
                            <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                                <h4 className="font-medium text-green-900">Regular Exercise</h4>
                                <p className="text-sm text-green-700">Aim for 30 minutes of moderate exercise 5 times a week.</p>
                            </div>
                            <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                                <h4 className="font-medium text-green-900">Balanced Diet</h4>
                                <p className="text-sm text-green-700">Include a variety of fruits, vegetables, whole grains, and lean proteins.</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Patient Education Card */}
                <Card className="border-t-4 border-t-blue-500 hover:shadow-xl transition-all duration-300 bg-white border-2 border-gray-200">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <BookOpen className="h-5 w-5 text-blue-600" />
                                <span>Patient Education</span>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                className="border-blue-300 text-blue-700 hover:bg-blue-100"
                                onClick={() => navigate("/doctor/health-tips")}
                            >
                                Browse Resources
                            </Button>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                                <h4 className="font-medium text-blue-900">Understanding Blood Pressure</h4>
                                <p className="text-sm text-blue-700">Learn about normal ranges and management techniques.</p>
                            </div>
                            <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                                <h4 className="font-medium text-blue-900">Diabetes Management</h4>
                                <p className="text-sm text-blue-700">Essential guidelines for controlling blood sugar levels.</p>
                            </div>
                            <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                                <h4 className="font-medium text-blue-900">Heart-Healthy Diet</h4>
                                <p className="text-sm text-blue-700">Dietary recommendations to support cardiovascular health.</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Attendance and Work Status */}
            <Card className="border-t-4 border-t-green-500 hover:shadow-xl transition-all duration-300 bg-white border-2 border-gray-200">
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <UserCheck className="h-5 w-5 text-green-600" />
                            <span>Work Status</span>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            className="border-green-300 text-green-700 hover:bg-green-100"
                            onClick={() => navigate("/doctor/attendance")}
                        >
                            Update Status
                        </Button>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="font-medium text-gray-900 mb-3">Today's Attendance</h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-foreground">Current Status</span>
                                    <Badge className="bg-green-500 text-white">
                                        {todaysAttendance?.location || "Consulting"}
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-foreground">Check-in Time</span>
                                    <span className="text-sm text-muted-foreground">
                                        {todaysAttendance?.checkIn ?
                                            new Date(todaysAttendance.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) :
                                            "N/A"}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-foreground">Lunch Break</span>
                                    <span className="text-sm text-muted-foreground">12:30 PM - 1:30 PM</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-foreground">Shift End</span>
                                    <span className="text-sm text-muted-foreground">6:00 PM</span>
                                </div>
                                <div className="pt-4">
                                    <div className="w-full bg-muted rounded-full h-2 mb-2">
                                        <div className="bg-green-500 h-2 rounded-full" style={{ width: `${shiftProgress}%` }}></div>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Shift Progress</span>
                                        <span>{shiftProgress}%</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 grid grid-cols-2 gap-3">
                                <Button
                                    variant="outline"
                                    className="border-green-300 text-green-700 hover:bg-green-100"
                                    onClick={() => updateAttendanceMutation.mutate("consulting")}
                                    disabled={updateAttendanceMutation.isPending}
                                >
                                    Consulting
                                </Button>
                                <Button
                                    variant="outline"
                                    className="border-green-300 text-green-700 hover:bg-green-100"
                                    onClick={() => updateAttendanceMutation.mutate("resting")}
                                    disabled={updateAttendanceMutation.isPending}
                                >
                                    Resting
                                </Button>
                                <Button
                                    variant="outline"
                                    className="border-green-300 text-green-700 hover:bg-green-100"
                                    onClick={() => updateAttendanceMutation.mutate("lunch")}
                                    disabled={updateAttendanceMutation.isPending}
                                >
                                    Lunch
                                </Button>
                                <Button
                                    variant="outline"
                                    className="border-green-300 text-green-700 hover:bg-green-100"
                                    onClick={() => updateAttendanceMutation.mutate("lab")}
                                    disabled={updateAttendanceMutation.isPending}
                                >
                                    Lab
                                </Button>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-medium text-gray-900 mb-3">Attendance History</h3>
                            <div className="space-y-3">
                                {(myAttendance as Attendance[]).slice(0, 3).map((attendance: Attendance, index: number) => (
                                    <div key={attendance.id || index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100">
                                        <div>
                                            <p className="font-medium text-green-900">
                                                {new Date(attendance.date).toLocaleDateString('en-US', {
                                                    weekday: 'short',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                            <p className="text-sm text-green-700">Total: {attendance.totalHours || "N/A"} hours</p>
                                        </div>
                                        <Badge
                                            variant={
                                                attendance.status === "present" ? "default" :
                                                    attendance.status === "absent" ? "destructive" :
                                                        "secondary"
                                            }
                                        >
                                            {attendance.status}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                            <Button variant="outline" className="w-full mt-4 border-green-300 text-green-700 hover:bg-green-100" onClick={() => navigate("/doctor/attendance")}>
                                View Full History
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}