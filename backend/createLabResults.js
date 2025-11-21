const mongoose = require('mongoose');
const LabResult = require('./src/models/LabResult');
const User = require('./src/models/User');
const dotenv = require('dotenv');

dotenv.config();

// Connect to MongoDB
const connectDB = require('./src/config/db');
connectDB();

// Sample lab results data
const sampleLabResults = [
    {
        patientId: "pat-001",
        doctorId: "doc-001",
        testType: "Complete Blood Count",
        testDate: new Date("2023-06-15"),
        collectionDate: new Date("2023-06-15"),
        reportedDate: new Date("2023-06-16"),
        status: "normal",
        results: [
            { name: "Hemoglobin", value: "14.2", unit: "g/dL", referenceRange: "13.5-17.5", status: "normal" },
            { name: "RBC Count", value: "4.8", unit: "million/μL", referenceRange: "4.5-5.9", status: "normal" },
            { name: "WBC Count", value: "6.5", unit: "thousand/μL", referenceRange: "4.0-11.0", status: "normal" },
            { name: "Platelets", value: "250", unit: "thousand/μL", referenceRange: "150-400", status: "normal" }
        ],
        patientAge: 35,
        patientGender: "male",
        bloodType: "O+",
        comments: "All values within normal range. Patient is in good health."
    },
    {
        patientId: "pat-002",
        doctorId: "doc-001",
        testType: "Lipid Profile",
        testDate: new Date("2023-06-10"),
        collectionDate: new Date("2023-06-10"),
        reportedDate: new Date("2023-06-11"),
        status: "abnormal",
        results: [
            { name: "Total Cholesterol", value: "245", unit: "mg/dL", referenceRange: "<200", status: "high" },
            { name: "LDL Cholesterol", value: "165", unit: "mg/dL", referenceRange: "<100", status: "high" },
            { name: "HDL Cholesterol", value: "35", unit: "mg/dL", referenceRange: ">40", status: "low" },
            { name: "Triglycerides", value: "180", unit: "mg/dL", referenceRange: "<150", status: "high" }
        ],
        patientAge: 28,
        patientGender: "male",
        bloodType: "A+",
        comments: "Elevated cholesterol levels. Recommend dietary changes and follow-up in 3 months."
    },
    {
        patientId: "pat-003",
        doctorId: "doc-001",
        testType: "Thyroid Function",
        testDate: new Date("2023-06-05"),
        collectionDate: new Date("2023-06-05"),
        reportedDate: new Date("2023-06-06"),
        status: "normal",
        results: [
            { name: "TSH", value: "2.1", unit: "μIU/mL", referenceRange: "0.4-4.0", status: "normal" },
            { name: "T3", value: "1.8", unit: "ng/dL", referenceRange: "0.8-2.0", status: "normal" },
            { name: "T4", value: "8.5", unit: "μg/dL", referenceRange: "5.0-12.0", status: "normal" }
        ],
        patientAge: 42,
        patientGender: "male",
        bloodType: "B+",
        comments: "Thyroid function normal. Continue current medication."
    },
    {
        patientId: "pat-004",
        doctorId: "doc-001",
        testType: "Liver Function",
        testDate: new Date("2023-05-28"),
        collectionDate: new Date("2023-05-28"),
        reportedDate: new Date("2023-05-29"),
        status: "pending",
        results: [
            { name: "ALT", value: "45", unit: "U/L", referenceRange: "<40", status: "high" },
            { name: "AST", value: "38", unit: "U/L", referenceRange: "<37", status: "high" },
            { name: "ALP", value: "95", unit: "U/L", referenceRange: "44-147", status: "normal" },
            { name: "Bilirubin", value: "1.2", unit: "mg/dL", referenceRange: "<1.2", status: "normal" }
        ],
        patientAge: 31,
        patientGender: "male",
        bloodType: "AB+",
        comments: "Slightly elevated liver enzymes. Further testing recommended."
    },
    {
        patientId: "pat-005",
        doctorId: "doc-001",
        testType: "Kidney Function",
        testDate: new Date("2023-05-20"),
        collectionDate: new Date("2023-05-20"),
        reportedDate: new Date("2023-05-21"),
        status: "normal",
        results: [
            { name: "Creatinine", value: "0.9", unit: "mg/dL", referenceRange: "0.7-1.3", status: "normal" },
            { name: "BUN", value: "15", unit: "mg/dL", referenceRange: "7-20", status: "normal" },
            { name: "eGFR", value: "95", unit: "mL/min/1.73m²", referenceRange: ">60", status: "normal" }
        ],
        patientAge: 26,
        patientGender: "male",
        bloodType: "O-",
        comments: "Kidney function normal. No concerns at this time."
    },
    {
        patientId: "pat-006",
        doctorId: "doc-001",
        testType: "Blood Glucose",
        testDate: new Date("2023-06-12"),
        collectionDate: new Date("2023-06-12"),
        reportedDate: new Date("2023-06-13"),
        status: "abnormal",
        results: [
            { name: "Fasting Glucose", value: "126", unit: "mg/dL", referenceRange: "<100", status: "high" },
            { name: "HbA1c", value: "6.8", unit: "%", referenceRange: "<5.7", status: "high" }
        ],
        patientAge: 30,
        patientGender: "female",
        bloodType: "A-",
        comments: "Indicative of diabetes. Recommend consultation with endocrinologist."
    },
    {
        patientId: "pat-007",
        doctorId: "doc-001",
        testType: "Vitamin D",
        testDate: new Date("2023-06-08"),
        collectionDate: new Date("2023-06-08"),
        reportedDate: new Date("2023-06-09"),
        status: "abnormal",
        results: [
            { name: "Vitamin D", value: "22", unit: "ng/mL", referenceRange: "30-100", status: "low" }
        ],
        patientAge: 24,
        patientGender: "female",
        bloodType: "B-",
        comments: "Vitamin D deficiency. Recommend supplementation and increased sun exposure."
    },
    {
        patientId: "pat-008",
        doctorId: "doc-001",
        testType: "Iron Panel",
        testDate: new Date("2023-06-03"),
        collectionDate: new Date("2023-06-03"),
        reportedDate: new Date("2023-06-04"),
        status: "normal",
        results: [
            { name: "Serum Iron", value: "85", unit: "μg/dL", referenceRange: "65-175", status: "normal" },
            { name: "Ferritin", value: "45", unit: "ng/mL", referenceRange: "15-150", status: "normal" },
            { name: "TIBC", value: "320", unit: "μg/dL", referenceRange: "250-400", status: "normal" }
        ],
        patientAge: 29,
        patientGender: "female",
        bloodType: "AB-",
        comments: "Iron levels normal. No supplementation needed."
    }
];

const createLabResults = async () => {
    try {
        // Clear existing lab results
        await LabResult.deleteMany({});

        // Create new lab results
        const createdLabResults = await LabResult.insertMany(sampleLabResults);

        console.log(`Created ${createdLabResults.length} lab results`);

        // Close the connection
        mongoose.connection.close();
    } catch (error) {
        console.error('Error creating lab results:', error);
        mongoose.connection.close();
    }
};

createLabResults();