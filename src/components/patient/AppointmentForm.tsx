import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { appointmentService, patientService } from "../../services/api";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "../ui/select";
import {
    Calendar,
    User,
    Phone,
    Mail,
    MapPin,
    Heart,
    Activity,
    AlertTriangle,
    Stethoscope,
    FileText,
    CheckCircle,
    Download,
    Users,
    Sun,
    Sunrise,
    Moon
} from "lucide-react";
import { toast } from "../../hooks/use-toast";

import { jsPDF } from "jspdf";
import "jspdf-autotable";

interface MedicalHistory {
    conditions: string[];
    allergies: string[];
    medications: string[];
    surgeries: string;
    familyHistory: string;
}

interface AppointmentData {
    patientId: string;
    doctorId: string;
    scheduledAt: string;
    status: string;
    priority: string;
    symptoms: string;
    notes?: string;
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

    // Default doctors (for demonstration)
    const [doctors] = useState<Doctor[]>([
        {
            id: "doc_001",
            name: "Dr. Sarah Johnson",
            department: "General Medicine",
            specialization: "Internal Medicine",
            isOnline: true
        },
        {
            id: "doc_002",
            name: "Dr. Michael Chen",
            department: "Cardiology",
            specialization: "Heart Specialist",
            isOnline: true
        }
    ]);

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
                    description: "Appointment booked successfully!"
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

        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text("Advanced Healthcare Solutions", 105, 30, { align: "center" });
        doc.text("Phone: +1 (555) 123-4567 | Email: info@sevaonline.com", 105, 37, { align: "center" });

        // Add horizontal line
        doc.setDrawColor(0, 102, 204);
        doc.line(20, 45, 190, 45);

        // Add appointment title
        doc.setFontSize(16);
        doc.setTextColor(0, 102, 204);
        doc.text("APPOINTMENT CONFIRMATION", 105, 55, { align: "center" });

        // Add patient information section
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text("Patient Information:", 20, 70);

        doc.setFontSize(12);
        doc.text(`Name: ${user?.name || "N/A"}`, 25, 80);
        doc.text(`Age: ${user?.age || "N/A"}`, 25, 87);
        doc.text(`Phone: ${user?.phone || "Not provided"}`, 25, 94);
        doc.text(`Email: ${user?.email || "Not provided"}`, 25, 101);
        doc.text(`Address: ${user?.address || "Not provided"}`, 25, 108);

        // Add appointment details section
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text("Appointment Details:", 20, 125);

        doc.setFontSize(12);
        doc.text(`Date: ${scheduledDate || new Date().toLocaleDateString()}`, 25, 135);
        doc.text(`Time: ${scheduledTime || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`, 25, 142);
        doc.text(`Doctor: ${doctor?.name || "Not selected"}`, 25, 149);
        doc.text(`Department: ${doctor?.department || "Not selected"}`, 25, 156);
        doc.text(`Specialization: ${doctor?.specialization || "Not selected"}`, 25, 163);
        doc.text(`Priority: ${priority.charAt(0).toUpperCase() + priority.slice(1)}`, 25, 170);

        // Add medical history section
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text("Medical History:", 20, 187);

        doc.setFontSize(12);
        doc.text(`Conditions: ${conditions.join(", ") || "None"}`, 25, 197);
        doc.text(`Allergies: ${allergies.join(", ") || "None"}`, 25, 204);
        doc.text(`Current Medications: ${medications.join(", ") || "None"}`, 25, 211);
        doc.text(`Previous Surgeries: ${surgeries || "None"}`, 25, 218);
        doc.text(`Family Medical History: ${familyHistory || "None"}`, 25, 225);

        // Add symptoms section
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text("Symptoms:", 20, 242);

        doc.setFontSize(12);
        const splitSymptoms = doc.splitTextToSize(symptoms || "Not provided", 160);
        doc.text(splitSymptoms, 25, 252);

        // Add additional notes section
        const notesY = 252 + (splitSymptoms.length * 7);
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text("Additional Notes:", 20, notesY + 10);

        doc.setFontSize(12);
        const splitNotes = doc.splitTextToSize(additionalNotes || "None", 160);
        doc.text(splitNotes, 25, notesY + 20);

        // Add footer
        const footerY = notesY + 30 + (splitNotes.length * 7);
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text("This appointment will be sent to the doctor's dashboard for review.", 105, footerY, { align: "center" });
        doc.text("Please arrive 15 minutes early for your appointment.", 105, footerY + 7, { align: "center" });

        return doc;
    };

    // Download appointment template as PDF
    const downloadAppointmentTemplate = () => {
        const doc = generateAppointmentPDF();
        doc.save(`appointment_${user?.name.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.pdf`);

        toast({
            title: "Success",
            description: "Appointment template downloaded successfully as PDF"
        });
    };

    // Render current step
    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-blue-900">Symptoms and Priority</h3>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="symptoms" className="text-blue-800">Describe your symptoms</Label>
                                <Textarea
                                    id="symptoms"
                                    value={symptoms}
                                    onChange={(e) => setSymptoms(e.target.value)}
                                    placeholder="Please describe your symptoms in detail..."
                                    className="min-h-[120px] border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <Label className="text-blue-800">Priority Level</Label>
                                <div className="grid grid-cols-3 gap-3 mt-2">
                                    <Button
                                        variant={priority === "normal" ? "default" : "outline"}
                                        onClick={() => setPriority("normal")}
                                        className={`h-16 flex flex-col items-center justify-center ${priority === "normal" ? "bg-blue-600 hover:bg-blue-700" : "border-blue-300 text-blue-700 hover:bg-blue-100"}`}
                                    >
                                        <User className="h-5 w-5 mb-1" />
                                        Normal
                                    </Button>
                                    <Button
                                        variant={priority === "urgent" ? "default" : "outline"}
                                        onClick={() => setPriority("urgent")}
                                        className={`h-16 flex flex-col items-center justify-center ${priority === "urgent" ? "bg-amber-600 hover:bg-amber-700" : "border-amber-300 text-amber-700 hover:bg-amber-100"}`}
                                    >
                                        <AlertTriangle className="h-5 w-5 mb-1" />
                                        Urgent
                                    </Button>
                                    <Button
                                        variant={priority === "critical" ? "default" : "outline"}
                                        onClick={() => setPriority("critical")}
                                        className={`h-16 flex flex-col items-center justify-center ${priority === "critical" ? "bg-red-600 hover:bg-red-700" : "border-red-300 text-red-700 hover:bg-red-100"}`}
                                    >
                                        <Activity className="h-5 w-5 mb-1" />
                                        Critical
                                    </Button>
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="scheduled-date" className="text-blue-800">Preferred Date</Label>
                                <Input
                                    id="scheduled-date"
                                    type="date"
                                    value={scheduledDate}
                                    onChange={(e) => setScheduledDate(e.target.value)}
                                    className="border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <Label className="text-blue-800">Preferred Time Slot</Label>
                                <div className="grid grid-cols-3 gap-3 mt-2">
                                    <Button
                                        variant={scheduledTime === "09:00" ? "default" : "outline"}
                                        onClick={() => setScheduledTime("09:00")}
                                        className={`h-16 flex flex-col items-center justify-center ${scheduledTime === "09:00" ? "bg-blue-600 hover:bg-blue-700" : "border-blue-300 text-blue-700 hover:bg-blue-100"}`}
                                    >
                                        <Sun className="h-5 w-5 mb-1" />
                                        Morning
                                        <span className="text-xs mt-1">9:00 AM</span>
                                    </Button>
                                    <Button
                                        variant={scheduledTime === "14:00" ? "default" : "outline"}
                                        onClick={() => setScheduledTime("14:00")}
                                        className={`h-16 flex flex-col items-center justify-center ${scheduledTime === "14:00" ? "bg-blue-600 hover:bg-blue-700" : "border-blue-300 text-blue-700 hover:bg-blue-100"}`}
                                    >
                                        <Sunrise className="h-5 w-5 mb-1" />
                                        Afternoon
                                        <span className="text-xs mt-1">2:00 PM</span>
                                    </Button>
                                    <Button
                                        variant={scheduledTime === "18:00" ? "default" : "outline"}
                                        onClick={() => setScheduledTime("18:00")}
                                        className={`h-16 flex flex-col items-center justify-center ${scheduledTime === "18:00" ? "bg-blue-600 hover:bg-blue-700" : "border-blue-300 text-blue-700 hover:bg-blue-100"}`}
                                    >
                                        <Moon className="h-5 w-5 mb-1" />
                                        Evening
                                        <span className="text-xs mt-1">6:00 PM</span>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-blue-900">Medical Conditions</h3>
                        <div className="space-y-4">
                            <div>
                                <Label className="text-blue-800">Existing Medical Conditions</Label>
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                    {availableConditions.map((condition) => (
                                        <Button
                                            key={condition}
                                            variant={conditions.includes(condition) ? "default" : "outline"}
                                            onClick={() => toggleCondition(condition)}
                                            className={`justify-start ${conditions.includes(condition) ? "bg-blue-600 hover:bg-blue-700" : "border-blue-300 text-blue-700 hover:bg-blue-100"}`}
                                        >
                                            {condition}
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="conditions-other" className="text-blue-800">Other Conditions</Label>
                                <Input
                                    id="conditions-other"
                                    placeholder="Enter any other conditions not listed above"
                                    className="border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-blue-900">Allergies and Medications</h3>
                        <div className="space-y-4">
                            <div>
                                <Label className="text-blue-800">Allergies</Label>
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                    {availableAllergies.map((allergy) => (
                                        <Button
                                            key={allergy}
                                            variant={allergies.includes(allergy) ? "default" : "outline"}
                                            onClick={() => toggleAllergy(allergy)}
                                            className={`justify-start ${allergies.includes(allergy) ? "bg-blue-600 hover:bg-blue-700" : "border-blue-300 text-blue-700 hover:bg-blue-100"}`}
                                        >
                                            {allergy}
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="allergies-other" className="text-blue-800">Other Allergies</Label>
                                <Input
                                    id="allergies-other"
                                    placeholder="Enter any other allergies not listed above"
                                    className="border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <Label className="text-blue-800">Current Medications</Label>
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                    {availableMedications.map((medication) => (
                                        <Button
                                            key={medication}
                                            variant={medications.includes(medication) ? "default" : "outline"}
                                            onClick={() => toggleMedication(medication)}
                                            className={`justify-start ${medications.includes(medication) ? "bg-blue-600 hover:bg-blue-700" : "border-blue-300 text-blue-700 hover:bg-blue-100"}`}
                                        >
                                            {medication}
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="medications-other" className="text-blue-800">Other Medications</Label>
                                <Input
                                    id="medications-other"
                                    placeholder="Enter any other medications not listed above"
                                    className="border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>
                );

            case 4:
                return (
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-blue-900">Additional Medical History</h3>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="surgeries" className="text-blue-800">Previous Surgeries</Label>
                                <Textarea
                                    id="surgeries"
                                    value={surgeries}
                                    onChange={(e) => setSurgeries(e.target.value)}
                                    placeholder="Please list any previous surgeries and dates..."
                                    className="min-h-[100px] border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <Label htmlFor="family-history" className="text-blue-800">Family Medical History</Label>
                                <Textarea
                                    id="family-history"
                                    value={familyHistory}
                                    onChange={(e) => setFamilyHistory(e.target.value)}
                                    placeholder="Please describe any significant medical conditions in your family..."
                                    className="min-h-[100px] border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <Label htmlFor="additional-notes" className="text-blue-800">Additional Notes</Label>
                                <Textarea
                                    id="additional-notes"
                                    value={additionalNotes}
                                    onChange={(e) => setAdditionalNotes(e.target.value)}
                                    placeholder="Any other information you'd like to share with your doctor..."
                                    className="min-h-[100px] border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
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

                            <Card className="border-blue-200 bg-blue-50">
                                <CardHeader className="bg-blue-100">
                                    <CardTitle className="flex items-center text-blue-900">
                                        <FileText className="h-5 w-5 mr-2 text-blue-600" />
                                        Appointment Summary
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-blue-700">Patient:</span>
                                            <span className="text-blue-900">{user?.name}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-blue-700">Symptoms:</span>
                                            <span className="text-right max-w-[60%] text-blue-900">{symptoms.substring(0, 30)}{symptoms.length > 30 ? "..." : ""}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-blue-700">Conditions:</span>
                                            <span className="text-blue-900">{conditions.length > 0 ? conditions.join(", ") : "None"}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-blue-700">Priority:</span>
                                            <span className="capitalize text-blue-900">{priority}</span>
                                        </div>
                                        {selectedDoctor && (
                                            <div className="flex justify-between">
                                                <span className="text-blue-700">Doctor:</span>
                                                <span className="text-blue-900">{doctors.find(d => d.id === selectedDoctor)?.name}</span>
                                            </div>
                                        )}
                                        {scheduledDate && (
                                            <div className="flex justify-between">
                                                <span className="text-blue-700">Date:</span>
                                                <span className="text-blue-900">{scheduledDate}</span>
                                            </div>
                                        )}
                                        {scheduledTime && (
                                            <div className="flex justify-between">
                                                <span className="text-blue-700">Time:</span>
                                                <span className="text-blue-900">{scheduledTime}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-4 flex space-x-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={downloadAppointmentTemplate}
                                            className="border-blue-300 text-blue-700 hover:bg-blue-100"
                                        >
                                            <Download className="h-4 w-4 mr-1" />
                                            Download Template
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            {/* Progress indicator */}
            <div className="mb-8">
                <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-blue-900">Step {currentStep} of {totalSteps}</span>
                    <span className="text-sm text-blue-700">
                        {Math.round((currentStep / totalSteps) * 100)}% Complete
                    </span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                    <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                    ></div>
                </div>
            </div>

            {/* Form content */}
            <Card className="border-2 border-blue-300 bg-white">
                <CardHeader className="bg-blue-50">
                    <CardTitle className="flex items-center text-blue-900">
                        <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                        Appointment Booking
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    {renderStep()}

                    {/* Navigation buttons */}
                    <div className="flex justify-between mt-8">
                        <Button
                            variant="outline"
                            onClick={prevStep}
                            disabled={currentStep === 1}
                            className="border-blue-300 text-blue-700 hover:bg-blue-100"
                        >
                            Previous
                        </Button>

                        {currentStep < totalSteps ? (
                            <Button
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                onClick={nextStep}
                                disabled={
                                    (currentStep === 1 && (!symptoms.trim() || !scheduledDate || !scheduledTime)) ||
                                    (currentStep === 5 && !selectedDoctor)
                                }
                            >
                                Next
                            </Button>
                        ) : (
                            <Button
                                onClick={handleSubmit}
                                disabled={!selectedDoctor || !symptoms.trim() || createAppointmentMutation.isPending}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                {createAppointmentMutation.isPending ? "Booking..." : "Book Appointment"}
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}