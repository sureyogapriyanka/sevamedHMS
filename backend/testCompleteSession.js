const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from the backend directory
dotenv.config({ path: path.resolve(__dirname, './.env') });

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

// Test completing a queue entry
const testCompleteSession = async () => {
    try {
        // Connect to database
        await connectDB();

        // Find the first queue entry
        const queueEntry = await Queue.findOne({ status: 'in-consultation' });

        if (!queueEntry) {
            console.log('No queue entry with "in-consultation" status found');
            process.exit(1);
        }

        console.log(`Found queue entry with ID: ${queueEntry._id}, Position: ${queueEntry.position}, Status: ${queueEntry.status}`);

        // Update the status to completed
        queueEntry.status = 'completed';
        await queueEntry.save();

        console.log(`Updated queue entry to completed status`);

        // Verify positions have been adjusted
        const updatedEntries = await Queue.find({ doctorId: queueEntry.doctorId }).sort({ position: 1 });
        console.log('\nUpdated queue positions:');
        updatedEntries.forEach(entry => {
            console.log(`- Position: ${entry.position}, Status: ${entry.status}`);
        });

        process.exit(0);
    } catch (error) {
        console.error('Error testing complete session:', error);
        process.exit(1);
    }
};

// Run the function
testCompleteSession();