const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Appointment = require('../models/Appointment');
const Queue = require('../models/Queue');

// Get patient analytics data
router.get('/patient-stats', async (req, res) => {
    try {
        // Get total number of patients
        const totalPatients = await User.countDocuments({ role: 'patient' });

        // Calculate recovery rate (mock calculation based on completed appointments)
        const totalAppointments = await Appointment.countDocuments();
        const completedAppointments = await Appointment.countDocuments({ status: 'completed' });
        const recoveryRate = totalAppointments > 0
            ? Math.round((completedAppointments / totalAppointments) * 100)
            : 0;

        // Calculate average wait time (mock calculation based on queue data)
        const queues = await Queue.find({});
        let totalWaitTime = 0;
        let queueCount = queues.length;

        queues.forEach(queue => {
            totalWaitTime += queue.estimatedWaitTime || 0;
        });

        const avgWaitTime = queueCount > 0
            ? Math.round(totalWaitTime / queueCount)
            : 0;

        res.json({
            totalPatients,
            recoveryRate,
            avgWaitTime
        });
    } catch (error) {
        console.error('Error fetching patient analytics:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get doctor-specific analytics data
router.get('/doctor/:doctorId/metrics', async (req, res) => {
    try {
        const { doctorId } = req.params;

        // Get total number of patients treated by this doctor
        const totalPatients = await Appointment.countDocuments({ doctorId });

        // Calculate success rate (completed appointments by this doctor)
        const totalAppointments = await Appointment.countDocuments({ doctorId });
        const completedAppointments = await Appointment.countDocuments({ doctorId, status: 'completed' });
        const successRate = totalAppointments > 0
            ? Math.round((completedAppointments / totalAppointments) * 100)
            : 0;

        // Calculate average consultation time (mock calculation)
        const queues = await Queue.find({ doctorId });
        let totalConsultationTime = 0;
        let queueCount = queues.length;

        queues.forEach(queue => {
            // Assuming estimatedWaitTime represents consultation time for completed appointments
            totalConsultationTime += queue.estimatedWaitTime || 0;
        });

        const avgConsultationTime = queueCount > 0
            ? Math.round(totalConsultationTime / queueCount)
            : 0;

        res.json({
            totalPatients,
            recoveryRate: successRate,
            avgWaitTime: avgConsultationTime
        });
    } catch (error) {
        console.error('Error fetching doctor analytics:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;