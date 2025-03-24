const { number } = require("joi");
const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true},
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
    appointmentDate: { type: Date, required: true },
    phone: { type : Number, required: true},
    
});

const Appointment = mongoose.model("Appointment", AppointmentSchema);
module.exports = Appointment;
