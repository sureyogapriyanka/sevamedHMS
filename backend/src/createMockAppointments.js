const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from the backend directory
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const User = require('./models/User');
const Patient = require('./models/Patient');
const Appointment = require('./models/Appointment');

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

// Create mock appointments
const createMockAppointments = async () => {
    try {
        // Connect to database
        await connectDB();

        // Find demo patients
        const patients = await Patient.find().populate('userId');
        const demoPatients = patients.filter(p =>
            p.userId && ['rohit_sharma', 'arjun_patel'].includes(p.userId.username)
        );

        console.log(`Found ${demoPatients.length} demo patients`);

        // Find doctors
        const doctors = await User.find({ role: 'doctor' });
        console.log(`Found ${doctors.length} doctors`);

        if (doctors.length === 0) {
            console.log('No doctors found. Please seed the database first.');
            process.exit(1);
        }

        // Create 3 appointments for each demo patient
        const appointmentsToCreate = [];

        for (const patient of demoPatients) {
            console.log(`Creating appointments for ${patient.userId.name} (${patient.userId.username})`);

            for (let i = 0; i < 3; i++) {
                // Select a random doctor
                const randomDoctor = doctors[Math.floor(Math.random() * doctors.length)];

                // Create appointment date (within next 30 days)
                const appointmentDate = new Date();
                appointmentDate.setDate(appointmentDate.getDate() + Math.floor(Math.random() * 30) + 1);
                appointmentDate.setHours(9 + Math.floor(Math.random() * 8), 0, 0, 0); // Between 9 AM and 5 PM

                // Random status and priority
                const statuses = ['scheduled', 'in-progress', 'completed', 'cancelled'];
                const priorities = ['normal', 'urgent', 'critical'];

                const status = statuses[Math.floor(Math.random() * statuses.length)];
                const priority = priorities[Math.floor(Math.random() * priorities.length)];

                // Sample symptoms
                const symptomsList = [
                    'Regular checkup',
                    'Headache and dizziness',
                    'Joint pain',
                    'Fever and cough',
                    'Skin rash',
                    'Digestive issues',
                    'Back pain',
                    'Shortness of breath',
                    'Fatigue and weakness',
                    'Eye irritation'
                ];

                const notesList = [
                    'Annual physical examination',
                    'Follow-up visit',
                    'Initial consultation',
                    'Routine checkup',
                    'Patient reports persistent symptoms'
                ];

                const diagnosisList = [
                    'Minor hypertension',
                    'Common cold',
                    'Allergic reaction',
                    'Muscle strain',
                    'Seasonal allergies',
                    'Mild anxiety',
                    'Vitamin deficiency',
                    'Stress-related symptoms'
                ];

                const treatmentList = [
                    'Prescribed medication and lifestyle changes',
                    'Recommended rest and hydration',
                    'Physical therapy sessions',
                    'Dietary modifications',
                    'Stress management techniques',
                    'Over-the-counter pain relief',
                    'Follow-up appointment scheduled'
                ];

                const appointmentData = {
                    patientId: patient._id,
                    doctorId: randomDoctor._id,
                    scheduledAt: appointmentDate,
                    status: status,
                    priority: priority,
                    symptoms: symptomsList[Math.floor(Math.random() * symptomsList.length)],
                    notes: notesList[Math.floor(Math.random() * notesList.length)],
                    ...(status === 'completed' && {
                        diagnosis: diagnosisList[Math.floor(Math.random() * diagnosisList.length)],
                        treatment: treatmentList[Math.floor(Math.random() * treatmentList.length)]
                    })
                };

                appointmentsToCreate.push(appointmentData);
            }
        }

        // Create all appointments
        for (const apptData of appointmentsToCreate) {
            const appointment = new Appointment(apptData);
            await appointment.save();
            console.log(`Created appointment: ${apptData.symptoms} for ${apptData.patientId} with doctor ${apptData.doctorId}`);
        }

        console.log(`Successfully created ${appointmentsToCreate.length} appointments`);
        process.exit(0);
    } catch (error) {
        console.error('Error creating mock appointments:', error);
        process.exit(1);
    }
};

// Run the function
createMockAppointments();