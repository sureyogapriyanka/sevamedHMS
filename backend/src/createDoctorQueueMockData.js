const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from the backend directory
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const User = require('./models/User');
const Patient = require('./models/Patient');
const Queue = require('./models/Queue');

// Connect to MongoDB
const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI || process.env.MONGO_DB_URI;
        if (!mongoUri) {
            throw new Error('MONGODB_URI or MONGO_DB_URI is not defined in environment variables');
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

// Create mock queue entries for doctor dashboard
const createDoctorQueueMockData = async () => {
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

        // Clear existing queue entries
        await Queue.deleteMany({});
        console.log('Cleared existing queue entries');

        // Create 10 mock patients data (without actually creating user accounts)
        const mockPatients = [
            { name: 'John Smith', age: 35, gender: 'Male' },
            { name: 'Emily Johnson', age: 28, gender: 'Female' },
            { name: 'Michael Brown', age: 45, gender: 'Male' },
            { name: 'Sarah Davis', age: 32, gender: 'Female' },
            { name: 'Robert Wilson', age: 52, gender: 'Male' },
            { name: 'Jennifer Lee', age: 29, gender: 'Female' },
            { name: 'David Miller', age: 41, gender: 'Male' },
            { name: 'Lisa Taylor', age: 38, gender: 'Female' },
            { name: 'James Anderson', age: 47, gender: 'Male' },
            { name: 'Patricia Thomas', age: 33, gender: 'Female' }
        ];

        // Create queue entries for the first doctor
        const primaryDoctor = doctors[0];
        console.log(`Using doctor: ${primaryDoctor.name}`);

        // Create 10 queue entries
        const queueEntriesToCreate = [];

        for (let i = 0; i < 10; i++) {
            const mockPatient = mockPatients[i];

            // Create queue entry with direct conditions
            const queueEntryData = {
                // Using a placeholder ID since we're not creating actual patient records
                patientId: primaryDoctor._id, // Placeholder - in a real scenario, this would be actual patient IDs
                doctorId: primaryDoctor._id,
                position: i + 1, // Position 1-10
                estimatedWaitTime: 15 + (i * 5), // 15, 20, 25, ..., 60 minutes
                status: i < 2 ? 'in-consultation' : 'waiting', // First 2 in consultation, rest waiting
                priority: i < 3 ? 'urgent' : i < 6 ? 'normal' : 'critical' // Mix of priorities
            };

            queueEntriesToCreate.push(queueEntryData);
        }

        // Create all queue entries
        for (const entryData of queueEntriesToCreate) {
            const queueEntry = new Queue(entryData);
            await queueEntry.save();
            console.log(`Created queue entry: Position ${entryData.position}, Status: ${entryData.status}, Priority: ${entryData.priority}`);
        }

        console.log(`Successfully created ${queueEntriesToCreate.length} queue entries for doctor dashboard`);

        // Verify the entries
        const queueEntries = await Queue.find({ doctorId: primaryDoctor._id })
            .sort({ position: 1 });

        console.log('\nCurrent Doctor Queue:');
        queueEntries.forEach(entry => {
            console.log(`- Position: ${entry.position}, Status: ${entry.status}, Priority: ${entry.priority}, Wait Time: ${entry.estimatedWaitTime} mins`);
        });

        process.exit(0);
    } catch (error) {
        console.error('Error creating doctor queue mock data:', error);
        process.exit(1);
    }
};

// Run the function
createDoctorQueueMockData();