const mongoose = require('mongoose');
const Joi = require('joi');

const DoctorSchema = new mongoose.Schema({
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
    specialization: {
        type: String,
        required: true,
    }
},{
    timestamps: true
});

const Doctor = mongoose.model('Doctor', DoctorSchema);

function validateDoctor(doctor) {  // <-- Ensure parameter name is lowercase
    const schema = Joi.object({
        name: Joi.string().min(8).max(255).required(),
        email: Joi.string().min(8).max(255).email().required(),
        age: Joi.number().min(8).max(255).required(),  // <-- Removed `.email()`
        specialization: Joi.string().min(8).max(255).required(), // <-- Fixed `.string(8).min(255).max()`
    });

    return schema.validate(doctor);
}

module.exports = {
    Doctor,
    validateDoctor  // <-- Ensure this is exported correctly
};
