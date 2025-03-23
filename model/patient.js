const mongoose = require('mongoose');
const Joi = require('joi');
const config = require('config');
const jwt = require('jsonwebtoken');

const patientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },

    verified: {
        type: Boolean,
        default: false
    },
    isAdmin: Boolean,
},{
    timestamps: true
});

// Generate Auth Token method
patientSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'));
    return token;
};

// Create the Mongoose model
const Patient = mongoose.model('Patient', patientSchema);

// Validation function
function validatePatient(patient) {
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(50).email().required(),
        age: Joi.number().min(5).max(50).required(),
        password: Joi.string().min(5).max(50).required(),
    });

    return schema.validate(patient);
}

// Correctly export the model and validation function
module.exports = {
    Patient,
    validate: validatePatient,  // Corrected export name
};
