import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { apiRequest } from "../../lib/queryClient";
import { queueService } from "../../services/api";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { toast } from "../../hooks/use-toast";
import {
    Users,
    AlertTriangle,
    Clock,
    RefreshCw,
    TrendingUp,
    CheckCircle,
    XCircle,
    User,
    Stethoscope,
    Heart,
    Activity
} from "lucide-react";
import { QueueEntry, User as UserType } from "../../types/schema";

// Mock queue data
const mockQueue: QueueEntry[] = [
    {
        id: "1",
        patientId: "patient1",
        doctorId: "doctor1",
        position: 1,
        estimatedWaitTime: 15,
        status: "waiting",
        priority: "urgent",
        createdAt: new Date(),
        symptoms: "Severe chest pain and shortness of breath",
        medicalHistory: "Previous heart condition",
        lastVisit: new Date("2023-05-15"),
        bloodType: "O+",
        age: 52,
        gender: "male"
    },
    {
        id: "2",
        patientId: "patient2",
        doctorId: "doctor1",
        position: 2,
        estimatedWaitTime: 30,
        status: "waiting",
        priority: "normal",
        createdAt: new Date(Date.now() - 3600000),
        symptoms: "Persistent headache and dizziness",
        medicalHistory: "Migraine history",
        lastVisit: new Date("2023-06-20"),
        bloodType: "A-",
        age: 34,
        gender: "female"
    },
    {
        id: "3",
        patientId: "patient3",
        doctorId: "doctor1",
        position: 3,
        estimatedWaitTime: 45,
        status: "waiting",
        priority: "normal",
        createdAt: new Date(Date.now() - 7200000),
        symptoms: "Joint pain and stiffness",
        medicalHistory: "Arthritis",
        lastVisit: new Date("2023-04-10"),
        bloodType: "B+",
        age: 67,
        gender: "male"
    },
    {
        id: "4",
        patientId: "patient4",
        doctorId: "doctor1",
        position: 4,
        estimatedWaitTime: 60,
        status: "waiting",
        priority: "critical",
        createdAt: new Date(Date.now() - 10800000),
        symptoms: "High fever and difficulty breathing",
        medicalHistory: "Asthma",
        lastVisit: new Date("2023-07-01"),
        bloodType: "AB+",
        age: 28,
        gender: "female"
    },
    {
        id: "5",
        patientId: "patient5",
        doctorId: "doctor1",
        position: 5,
        estimatedWaitTime: 75,
        status: "waiting",
        priority: "normal",
        createdAt: new Date(Date.now() - 14400000),
        symptoms: "Abdominal pain and nausea",
        medicalHistory: "Gastritis",
        lastVisit: new Date("2023-03-22"),
        bloodType: "O-",
        age: 41,
        gender: "male"
    },
    // Additional mock appointments from waitlist
    {
        id: "6",
        patientId: "patient6",
        doctorId: "doctor1",
        position: 6,
        estimatedWaitTime: 90,
        status: "waiting",
        priority: "urgent",
        createdAt: new Date(Date.now() - 18000000),
        symptoms: "Severe back pain",
        medicalHistory: "Herniated disc",
        lastVisit: new Date("2023-02-15"),
        bloodType: "A+",
        age: 38,
        gender: "female"
    },
    {
        id: "7",
        patientId: "patient7",
        doctorId: "doctor1",
        position: 7,
        estimatedWaitTime: 105,
        status: "waiting",
        priority: "normal",
        createdAt: new Date(Date.now() - 21600000),
        symptoms: "Persistent cough",
        medicalHistory: "Chronic bronchitis",
        lastVisit: new Date("2023-01-10"),
        bloodType: "B-",
        age: 55,
        gender: "male"
    }
];

// Mock user data
const mockUsers: UserType[] = [
    {
        id: "patient1",
        name: "Rajesh Kumar",
        email: "rajesh.kumar@example.com",
        role: "patient",
        username: "rajeshk",
        age: 52,
        gender: "male"
    },
    {
        id: "patient2",
        name: "Priya Sharma",
        email: "priya.sharma@example.com",
        role: "patient",
        username: "priyas",
        age: 34,
        gender: "female"
    },
    {
        id: "patient3",
        name: "Amit Patel",
        email: "amit.patel@example.com",
        role: "patient",
        username: "amitp",
        age: 67,
        gender: "male"
    },
    {
        id: "patient4",
        name: "Sunita Verma",
        email: "sunita.verma@example.com",
        role: "patient",
        username: "sunitav",
        age: 28,
        gender: "female"
    },
    {
        id: "patient5",
        name: "Vikram Singh",
        email: "vikram.singh@example.com",
        role: "patient",
        username: "vikrams",
        age: 41,
        gender: "male"
    },
    {
        id: "patient6",
        name: "Anjali Reddy",
        email: "anjali.reddy@example.com",
        role: "patient",
        username: "anjalir",
        age: 38,
        gender: "female"
    },
    {
        id: "patient7",
        name: "Ramesh Gupta",
        email: "ramesh.gupta@example.com",
        role: "patient",
        username: "rameshg",
        age: 55,
        gender: "male"
    }
];

export default function DoctorQueuePage() {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [filterPriority, setFilterPriority] = useState("all");

    // Fetch queue data (using mock data for demo)
    const { data: queue = [], isLoading, isError } = useQuery<QueueEntry[]>({
        queryKey: ["/api/queue", user?.id],
        queryFn: async () => {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500));
            // Return mock data
            return mockQueue;
        },
        staleTime: 30 * 1000, // 30 seconds
    });

    // Fetch user data for queue entries (using mock data for demo)
    const { data: users = [] } = useQuery<UserType[]>({
        queryKey: ["/api/users"],
        queryFn: async () => {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 300));
            // Return mock data
            return mockUsers;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        enabled: queue.length > 0
    });

    // Combine queue and user data
    const queueWithUsers = queue.map(entry => {
        const user = users.find(u => u.id === entry.patientId);
        return { ...entry, ...user };
    });

    // Filter queue based on priority
    const filteredQueue = queueWithUsers.filter(entry => {
        return filterPriority === "all" || entry.priority === filterPriority;
    });

    // Sort by position
    const sortedQueue = [...filteredQueue].sort((a, b) => a.position - b.position);

    // Mutation for calling next patient
    const callNextMutation = useMutation({
        mutationFn: async () => {
            // In a real implementation, this would call the API to call the next patient
            // For now, we'll just show a success message
            return { success: true };
        },
        onSuccess: () => {
            toast({
                title: "Success",
                description: "Next patient has been called",
                className: "bg-green-50 border-green-200 text-green-800"
            });
            queryClient.invalidateQueries({ queryKey: ["/api/queue", user?.id] });
        },
        onError: () => {
            toast({
                title: "Error",
                description: "Failed to call next patient",
                variant: "destructive"
            });
        }
    });

    // Mutation for removing patient from queue
    const removeFromQueueMutation = useMutation({
        mutationFn: async (entryId: string) => {
            const response = await apiRequest("DELETE", `/api/queue/${entryId}`);
            return response.json();
        },
        onSuccess: () => {
            toast({
                title: "Success",
                description: "Patient removed from queue",
                className: "bg-green-50 border-green-200 text-green-800"
            });
            queryClient.invalidateQueries({ queryKey: ["/api/queue", user?.id] });
        },
        onError: () => {
            toast({
                title: "Error",
                description: "Failed to remove patient from queue",
                variant: "destructive"
            });
        }
    });

    const handleRefresh = () => {
        queryClient.invalidateQueries({ queryKey: ["/api/queue", user?.id] });
        queryClient.invalidateQueries({ queryKey: ["/api/users"] });
        toast({
            title: "Refreshed",
            description: "Queue has been updated",
            className: "bg-blue-50 border-blue-200 text-blue-800"
        });
    };

    const handleCallNext = () => {
        callNextMutation.mutate();
    };

    const handleRemoveFromQueue = (entryId: string) => {
        removeFromQueueMutation.mutate(entryId);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <div className="flex flex-col items-center">
                    <Activity className="h-12 w-12 text-red-500 mb-4" />
                    <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Data</h3>
                    <p className="text-red-600 mb-4">There was an issue loading the queue.</p>
                    <Button
                        onClick={handleRefresh}
                        className="bg-red-600 hover:bg-red-700 text-white"
                    >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Try Again
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-blue-900">Patient Queue Management</h2>
                    <p className="text-gray-600">Manage and monitor your patient queue</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                        onClick={handleCallNext}
                        disabled={callNextMutation.isPending}
                        className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center"
                    >
                        <Users className="h-4 w-4 mr-2" />
                        {callNextMutation.isPending ? "Calling..." : "Call Next Patient"}
                    </Button>
                    <Button
                        onClick={handleRefresh}
                        variant="outline"
                        className="border-blue-300 text-blue-700 hover:bg-blue-100 hover:shadow-md transition-all duration-200 flex items-center"
                    >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Queue Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="border-2 border-blue-200 bg-gradient-to-br from-white to-blue-50 shadow-md">
                    <CardContent className="p-4">
                        <div className="flex items-center">
                            <Users className="h-8 w-8 text-blue-600" />
                            <div className="ml-3">
                                <p className="text-sm text-gray-600">Total in Queue</p>
                                <p className="text-2xl font-bold text-blue-900">{sortedQueue.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-2 border-amber-200 bg-gradient-to-br from-white to-amber-50 shadow-md">
                    <CardContent className="p-4">
                        <div className="flex items-center">
                            <AlertTriangle className="h-8 w-8 text-amber-600" />
                            <div className="ml-3">
                                <p className="text-sm text-gray-600">Urgent Cases</p>
                                <p className="text-2xl font-bold text-amber-900">
                                    {sortedQueue.filter(q => q.priority === "urgent").length}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-2 border-red-200 bg-gradient-to-br from-white to-red-50 shadow-md">
                    <CardContent className="p-4">
                        <div className="flex items-center">
                            <Heart className="h-8 w-8 text-red-600" />
                            <div className="ml-3">
                                <p className="text-sm text-gray-600">Critical Cases</p>
                                <p className="text-2xl font-bold text-red-900">
                                    {sortedQueue.filter(q => q.priority === "critical").length}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-2 border-green-200 bg-gradient-to-br from-white to-green-50 shadow-md">
                    <CardContent className="p-4">
                        <div className="flex items-center">
                            <Clock className="h-8 w-8 text-green-600" />
                            <div className="ml-3">
                                <p className="text-sm text-gray-600">Avg. Wait Time</p>
                                <p className="text-2xl font-bold text-green-900">
                                    {sortedQueue.length > 0
                                        ? Math.round(sortedQueue.reduce((sum, q) => sum + (q.estimatedWaitTime || 0), 0) / sortedQueue.length)
                                        : 0} min
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filter Section */}
            <Card className="border-2 border-blue-200 bg-gradient-to-br from-white to-blue-50 shadow-md">
                <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex gap-2">
                            <select
                                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={filterPriority}
                                onChange={(e) => setFilterPriority(e.target.value)}
                            >
                                <option value="all">All Priorities</option>
                                <option value="normal">Normal</option>
                                <option value="urgent">Urgent</option>
                                <option value="critical">Critical</option>
                            </select>
                            <Button
                                variant="outline"
                                className="border-gray-300 text-gray-700 hover:bg-gray-100"
                                onClick={() => setFilterPriority("all")}
                            >
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Clear
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Queue List */}
            {sortedQueue.length === 0 ? (
                <Card className="border-2 border-blue-200 bg-gradient-to-br from-white to-blue-50 shadow-md">
                    <CardContent className="py-12 text-center">
                        <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Queue is Empty</h3>
                        <p className="text-gray-600 mb-4">No patients are currently in the queue</p>
                        <Button
                            onClick={handleRefresh}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Refresh Queue
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {sortedQueue.map((entry) => (
                        <Card
                            key={entry.id}
                            className="border-2 border-blue-200 bg-white shadow-md hover:shadow-xl transition-all duration-300"
                        >
                            {/* Desktop view */}
                            <div className="hidden md:block p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                                        <span className="text-blue-800 font-bold">{entry.position}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900 truncate">{entry.name}</h3>
                                                <p className="text-sm text-gray-600">{entry.symptoms}</p>
                                            </div>
                                            <Badge
                                                variant="outline"
                                                className={`${entry.priority === "critical"
                                                        ? "bg-red-100 text-red-800 border-red-300"
                                                        : entry.priority === "urgent"
                                                            ? "bg-amber-100 text-amber-800 border-amber-300"
                                                            : "bg-green-100 text-green-800 border-green-300"
                                                    }`}
                                            >
                                                {entry.priority}
                                            </Badge>
                                        </div>
                                        <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-600">
                                            <div className="flex items-center">
                                                <User className="h-4 w-4 mr-1 text-blue-500" />
                                                <span>{entry.age} years, {entry.gender}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <Heart className="h-4 w-4 mr-1 text-blue-500" />
                                                <span>{entry.bloodType}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <Clock className="h-4 w-4 mr-1 text-blue-500" />
                                                <span>{entry.estimatedWaitTime} min</span>
                                            </div>
                                            <div className="flex items-center">
                                                <Stethoscope className="h-4 w-4 mr-1 text-blue-500" />
                                                <span>Last visit: {new Date(entry.lastVisit).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-700">
                                                <span className="font-medium">Medical History:</span> {entry.medicalHistory}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2 ml-4">
                                        <Button
                                            onClick={() => handleCallNext()}
                                            className="bg-green-600 hover:bg-green-700 text-white"
                                        >
                                            <CheckCircle className="h-4 w-4 mr-1" />
                                            Call
                                        </Button>
                                        <Button
                                            onClick={() => handleRemoveFromQueue(entry.id)}
                                            variant="outline"
                                            className="border-red-300 text-red-700 hover:bg-red-100"
                                        >
                                            <XCircle className="h-4 w-4 mr-1" />
                                            Remove
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Mobile view */}
                            <div className="md:hidden p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                            <span className="text-blue-800 font-bold text-sm">{entry.position}</span>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900">{entry.name}</h3>
                                            <p className="text-xs text-gray-600">{entry.symptoms}</p>
                                        </div>
                                    </div>
                                    <Badge
                                        variant="outline"
                                        className={`text-xs ${entry.priority === "critical"
                                                ? "bg-red-100 text-red-800 border-red-300"
                                                : entry.priority === "urgent"
                                                    ? "bg-amber-100 text-amber-800 border-amber-300"
                                                    : "bg-green-100 text-green-800 border-green-300"
                                            }`}
                                    >
                                        {entry.priority}
                                    </Badge>
                                </div>

                                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-3">
                                    <div className="flex items-center">
                                        <User className="h-3 w-3 mr-1 text-blue-500" />
                                        <span>{entry.age}y, {entry.gender}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Heart className="h-3 w-3 mr-1 text-blue-500" />
                                        <span>{entry.bloodType}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Clock className="h-3 w-3 mr-1 text-blue-500" />
                                        <span>{entry.estimatedWaitTime} min</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Stethoscope className="h-3 w-3 mr-1 text-blue-500" />
                                        <span>Last: {new Date(entry.lastVisit).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                <p className="text-xs text-gray-700 mb-3 line-clamp-2">
                                    <span className="font-medium">History:</span> {entry.medicalHistory}
                                </p>

                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        onClick={() => handleCallNext()}
                                        className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs py-1 px-2 h-8"
                                    >
                                        <CheckCircle className="h-3 w-3 mr-1" />
                                        Call
                                    </Button>
                                    <Button
                                        size="sm"
                                        onClick={() => handleRemoveFromQueue(entry.id)}
                                        variant="outline"
                                        className="flex-1 border-red-300 text-red-700 hover:bg-red-100 text-xs py-1 px-2 h-8"
                                    >
                                        <XCircle className="h-3 w-3 mr-1" />
                                        Remove
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}