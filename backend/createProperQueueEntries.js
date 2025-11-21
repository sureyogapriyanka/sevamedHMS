const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from the backend directory
dotenv.config({ path: path.resolve(__dirname, './.env') });

const User = require('./src/models/User');
const Patient = require('./src/models/Patient');
const Queue = require('./src/models/Queue');

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

// Create proper queue entries with correct patient and doctor IDs
const createProperQueueEntries = async () => {
    try {
        // Connect to database
        await connectDB();

        // Find all doctors
        const doctors = await User.find({ role: 'doctor' });
        console.log(`Found ${doctors.length} doctors`);

        if (doctors.length === 0) {
            console.log('No doctors found. Please seed the database first.');
            process.exit(1);
        }

        // Use the first doctor for our queue
        const primaryDoctor = doctors[0];
        console.log(`Using doctor: ${primaryDoctor.name} (${primaryDoctor.username})`);

        // Find all patients
        const patients = await Patient.find();
        console.log(`Found ${patients.length} patients`);

        if (patients.length === 0) {
            console.log('No patients found. Please seed the database first.');
            process.exit(1);
        }

        // Clear existing queue entries
        await Queue.deleteMany({});
        console.log('Cleared existing queue entries');

        // Create queue entries for up to 10 patients (or all existing patients if less than 10)
        const numberOfEntries = Math.min(10, patients.length);
        console.log(`Creating ${numberOfEntries} queue entries`);

        // Create queue entries
        for (let i = 0; i < numberOfEntries; i++) {
            const patient = patients[i % patients.length];

            // Create queue entry with correct patient and doctor IDs
            const queueEntryData = {
                patientId: patient._id,
                doctorId: primaryDoctor._id,
                position: i + 1, // Position 1-10
                estimatedWaitTime: 15 + (i * 5), // 15, 20, 25, ..., 60 minutes
                status: i < 2 ? 'in-consultation' : 'waiting', // First 2 in consultation, rest waiting
                priority: i < 3 ? 'urgent' : i < 6 ? 'normal' : 'critical' // Mix of priorities
            };

            const queueEntry = new Queue(queueEntryData);
            await queueEntry.save();
            console.log(`Created queue entry: Position ${queueEntryData.position}, Patient: ${patient._id}, Status: ${queueEntryData.status}, Priority: ${queueEntryData.priority}`);
        }

        console.log(`Successfully created ${numberOfEntries} queue entries for doctor dashboard`);

        // Verify the entries
        const queueEntries = await Queue.find({ doctorId: primaryDoctor._id })
            .sort({ position: 1 });

        console.log('\nCurrent Doctor Queue:');
        queueEntries.forEach(entry => {
            console.log(`- Position: ${entry.position}, Status: ${entry.status}, Priority: ${entry.priority}, Wait Time: ${entry.estimatedWaitTime} mins`);
        });

        process.exit(0);
    } catch (error) {
        console.error('Error creating proper queue entries:', error);
        process.exit(1);
    }
};

// Run the function
createProperQueueEntries();