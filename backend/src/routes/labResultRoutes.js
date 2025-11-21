const express = require('express');
const router = express.Router();
const LabResult = require('../models/LabResult');

// Get lab results by doctor ID
router.get('/doctor/:doctorId', async (req, res) => {
    try {
        const { doctorId } = req.params;
        const labResults = await LabResult.find({ doctorId }).sort({ testDate: -1 });
        res.json(labResults);
    } catch (error) {
        console.error('Error fetching lab results:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get lab result by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const labResult = await LabResult.findById(id);
        if (!labResult) {
            return res.status(404).json({ message: 'Lab result not found' });
        }
        res.json(labResult);
    } catch (error) {
        console.error('Error fetching lab result:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create a new lab result
router.post('/', async (req, res) => {
    try {
        const labResult = new LabResult(req.body);
        const savedLabResult = await labResult.save();
        res.status(201).json(savedLabResult);
    } catch (error) {
        console.error('Error creating lab result:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update a lab result
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedLabResult = await LabResult.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedLabResult) {
            return res.status(404).json({ message: 'Lab result not found' });
        }
        res.json(updatedLabResult);
    } catch (error) {
        console.error('Error updating lab result:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete a lab result
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedLabResult = await LabResult.findByIdAndDelete(id);
        if (!deletedLabResult) {
            return res.status(404).json({ message: 'Lab result not found' });
        }
        res.json({ message: 'Lab result deleted successfully' });
    } catch (error) {
        console.error('Error deleting lab result:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;