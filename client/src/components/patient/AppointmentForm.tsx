import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { appointmentService, userService, patientService } from "../../services/api";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import { toast } from "../../hooks/use-toast";
import {
    ChevronLeft,
    ChevronRight,
    Calendar,
    Clock,
    User,
    Stethoscope,
    Users,
    FileText,
    Download,
    CheckCircle
} from "lucide-react";
import jsPDF from "jspdf";

interface AppointmentData {
    patientId: string;
    doctorId: string;
    scheduledAt: string;
    status: string;
    priority: string;
    symptoms: string;
    notes: string;
}

interface Doctor {
    id: string;
    name: string;
    department: string;
    specialization: string;
    isOnline: boolean;
}

export default function AppointmentForm({ onSuccess }: { onSuccess: () => void }) {
    const { user, patient, setPatient } = useAuth();
    const { t } = useLanguage();
    const queryClient = useQueryClient();

    // Form steps
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 5;

    // Form data
    const [appointmentData, setAppointmentData] = useState<AppointmentData>({
        patientId: patient?.id || "",
        doctorId: "",
        scheduledAt: new Date().toISOString(),
        status: "scheduled",
        priority: "normal",
        symptoms: "",
        notes: ""
    });

    // Ensure patient data is loaded
    useEffect(() => {
        if (user && user.role === 'patient' && !patient) {
            // Fetch patient data based on user ID
            const fetchPatientData = async () => {
                try {
                    const { data, error } = await patientService.getByUserId(user.id);
                    if (data && !error) {
                        setPatient(data);
                        localStorage.setItem("patient", JSON.stringify(data));
                        // Update appointment data with correct patient ID
                        setAppointmentData(prev => ({
                            ...prev,
                            patientId: data.id || data._id
                        }));
                    }
                } catch (error) {
                    console.error("Error fetching patient data:", error);
                }
            };

            fetchPatientData();
        }
    }, [user, patient]);

    // Form fields for each step
    const [symptoms, setSymptoms] = useState("");
    const [priority, setPriority] = useState("normal");
    const [conditions, setConditions] = useState<string[]>([]);
    const [allergies, setAllergies] = useState<string[]>([]);
    const [medications, setMedications] = useState<string[]>([]);
    const [surgeries, setSurgeries] = useState("");
    const [familyHistory, setFamilyHistory] = useState("");
    const [additionalNotes, setAdditionalNotes] = useState("");
    const [selectedDoctor, setSelectedDoctor] = useState("");
    const [scheduledDate, setScheduledDate] = useState("");
    const [scheduledTime, setScheduledTime] = useState("");

    // Fetch doctors from API and set all as online for demo purposes
    const { data: doctorsData = [] } = useQuery({
        queryKey: ["/api/users/role/doctor"],
        queryFn: async () => {
            const { data, error } = await userService.getByRole("doctor");
            if (error) {
                // If there's an error fetching doctors, use mock doctors for demo
                console.log("Using mock doctors for demonstration");
                return [
                    {
                        _id: "mock1",
                        name: "Dr. Rajesh Kumar",
                        department: "Cardiology",
                        specialization: "Heart Specialist",
                        isOnline: true
                    },
                    {
                        _id: "mock2",
                        name: "Dr. Priya Sharma",
                        department: "Pediatrics",
                        specialization: "Child Specialist",
                        isOnline: true
                    },
                    {
                        _id: "mock3",
                        name: "Dr. Amit Patel",
                        department: "Orthopedics",
                        specialization: "Bone Specialist",
                        isOnline: true
                    },
                    {
                        _id: "mock4",
                        name: "Dr. Sunita Reddy",
                        department: "Neurology",
                        specialization: "Brain Specialist",
                        isOnline: true
                    }
                ];
            }
            return data;
        },
        select: (data) => {
            // Transform the data to match our Doctor interface
            // Set all doctors as online for demo purposes
            return data.map((doctor: any) => ({
                id: doctor._id,
                name: doctor.name,
                department: doctor.department || "General Medicine",
                specialization: doctor.specialization || "General Practitioner",
                isOnline: true // Set all doctors as online
            }));
        }
    });

    const doctors = doctorsData as Doctor[];

    // Available conditions (for demonstration)
    const availableConditions = [
        "Diabetes", "Hypertension", "Asthma", "Arthritis",
        "Heart Disease", "Thyroid Disorders", "Migraine",
        "Depression", "Anxiety", "Allergies"
    ];

    // Available allergies (for demonstration)
    const availableAllergies = [
        "Penicillin", "Peanuts", "Shellfish", "Latex",
        "Dust Mites", "Pollen", "Eggs", "Milk"
    ];

    // Available medications (for demonstration)
    const availableMedications = [
        "Lisinopril", "Metformin", "Atorvastatin", "Amlodipine",
        "Levothyroxine", "Albuterol", "Omeprazole", "Sertraline"
    ];

    // Create appointment mutation
    const createAppointmentMutation = useMutation({
        mutationFn: async (data: AppointmentData) => {
            return appointmentService.create(data);
        },
        onSuccess: (response) => {
            if (response.error) {
                toast({
                    title: "Error",
                    description: response.error,
                    variant: "destructive"
                });
            } else {
                toast({
                    title: "Success",
                    description: "Appointment booked successfully! Please proceed to pay at the reception and obtain receipt.",
                    variant: "default"
                });
                queryClient.invalidateQueries({ queryKey: ["appointments", "patient", patient?.id] });
                onSuccess();
            }
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: error.message || "Failed to book appointment",
                variant: "destructive"
            });
        }
    });

    // Handle step navigation
    const nextStep = () => {
        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    // Handle form submission
    const handleSubmit = async () => {
        // Combine all medical history into notes field
        const medicalHistoryNotes = `
Medical History:
Conditions: ${conditions.join(", ") || "None"}
Allergies: ${allergies.join(", ") || "None"}
Current Medications: ${medications.join(", ") || "None"}
Previous Surgeries: ${surgeries || "None"}
Family Medical History: ${familyHistory || "None"}
Additional Notes: ${additionalNotes || "None"}
    `.trim();

        // Create proper Date object from date and time
        let scheduledAt = new Date();
        if (scheduledDate && scheduledTime) {
            scheduledAt = new Date(`${scheduledDate}T${scheduledTime}`);
        }

        // Ensure we have a valid patient ID before submitting
        let patientId = patient?.id || "";

        // If we still don't have a patient ID, try to get it from user data
        if (!patientId && user?.id) {
            // For patients, we need to fetch the patient record
            if (user.role === 'patient') {
                // Try to fetch patient data
                try {
                    const { data, error } = await patientService.getByUserId(user.id);
                    if (data && !error) {
                        patientId = data.id;
                        // Update the patient context
                        setPatient(data);
                    } else if (error) {
                        // If patient record doesn't exist, we might need to create one
                        console.log("Patient record not found, may need to create one");
                    }
                } catch (error) {
                    console.error("Error fetching patient data:", error);
                }
            }
        }

        // If we still don't have a patient ID, show an error
        if (!patientId) {
            toast({
                title: "Error",
                description: "Patient information is missing. Please try logging in again.",
                variant: "destructive"
            });
            return;
        }

        const data: AppointmentData = {
            patientId: patientId,
            doctorId: selectedDoctor,
            scheduledAt: scheduledAt.toISOString(),
            status: "scheduled",
            priority,
            symptoms,
            notes: medicalHistoryNotes
        };

        console.log("Submitting appointment data:", data);
        createAppointmentMutation.mutate(data);
    };

    // Toggle condition selection
    const toggleCondition = (condition: string) => {
        setConditions(prev =>
            prev.includes(condition)
                ? prev.filter(c => c !== condition)
                : [...prev, condition]
        );
    };

    // Toggle allergy selection
    const toggleAllergy = (allergy: string) => {
        setAllergies(prev =>
            prev.includes(allergy)
                ? prev.filter(a => a !== allergy)
                : [...prev, allergy]
        );
    };

    // Toggle medication selection
    const toggleMedication = (medication: string) => {
        setMedications(prev =>
            prev.includes(medication)
                ? prev.filter(m => m !== medication)
                : [...prev, medication]
        );
    };

    // Generate appointment template
    const generateAppointmentTemplate = () => {
        const doctor = doctors.find(d => d.id === selectedDoctor);

        return `
SEVA ONLINE MEDICAL CENTER
APPOINTMENT CONFIRMATION

Patient Information:
Name: ${user?.name}
Age: ${user?.age}
Phone: ${user?.phone || "Not provided"}
Email: ${user?.email || "Not provided"}
Address: ${user?.address || "Not provided"}

Appointment Details:
Date: ${scheduledDate || new Date().toLocaleDateString()}
Time: ${scheduledTime || new Date().toLocaleTimeString()}
Doctor: ${doctor?.name || "Not selected"}
Department: ${doctor?.department || "Not selected"}
Specialization: ${doctor?.specialization || "Not selected"}

Medical History:
Conditions: ${conditions.join(", ") || "None"}
Allergies: ${allergies.join(", ") || "None"}
Current Medications: ${medications.join(", ") || "None"}
Previous Surgeries: ${surgeries || "None"}
Family Medical History: ${familyHistory || "None"}

Symptoms:
${symptoms}

Priority: ${priority}
Additional Notes:
${additionalNotes}

This appointment will be sent to the doctor's dashboard for review.
    `.trim();
    };

    // Generate beautiful PDF appointment template
    const generateAppointmentPDF = () => {
        const doctor = doctors.find(d => d.id === selectedDoctor);

        // Create new PDF document
        const doc = new jsPDF();

        // Add hospital header
        doc.setFontSize(20);
        doc.setTextColor(0, 102, 204);
        doc.text("SEVA ONLINE MEDICAL CENTER", 105, 20, { align: "center" });

        // Add subtitle
        doc.setFontSize(12);
        doc.setTextColor(100, 100, 100);
        doc.text("Advanced Healthcare Management System", 105, 30, { align: "center" });

        // Add horizontal line
        doc.setDrawColor(0, 102, 204);
        doc.line(20, 35, 190, 35);

        // Add appointment details
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text("APPOINTMENT CONFIRMATION", 105, 45, { align: "center" });

        // Patient Information Section
        doc.setFontSize(14);
        doc.setTextColor(0, 102, 204);
        doc.text("Patient Information:", 20, 55);

        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(`Name: ${user?.name || "Not provided"}`, 25, 62);
        doc.text(`Age: ${user?.age || "Not provided"}`, 25, 69);
        doc.text(`Phone: ${user?.phone || "Not provided"}`, 25, 76);
        doc.text(`Email: ${user?.email || "Not provided"}`, 25, 83);
        doc.text(`Address: ${user?.address || "Not provided"}`, 25, 90);

        // Appointment Details Section
        doc.setFontSize(14);
        doc.setTextColor(0, 102, 204);
        doc.text("Appointment Details:", 20, 100);

        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(`Date: ${scheduledDate || new Date().toLocaleDateString()}`, 25, 107);
        doc.text(`Time: ${scheduledTime || new Date().toLocaleTimeString()}`, 25, 114);
        doc.text(`Doctor: ${doctor?.name || "Not selected"}`, 25, 121);
        doc.text(`Department: ${doctor?.department || "Not selected"}`, 25, 128);
        doc.text(`Specialization: ${doctor?.specialization || "Not selected"}`, 25, 135);

        // Medical History Section
        doc.setFontSize(14);
        doc.setTextColor(0, 102, 204);
        doc.text("Medical History:", 20, 145);

        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(`Conditions: ${conditions.join(", ") || "None"}`, 25, 152);
        doc.text(`Allergies: ${allergies.join(", ") || "None"}`, 25, 159);
        doc.text(`Current Medications: ${medications.join(", ") || "None"}`, 25, 166);
        doc.text(`Previous Surgeries: ${surgeries || "None"}`, 25, 173);
        doc.text(`Family Medical History: ${familyHistory || "None"}`, 25, 180);

        // Symptoms Section
        doc.setFontSize(14);
        doc.setTextColor(0, 102, 204);
        doc.text("Symptoms:", 20, 190);

        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        const splitSymptoms = doc.splitTextToSize(symptoms || "Not provided", 160);
        doc.text(splitSymptoms, 25, 197);

        // Priority and Notes Section
        doc.setFontSize(14);
        doc.setTextColor(0, 102, 204);
        doc.text("Additional Information:", 20, 210);

        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(`Priority: ${priority}`, 25, 217);
        const splitNotes = doc.splitTextToSize(additionalNotes || "None", 160);
        doc.text("Notes:", 25, 224);
        doc.text(splitNotes, 30, 231);

        // Footer
        doc.setFontSize(10);
        doc.setTextColor(150, 150, 150);
        doc.text("This appointment will be sent to the doctor's dashboard for review.", 105, 270, { align: "center" });
        doc.text("Generated on: " + new Date().toLocaleString(), 105, 277, { align: "center" });

        // Save the PDF
        doc.save(`appointment-${user?.name || "patient"}-${new Date().toISOString().split('T')[0]}.pdf`);
    };

    // Render form steps
    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-blue-900">Medical History</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Label className="text-blue-800">Existing Conditions</Label>
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                    {availableConditions.map((condition) => (
                                        <div key={condition} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id={`condition-${condition}`}
                                                checked={conditions.includes(condition)}
                                                onChange={() => toggleCondition(condition)}
                                                className="mr-2 h-4 w-4 text-blue-600 rounded"
                                            />
                                            <Label htmlFor={`condition-${condition}`} className="text-sm text-blue-700">
                                                {condition}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <Label className="text-blue-800">Known Allergies</Label>
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                    {availableAllergies.map((allergy) => (
                                        <div key={allergy} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id={`allergy-${allergy}`}
                                                checked={allergies.includes(allergy)}
                                                onChange={() => toggleAllergy(allergy)}
                                                className="mr-2 h-4 w-4 text-blue-600 rounded"
                                            />
                                            <Label htmlFor={`allergy-${allergy}`} className="text-sm text-blue-700">
                                                {allergy}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div>
                            <Label className="text-blue-800">Current Medications</Label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                                {availableMedications.map((medication) => (
                                    <div key={medication} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id={`medication-${medication}`}
                                            checked={medications.includes(medication)}
                                            onChange={() => toggleMedication(medication)}
                                            className="mr-2 h-4 w-4 text-blue-600 rounded"
                                        />
                                        <Label htmlFor={`medication-${medication}`} className="text-sm text-blue-700">
                                            {medication}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-blue-900">Medical History (Continued)</h3>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="surgeries" className="text-blue-800">Previous Surgeries</Label>
                                <Textarea
                                    id="surgeries"
                                    value={surgeries}
                                    onChange={(e) => setSurgeries(e.target.value)}
                                    placeholder="List any previous surgeries and dates if applicable"
                                    className="mt-1"
                                    rows={3}
                                />
                            </div>

                            <div>
                                <Label htmlFor="familyHistory" className="text-blue-800">Family Medical History</Label>
                                <Textarea
                                    id="familyHistory"
                                    value={familyHistory}
                                    onChange={(e) => setFamilyHistory(e.target.value)}
                                    placeholder="Any significant medical conditions in your family (e.g., heart disease, diabetes)"
                                    className="mt-1"
                                    rows={3}
                                />
                            </div>
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-blue-900">Appointment Details</h3>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="symptoms" className="text-blue-800">Primary Symptoms</Label>
                                <Textarea
                                    id="symptoms"
                                    value={symptoms}
                                    onChange={(e) => setSymptoms(e.target.value)}
                                    placeholder="Describe your main symptoms and concerns"
                                    className="mt-1"
                                    rows={4}
                                />
                            </div>

                            <div>
                                <Label className="text-blue-800">Priority Level</Label>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
                                    <Card
                                        className={`cursor-pointer ${priority === "normal" ? "border-blue-500 border-2" : "border-blue-200"} bg-white`}
                                        onClick={() => setPriority("normal")}
                                    >
                                        <CardContent className="p-4">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                                    <span className="text-blue-600 font-bold">1</span>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-blue-900">Normal</p>
                                                    <p className="text-sm text-blue-600">Routine checkup</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card
                                        className={`cursor-pointer ${priority === "urgent" ? "border-orange-500 border-2" : "border-orange-200"} bg-white`}
                                        onClick={() => setPriority("urgent")}
                                    >
                                        <CardContent className="p-4">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                                                    <span className="text-orange-600 font-bold">2</span>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-orange-900">Urgent</p>
                                                    <p className="text-sm text-orange-600">Needs attention soon</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card
                                        className={`cursor-pointer ${priority === "critical" ? "border-red-500 border-2" : "border-red-200"} bg-white`}
                                        onClick={() => setPriority("critical")}
                                    >
                                        <CardContent className="p-4">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                                                    <span className="text-red-600 font-bold">3</span>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-red-900">Critical</p>
                                                    <p className="text-sm text-red-600">Immediate attention</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 4:
                return (
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-blue-900">Schedule Appointment</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Label htmlFor="scheduledDate" className="text-blue-800">Appointment Date</Label>
                                <div className="relative mt-1">
                                    <Input
                                        type="date"
                                        id="scheduledDate"
                                        value={scheduledDate}
                                        onChange={(e) => setScheduledDate(e.target.value)}
                                        min={new Date().toISOString().split('T')[0]}
                                        className="pl-10"
                                    />
                                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-500" />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="scheduledTime" className="text-blue-800">Preferred Time</Label>
                                <div className="relative mt-1">
                                    <Input
                                        type="time"
                                        id="scheduledTime"
                                        value={scheduledTime}
                                        onChange={(e) => setScheduledTime(e.target.value)}
                                        className="pl-10"
                                    />
                                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-500" />
                                </div>
                            </div>
                        </div>

                        <div>
                            <Label className="text-blue-800">Additional Notes</Label>
                            <Textarea
                                value={additionalNotes}
                                onChange={(e) => setAdditionalNotes(e.target.value)}
                                placeholder="Any additional information you'd like to share with the doctor"
                                className="mt-1"
                                rows={4}
                            />
                        </div>
                    </div>
                );

            case 5:
                return (
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-blue-900">Select Doctor</h3>
                        <div className="space-y-4">
                            <div>
                                <Label className="text-blue-800">Select Available Doctor</Label>
                                <div className="grid grid-cols-1 gap-3 mt-2">
                                    {doctors.filter(d => d.isOnline).map((doctor) => (
                                        <Card
                                            key={doctor.id}
                                            className={`cursor-pointer ${selectedDoctor === doctor.id ? "border-blue-500 border-2" : "border-blue-200"} bg-white`}
                                            onClick={() => setSelectedDoctor(doctor.id)}
                                        >
                                            <CardContent className="p-4">
                                                <div className="flex items-center">
                                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                                        <Stethoscope className="h-5 w-5 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-blue-900">{doctor.name}</p>
                                                        <p className="text-sm text-blue-700">{doctor.department} - {doctor.specialization}</p>
                                                    </div>
                                                    <div className="ml-auto">
                                                        <Badge variant="default" className="bg-green-500">Online</Badge>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>

                                {doctors.filter(d => d.isOnline).length === 0 && (
                                    <div className="text-center py-8">
                                        <Users className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                                        <p className="text-blue-700">No doctors are currently online</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Message to display after appointment booking */}
                        {selectedDoctor && scheduledDate && scheduledTime && (
                            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                                <div className="flex items-start">
                                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                                    <div>
                                        <p className="text-green-800 font-medium">Appointment Details Confirmed</p>
                                        <p className="text-green-700 mt-1">
                                            Please proceed to pay at the reception and obtain receipt after completing the appointment booking.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            {/* Progress Bar */}
            <div className="mb-8">
                <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-blue-700">Step {currentStep} of {totalSteps}</span>
                    <span className="text-sm font-medium text-blue-700">{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
                </div>
                <div className="w-full bg-blue-100 rounded-full h-2.5">
                    <div
                        className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                        style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                    ></div>
                </div>
            </div>

            {/* Form Content */}
            <Card className="border-2 border-blue-200 shadow-lg">
                <CardHeader className="bg-blue-50 border-b-2 border-blue-200">
                    <CardTitle className="flex items-center text-blue-900">
                        <User className="h-5 w-5 mr-2" />
                        Appointment Booking
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    {renderStep()}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-8">
                        <Button
                            onClick={prevStep}
                            disabled={currentStep === 1}
                            variant="outline"
                            className="border-blue-300 text-blue-700 hover:bg-blue-50"
                        >
                            <ChevronLeft className="h-4 w-4 mr-2" />
                            Previous
                        </Button>

                        {currentStep < totalSteps ? (
                            <Button
                                onClick={nextStep}
                                disabled={currentStep === 5 && doctors.filter(d => d.isOnline).length === 0}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                Next
                                <ChevronRight className="h-4 w-4 ml-2" />
                            </Button>
                        ) : (
                            <div className="flex space-x-3">
                                <Button
                                    onClick={generateAppointmentPDF}
                                    variant="outline"
                                    className="border-blue-300 text-blue-700 hover:bg-blue-50"
                                >
                                    <Download className="h-4 w-4 mr-2" />
                                    Download PDF
                                </Button>
                                <Button
                                    onClick={handleSubmit}
                                    disabled={!selectedDoctor || !scheduledDate || !scheduledTime}
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                    Confirm Appointment
                                </Button>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}