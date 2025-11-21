const mongoose = require('mongoose');

const labResultSchema = new mongoose.Schema({
    patientId: {
        type: String,
        required: true,
        ref: 'User'
    },
    doctorId: {
        type: String,
        required: true,
        ref: 'User'
    },
    testType: {
        type: String,
        required: true
    },
    testDate: {
        type: Date,
        required: true
    },
    collectionDate: {
        type: Date,
        required: true
    },
    reportedDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['normal', 'abnormal', 'pending'],
        required: true
    },
    results: [{
        name: String,
        value: String,
        unit: String,
        referenceRange: String,
        status: {
            type: String,
            enum: ['normal', 'high', 'low']
        }
    }],
    patientAge: Number,
    patientGender: String,
    bloodType: String,
    comments: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('LabResult', labResultSchema);