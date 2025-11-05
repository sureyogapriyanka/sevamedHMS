import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
    FileText,
    Calendar,
    Pill,
    Stethoscope,
    Download,
    Eye,
    AlertCircle
} from "lucide-react";
import { appointmentService } from "../../services/api";

interface MedicalRecord {
    id: string;
    date: string;
    type: string;
    doctor: string;
    diagnosis: string;
    prescription?: string;
    notes?: string;
}

export default function MedicalRecords() {
    const { patient, user } = useAuth();
    const [records, setRecords] = useState<MedicalRecord[]>([]);

    const { data: appointments = [] } = useQuery({
        queryKey: ["appointments", "patient", patient?.id],
        queryFn: async () => {
            if (!patient?.id) return [];
            const { data } = await appointmentService.getByUserId(patient.id);
            return data || [];
        },
        enabled: !!patient?.id
    });

    // Transform appointments into medical records
    useEffect(() => {
        if (appointments && appointments.length > 0) {
            const transformedRecords = appointments
                .filter((apt: any) => apt.status === "completed" && (apt.diagnosis || apt.treatment))
                .map((apt: any) => ({
                    id: apt.id,
                    date: apt.scheduledAt,
                    type: "Consultation",
                    doctor: `Dr. ${apt.doctorId || "Unknown"}`,
                    diagnosis: apt.diagnosis || "No diagnosis recorded",
                    prescription: apt.treatment || "No prescription recorded",
                    notes: apt.notes || "No additional notes"
                }))
                .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());

            setRecords(transformedRecords);
        }
    }, [appointments]);

    const handleViewRecord = (recordId: string) => {
        // In a real app, this would open a detailed view of the record
        console.log("Viewing record:", recordId);
    };

    const handleDownloadRecord = (recordId: string) => {
        // In a real app, this would download the record as PDF
        console.log("Downloading record:", recordId);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Medical Records</h2>
                <Button variant="outline" className="flex items-center">
                    <Download className="h-4 w-4 mr-2" />
                    Export All
                </Button>
            </div>

            {records.length === 0 ? (
                <Card>
                    <CardContent className="p-8 text-center">
                        <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium text-foreground mb-2">No Medical Records</h3>
                        <p className="text-muted-foreground mb-4">
                            Your medical records will appear here after consultations with doctors.
                        </p>
                        <Button>Book a Consultation</Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {records.map((record) => (
                        <Card key={record.id} className="border-2 border-purple-500/30 hover:shadow-md transition-shadow bg-gradient-to-br from-gray-800 to-gray-900 backdrop-blur-sm">
                            <CardHeader className="pb-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="flex items-center space-x-2">
                                            <Stethoscope className="h-5 w-5 text-primary" />
                                            <span>{record.type}</span>
                                        </CardTitle>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {new Date(record.date).toLocaleDateString()} • {record.doctor}
                                        </p>
                                    </div>
                                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                        Completed
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-sm font-medium text-foreground">Diagnosis</p>
                                        <p className="text-sm text-muted-foreground">{record.diagnosis}</p>
                                    </div>

                                    {record.prescription && (
                                        <div>
                                            <p className="text-sm font-medium text-foreground">Prescription</p>
                                            <p className="text-sm text-muted-foreground">{record.prescription}</p>
                                        </div>
                                    )}

                                    <div className="flex space-x-2 pt-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleViewRecord(record.id)}
                                            className="flex items-center"
                                        >
                                            <Eye className="h-4 w-4 mr-1" />
                                            View Details
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleDownloadRecord(record.id)}
                                            className="flex items-center"
                                        >
                                            <Download className="h-4 w-4 mr-1" />
                                            Download
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}