const express = require('express');
const Appointment = require('../model/Appointment.js')
const router = express.Router();
const {Doctor} = require('../model/Doctors.js')

/// ✅ Create an appointment
router.post("/", async (req, res) => {
    const { patientName, doctorId, dateTime } = req.body;

    try {
        // Check if doctor exists
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) return res.status(404).json({ error: "Doctor not found" });

        // Create appointment
        const appointment = new Appointment({ patientName, doctorId, dateTime });
        await appointment.save();

        // Send a success response
        res.status(201).json({ message: "Appointment scheduled successfully", appointment });
    } catch (err) {
        console.error("Error scheduling appointment:", err);
        res.status(500).json({ error: err.message });
    }
});


// ✅ Get all appointments
router.get("/", async (req, res) => {
    try {
        const appointments = await Appointment.find().populate("doctorId", "name specialization");
        res.json(appointments);
    } catch (err) {
        res.status(500).json({ error: "Error fetching appointments" });
    }
});

// ✅ Get an appointment by ID
router.get("/:id", async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id).populate("doctorId", "name specialization");
        if (!appointment) return res.status(404).json({ error: "Appointment not found" });
        res.json(appointment);
    } catch (err) {
        res.status(500).json({ error: "Error fetching appointment" });
    }
});

module.exports = router;