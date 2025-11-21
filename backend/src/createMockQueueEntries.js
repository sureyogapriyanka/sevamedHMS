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

// Create mock queue entries
const createMockQueueEntries = async () => {
    try {
        // Connect to database
        await connectDB();

        // Find all patients
        const patients = await Patient.find().populate('userId');
        console.log(`Found ${patients.length} patients`);

        // Find all doctors
        const doctors = await User.find({ role: 'doctor' });
        console.log(`Found ${doctors.length} doctors`);

        if (patients.length === 0) {
            console.log('No patients found. Please seed the database first.');
            process.exit(1);
        }

        if (doctors.length === 0) {
            console.log('No doctors found. Please seed the database first.');
            process.exit(1);
        }

        // Clear existing queue entries
        await Queue.deleteMany({});
        console.log('Cleared existing queue entries');

        // Create 10 queue entries with direct conditions
        const queueEntriesToCreate = [];

        // Create 10 queue entries with patients and doctors
        for (let i = 0; i < Math.min(10, patients.length); i++) {
            const patient = patients[i];
            const doctor = doctors[i % doctors.length]; // Rotate through doctors

            // Random position (1-5)
            const position = Math.floor(Math.random() * 5) + 1;

            // Random estimated wait time (10-120 minutes)
            const estimatedWaitTime = Math.floor(Math.random() * 110) + 10;

            // Random status
            const statuses = ['waiting', 'in-consultation'];
            const status = statuses[Math.floor(Math.random() * statuses.length)];

            // Random priority
            const priorities = ['normal', 'urgent', 'critical'];
            const priority = priorities[Math.floor(Math.random() * priorities.length)];

            const queueEntryData = {
                patientId: patient._id,
                doctorId: doctor._id,
                position: position,
                estimatedWaitTime: estimatedWaitTime,
                status: status,
                priority: priority
            };

            queueEntriesToCreate.push(queueEntryData);
        }

        // Create all queue entries
        for (const entryData of queueEntriesToCreate) {
            const queueEntry = new Queue(entryData);
            await queueEntry.save();
            console.log(`Created queue entry: Patient ${entryData.patientId} with Doctor ${entryData.doctorId}, Position: ${entryData.position}, Status: ${entryData.status}`);
        }

        console.log(`Successfully created ${queueEntriesToCreate.length} queue entries`);

        // Verify the entries
        const queueEntries = await Queue.find()
            .populate('patientId', 'userId')
            .populate('doctorId', 'name');

        console.log('\nCurrent Queue Entries:');
        queueEntries.forEach(entry => {
            console.log(`- Patient: ${entry.patientId.userId}, Doctor: ${entry.doctorId.name}, Position: ${entry.position}, Status: ${entry.status}`);
        });

        process.exit(0);
    } catch (error) {
        console.error('Error creating mock queue entries:', error);
        process.exit(1);
    }
};

// Run the function
createMockQueueEntries();