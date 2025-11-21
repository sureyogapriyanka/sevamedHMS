const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from the backend directory
dotenv.config({ path: path.resolve(__dirname, './.env') });

const User = require('./src/models/User');
const Patient = require('./src/models/Patient');

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

// Create additional mock patients with Indian names
const createAdditionalMockPatients = async () => {
    try {
        // Connect to database
        await connectDB();

        // Indian names for patients (5 male and 5 female)
        const indianPatients = [
            {
                username: 'rohit_sharma',
                password: 'patient123',
                role: 'patient',
                name: 'Rohit Sharma',
                email: 'rohit.sharma@example.com',
                age: 35,
                gender: 'Male',
                phone: '+91 98765 43210',
                address: 'Mumbai, Maharashtra',
                bloodGroup: 'O+'
            },
            {
                username: 'arjun_patel',
                password: 'patient123',
                role: 'patient',
                name: 'Arjun Patel',
                email: 'arjun.patel@example.com',
                age: 28,
                gender: 'Male',
                phone: '+91 98765 43211',
                address: 'Ahmedabad, Gujarat',
                bloodGroup: 'A+'
            },
            {
                username: 'vikram_singh',
                password: 'patient123',
                role: 'patient',
                name: 'Vikram Singh',
                email: 'vikram.singh@example.com',
                age: 42,
                gender: 'Male',
                phone: '+91 98765 43212',
                address: 'Delhi, India',
                bloodGroup: 'B+'
            },
            {
                username: 'rahul_mehra',
                password: 'patient123',
                role: 'patient',
                name: 'Rahul Mehra',
                email: 'rahul.mehra@example.com',
                age: 31,
                gender: 'Male',
                phone: '+91 98765 43213',
                address: 'Chandigarh, Punjab',
                bloodGroup: 'AB+'
            },
            {
                username: 'sumit_kumar',
                password: 'patient123',
                role: 'patient',
                name: 'Sumit Kumar',
                email: 'sumit.kumar@example.com',
                age: 26,
                gender: 'Male',
                phone: '+91 98765 43214',
                address: 'Kolkata, West Bengal',
                bloodGroup: 'O-'
            },
            {
                username: 'priya_verma',
                password: 'patient123',
                role: 'patient',
                name: 'Priya Verma',
                email: 'priya.verma@example.com',
                age: 30,
                gender: 'Female',
                phone: '+91 98765 43215',
                address: 'Bangalore, Karnataka',
                bloodGroup: 'A-'
            },
            {
                username: 'ananya_gupta',
                password: 'patient123',
                role: 'patient',
                name: 'Ananya Gupta',
                email: 'ananya.gupta@example.com',
                age: 24,
                gender: 'Female',
                phone: '+91 98765 43216',
                address: 'Pune, Maharashtra',
                bloodGroup: 'B-'
            },
            {
                username: 'sneha_reddy',
                password: 'patient123',
                role: 'patient',
                name: 'Sneha Reddy',
                email: 'sneha.reddy@example.com',
                age: 29,
                gender: 'Female',
                phone: '+91 98765 43217',
                address: 'Hyderabad, Telangana',
                bloodGroup: 'AB-'
            },
            {
                username: 'poonam_shah',
                password: 'patient123',
                role: 'patient',
                name: 'Poonam Shah',
                email: 'poonam.shah@example.com',
                age: 33,
                gender: 'Female',
                phone: '+91 98765 43218',
                address: 'Surat, Gujarat',
                bloodGroup: 'O+'
            },
            {
                username: 'divya_rani',
                password: 'patient123',
                role: 'patient',
                name: 'Divya Rani',
                email: 'divya.rani@example.com',
                age: 27,
                gender: 'Female',
                phone: '+91 98765 43219',
                address: 'Chennai, Tamil Nadu',
                bloodGroup: 'A+'
            }
        ];

        // Hash passwords and save users
        const createdPatients = [];
        for (const patientData of indianPatients) {
            // Check if user already exists
            const existingUser = await User.findOne({ username: patientData.username });
            if (existingUser) {
                console.log(`User ${patientData.username} already exists, skipping...`);
                continue;
            }

            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(patientData.password, salt);

            // Create user
            const user = new User({
                ...patientData,
                password: hashedPassword
            });

            await user.save();
            console.log(`Created user: ${user.username} (${user.role})`);

            // Create patient record
            const patientRecordData = {
                userId: user._id,
                medicalHistory: {
                    conditions: [],
                    surgeries: [],
                    chronicDiseases: []
                },
                allergies: [],
                medications: {},
                emergencyContact: {
                    name: '',
                    relationship: '',
                    phone: ''
                },
                bloodType: user.bloodGroup || 'Unknown',
                height: Math.floor(Math.random() * 50) + 150, // Random height between 150-200cm
                weight: Math.floor(Math.random() * 50) + 50, // Random weight between 50-100kg
                lastVisit: new Date()
            };

            const patientRecord = new Patient(patientRecordData);
            await patientRecord.save();
            console.log(`Created patient record for: ${user.username}`);
            createdPatients.push(patientRecord);
        }

        console.log(`Successfully created ${createdPatients.length} additional patient records`);
        process.exit(0);
    } catch (error) {
        console.error('Error creating additional mock patients:', error);
        process.exit(1);
    }
};

// Run the function
createAdditionalMockPatients();