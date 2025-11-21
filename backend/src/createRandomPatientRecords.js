const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from the backend directory
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const User = require('./models/User');
const Patient = require('./models/Patient');

// Connect to MongoDB
const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) {
            throw new Error('MONGODB_URI is not defined in environment variables');
        }

        const conn = await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return conn;
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

// Indian names for patients
const indianNames = [
    "Aarav Patel", "Aarya Sharma", "Advik Singh", "Anika Gupta", "Arjun Reddy",
    "Dev Patel", "Dia Sharma", "Ishaan Kumar", "Kavya Reddy", "Krishna Verma",
    "Meera Patel", "Mohit Sharma", "Neha Singh", "Pranav Gupta", "Riya Verma",
    "Rohan Patel", "Saanvi Sharma", "Siddharth Kumar", "Tanvi Reddy", "Vihaan Verma",
    "Aditi Joshi", "Akash Desai", "Anaya Rao", "Arnav Nair", "Avni Pillai",
    "Dhruv Trivedi", "Ira Shah", "Kabir Malhotra", "Kiara Bhatia", "Manan Jain",
    "Myra Chopra", "Reyansh Tiwari", "Rudra Chauhan", "Sara Iyer", "Vivaan Menon"
];

// Common medical conditions
const medicalConditions = [
    "Hypertension", "Diabetes Type 2", "Asthma", "Migraine", "Arthritis",
    "Depression", "Anxiety", "GERD", "Hypothyroidism", "Allergic Rhinitis",
    "Obesity", "Sleep Apnea", "Chronic Back Pain", "Eczema", "Seasonal Allergies",
    "High Cholesterol", "Osteoporosis", "Chronic Sinusitis", "Irritable Bowel Syndrome",
    "Polycystic Ovary Syndrome", "Benign Prostatic Hyperplasia", "Chronic Kidney Disease"
];

// Common medications
const commonMedications = [
    "Lisinopril", "Metformin", "Albuterol", "Sumatriptan", "Ibuprofen",
    "Sertraline", "Loratadine", "Omeprazole", "Levothyroxine", "Atorvastatin",
    "Meloxicam", "Escitalopram", "Montelukast", "Gabapentin", "Hydrochlorothiazide",
    "Losartan", "Amlodipine", "Simvastatin", "Prednisone", "Amoxicillin"
];

// Common allergies
const commonAllergies = [
    "Penicillin", "Peanuts", "Shellfish", "Latex", "Dust Mites",
    "Pollen", "Eggs", "Milk", "Soy", "Tree Nuts",
    "Aspirin", "Iodine", "Sulfa Drugs", "Bees/Wasps", "Nickel"
];

// Blood groups
const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

// Generate random patient records
const createRandomPatientRecords = async () => {
    try {
        // Connect to database
        await connectDB();

        // Find all patient users
        const patientUsers = await User.find({ role: 'patient' });
        console.log(`Found ${patientUsers.length} patient users`);

        if (patientUsers.length === 0) {
            console.log('No patient users found. Please create patient users first.');
            process.exit(1);
        }

        // Clear existing patient records
        await Patient.deleteMany({});
        console.log('Cleared existing patient records');

        // Create patient records for each patient user
        const createdPatients = [];
        for (let i = 0; i < Math.min(10, patientUsers.length); i++) {
            const user = patientUsers[i];

            // Generate random medical data
            const randomConditions = [];
            const numConditions = Math.floor(Math.random() * 3) + 1; // 1-3 conditions
            for (let j = 0; j < numConditions; j++) {
                const condition = medicalConditions[Math.floor(Math.random() * medicalConditions.length)];
                if (!randomConditions.includes(condition)) {
                    randomConditions.push(condition);
                }
            }

            const randomAllergies = [];
            const numAllergies = Math.floor(Math.random() * 2) + 1; // 1-2 allergies
            for (let j = 0; j < numAllergies; j++) {
                const allergy = commonAllergies[Math.floor(Math.random() * commonAllergies.length)];
                if (!randomAllergies.includes(allergy)) {
                    randomAllergies.push(allergy);
                }
            }

            const randomMedications = {};
            const numMedications = Math.floor(Math.random() * 3) + 1; // 1-3 medications
            for (let j = 0; j < numMedications; j++) {
                const medication = commonMedications[Math.floor(Math.random() * commonMedications.length)];
                const dosage = `${Math.floor(Math.random() * 3) + 1} ${['mg', 'g', 'ml'][Math.floor(Math.random() * 3)]}`;
                const frequency = ['once daily', 'twice daily', 'three times daily'][Math.floor(Math.random() * 3)];
                randomMedications[medication] = `${dosage}, ${frequency}`;
            }

            // Random physical data
            const height = Math.floor(Math.random() * 50) + 150; // 150-200 cm
            const weight = Math.floor(Math.random() * 50) + 50; // 50-100 kg
            const bmi = (weight / Math.pow(height / 100, 2)).toFixed(1);

            // Create patient record
            const patientRecordData = {
                userId: user._id,
                medicalHistory: {
                    conditions: randomConditions,
                    surgeries: [],
                    chronicDiseases: randomConditions.filter(c =>
                        ['Hypertension', 'Diabetes Type 2', 'Asthma', 'Arthritis', 'Hypothyroidism'].includes(c)
                    )
                },
                allergies: randomAllergies,
                medications: randomMedications,
                emergencyContact: {
                    name: indianNames[Math.floor(Math.random() * indianNames.length)],
                    relationship: ['Spouse', 'Parent', 'Sibling', 'Child'][Math.floor(Math.random() * 4)],
                    phone: `+91-${Math.floor(Math.random() * 9000000000) + 1000000000}`
                },
                bloodType: bloodGroups[Math.floor(Math.random() * bloodGroups.length)],
                height: height,
                weight: weight,
                bmi: bmi,
                lastVisit: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000) // 0-30 days ago
            };

            const patientRecord = new Patient(patientRecordData);
            await patientRecord.save();
            console.log(`Created patient record for: ${user.name} (${user.username})`);
            createdPatients.push(patientRecord);
        }

        console.log(`Successfully created ${createdPatients.length} patient records`);

        // Display sample of created records
        console.log('\nSample Patient Records:');
        for (let i = 0; i < Math.min(3, createdPatients.length); i++) {
            const patient = createdPatients[i];
            const user = patientUsers.find(u => u._id.toString() === patient.userId.toString());
            console.log(`\n--- Patient ${i + 1} ---`);
            console.log(`Name: ${user.name}`);
            console.log(`Username: ${user.username}`);
            console.log(`Blood Type: ${patient.bloodType}`);
            console.log(`Height: ${patient.height} cm`);
            console.log(`Weight: ${patient.weight} kg`);
            console.log(`BMI: ${patient.bmi}`);
            console.log(`Conditions: ${patient.medicalHistory.conditions.join(', ')}`);
            console.log(`Allergies: ${patient.allergies.join(', ')}`);
            console.log(`Medications: ${Object.keys(patient.medications).join(', ')}`);
        }

        process.exit(0);
    } catch (error) {
        console.error('Error creating random patient records:', error);
        process.exit(1);
    }
};

// Run the function
createRandomPatientRecords();