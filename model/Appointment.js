const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema({
    patientName: { type: String, required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
    dateTime: { type: Date, required: true }
});

const Appointment = mongoose.model("Appointment", AppointmentSchema);
module.exports = Appointment;
