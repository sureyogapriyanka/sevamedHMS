const mongoose = require('mongoose');
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

// Check patients in database
const checkPatients = async () => {
    try {
        // Connect to database
        await connectDB();

        // Find all patients
        const patients = await Patient.find();
        console.log(`Found ${patients.length} patients`);

        for (const patient of patients) {
            const user = await User.findById(patient.userId);
            console.log(`Patient ID: ${patient._id}, User ID: ${patient.userId}, Name: ${user?.name}, Username: ${user?.username}`);
        }

        process.exit(0);
    } catch (error) {
        console.error('Error checking patients:', error);
        process.exit(1);
    }
};

// Run the function
checkPatients();