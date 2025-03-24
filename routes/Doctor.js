// Dependenceies 
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {Doctor, validateDoctor}= require('../model/Doctors.js')
const _ = require('lodash');


router.post('/register', async (req, res) => {
    console.log('Received Request body:', req.body);
    console.log("Calling validate function...")
    const validationResult = validateDoctor(req.body);

    console.log("Validation result:", validationResult)
    if (validationResult.error) return res.status(400).send(validationResult.error.details[0].message);

    // Check if Doctor already exists
    let doctor = await Doctor.findOne({ email: req.body.email });
    if (doctor) return res.status(400).json({ success: false, message: 'Doctor already exists' });

    // Create a new Doctor
    try {
        doctor = new Doctor(_.pick(req.body, ['name', 'age', 'email', 'specialization']));
        await doctor.save();
        res.json({ message: 'Doctor added Successfully', doctor });
    } catch (err) {
        res.status(500).json({ message: 'Error Creating doctor', error: err.message });
    }
});

// GET ALL DOCTORS
router.get('/', async (req, res) => {
    try {
        const doctors = await Doctor.find();
        res.json(doctors);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching doctors', error: err.message });
    }
});

// GET DOCTOR BY ID
router.get('/:id', async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id);
        if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
        res.json(doctor);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching Doctor', error: err.message });
    }
});

// UPDATE DOCTOR BY ID
router.put('/:id', async (req, res) => {
    console.log('Received Request body:', req.body);
    
    const validationResult = validateDoctor(req.body);
    if (validationResult.error) return res.status(400).send(validationResult.error.details[0].message);

    try {
        const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!doctor) return res.status(404).json({ error: 'Doctor not found' });
        res.json({ message: 'Doctor updated Successfully', doctor });
    } catch (err) {
        res.status(500).json({ error: 'Error updating Doctor', details: err.message });
    }
});

// DELETE DOCTOR  
router.delete('/:id', async (req, res) => {
    try {
        const doctor = await Doctor.findByIdAndDelete(req.params.id);
        if (!doctor) return res.status(404).json({ error: 'Doctor not found' });
        res.json({ message: 'Doctor deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Error deleting Doctor', details: err.message });
    }
});

module.exports = router;
