// src/routes/appointmentRoutes.js
const express = require('express');
const router = express.Router();
const appointmentModel = require('../models/appointmentModel');

router.post('/book', (req, res) => {
    const { firstName, lastName, email, timeSlot, doctorName } = req.body;
    if (!firstName || !lastName || !email || !timeSlot || !doctorName) {
        return res.status(400).json({ message: 'Missing required fields' });
    }
    const appointment = { firstName, lastName, email, timeSlot, doctorName };
    appointmentModel.appointments.push(appointment);
    res.status(201).json({ appointment });
});

router.get('/details/:email', (req, res) => {
    const { email } = req.params;
    const appointment = appointmentModel.appointments.find(app => app.email === email);
    if (!appointment) {
        return res.status(404).json({ message: 'Appointment not found' });
    }
    res.status(200).json({ appointment });
});

router.get('/by-doctor/:doctorName', (req, res) => {
    const { doctorName } = req.params;
    const appointments = appointmentModel.appointments.filter(app => app.doctorName === doctorName);
    res.status(200).json({ appointments });
});

router.put('/modify', (req, res) => {
    const { email, originalTimeSlot, newTimeSlot } = req.body;
    const appointment = appointmentModel.appointments.find(app => app.email === email && app.timeSlot === originalTimeSlot);
    if (!appointment) {
        return res.status(404).json({ message: 'Appointment not found' });
    }
    appointment.timeSlot = newTimeSlot;
    res.status(200).json({ appointment });
});

router.delete('/cancel', (req, res) => {
    const { email, timeSlot } = req.body;
    const index = appointmentModel.appointments.findIndex(app => app.email === email && app.timeSlot === timeSlot);
    if (index === -1) {
        return res.status(404).json({ message: 'Appointment not found' });
    }
    appointmentModel.appointments.splice(index, 1);
    res.status(200).json({ message: 'Appointment cancelled' });
});

module.exports = router;
