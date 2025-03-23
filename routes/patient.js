const express = require('express');
const app = express();
const router = express.Router();
const { Patient, validate } = require('../model/patient.js'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const admin = require('../middleware/admin.js');
const auth1 = require('../middleware/protecting.js');

// Signup Route

router.post('/', async (req, res) => {
    console.log("Received request body:", req.body);
    console.log("Calling validate function...");
    
    const validationResult = validate(req.body);
    console.log("Validation result:", validationResult);

    if (validationResult.error) {
        return res.status(400).send(validationResult.error.details[0].message);
    }
    
    // Check if patient already exists
    let patient = await Patient.findOne({ email: req.body.email });
    if (patient) return res.status(400).json({ message: "User already exists" });

    // Create new patient
    patient = new Patient(_.pick(req.body, ['name', 'email', 'password', 'age']));

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    patient.password = await bcrypt.hash(patient.password, salt);
    await patient.save();

    // Generate token
    const token = patient.generateAuthToken();
    res.header('x-auth-token', token).send(_.pick(patient, ['_id', 'name', 'email', 'age']));
});


// Delete Patient by ID (Admin Only)
router.delete('/:id', [auth1, admin], async (req, res) => {
    try {
        const patient = await Patient.findByIdAndDelete(req.params.id);

        if (!patient) {
            return res.status(404).send("Patient not found.");
        }

        res.send({ message: "Patient deleted successfully" });
    } catch (error) {
        res.status(500).send("Something went wrong.");
    }
});

console.log(validate);


module.exports = router;