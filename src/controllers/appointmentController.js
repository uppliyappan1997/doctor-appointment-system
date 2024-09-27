const appointmentModel = require('../models/appointmentModel');

const bookAppointment = (req, res) => {
    const { firstName, lastName, email, timeSlot, doctorName } = req.body;
    const appointment = { firstName, lastName, email, timeSlot, doctorName };
    appointmentModel.addAppointment(appointment);
    res.status(201).json({ message: 'Appointment booked successfully', appointment });
};

const viewAppointmentDetails = (req, res) => {
    const { email } = req.params;
    const appointment = appointmentModel.getAppointmentByEmail(email);
    if (appointment) {
        res.json({ appointment });
    } else {
        res.status(404).json({ message: 'Appointment not found' });
    }
};

const viewAllAppointmentsByDoctor = (req, res) => {
    const { doctorName } = req.params;
    const appointments = appointmentModel.getAllAppointmentsByDoctor(doctorName);
    res.json({ appointments });
};

const cancelAppointment = (req, res) => {
    const { email, timeSlot } = req.body;
    const success = appointmentModel.cancelAppointment(email, timeSlot);
    if (success) {
        res.json({ message: 'Appointment cancelled successfully' });
    } else {
        res.status(404).json({ message: 'Appointment not found' });
    }
};

const modifyAppointment = (req, res) => {
    const { email, oldTimeSlot, newTimeSlot } = req.body;
    const appointment = appointmentModel.modifyAppointment(email, oldTimeSlot, newTimeSlot);
    if (appointment) {
        res.json({ message: 'Appointment modified successfully', appointment });
    } else {
        res.status(404).json({ message: 'Appointment not found' });
    }
};

module.exports = {
    bookAppointment,
    viewAppointmentDetails,
    viewAllAppointmentsByDoctor,
    cancelAppointment,
    modifyAppointment
};
