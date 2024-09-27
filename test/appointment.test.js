// test/appointment.test.js
const request = require('supertest');
const app = require('../src/app'); // Import your Express app
const appointmentModel = require('../src/models/appointmentModel');

describe('Appointment API', () => {
    beforeEach(() => {
        // Clear the in-memory data before each test
        appointmentModel.appointments.length = 0;
    });

    test('should book an appointment', async () => {
        const response = await request(app)
            .post('/api/appointments/book')
            .send({
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                timeSlot: '10:00 AM - 11:00 AM',
                doctorName: 'Dr. Smith',
            });
        expect(response.statusCode).toBe(201);
        expect(response.body.appointment.email).toBe('john.doe@example.com');
    });

    test('should view appointment details', async () => {
        // First, book an appointment
        await request(app)
            .post('/api/appointments/book')
            .send({
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                timeSlot: '10:00 AM - 11:00 AM',
                doctorName: 'Dr. Smith',
            });

        // Then, view the appointment details
        const response = await request(app)
            .get('/api/appointments/details/john.doe@example.com');
        expect(response.statusCode).toBe(200);
        expect(response.body.appointment.email).toBe('john.doe@example.com');
    });

    test('should list all appointments by doctor', async () => {
        // Book appointments
        await request(app)
            .post('/api/appointments/book')
            .send({
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                timeSlot: '10:00 AM - 11:00 AM',
                doctorName: 'Dr. Smith',
            });
        await request(app)
            .post('/api/appointments/book')
            .send({
                firstName: 'Jane',
                lastName: 'Doe',
                email: 'jane.doe@example.com',
                timeSlot: '11:00 AM - 12:00 PM',
                doctorName: 'Dr. Smith',
            });

        // List appointments by doctor
        const response = await request(app)
            .get('/api/appointments/by-doctor/Dr. Smith');
        expect(response.statusCode).toBe(200);
        expect(response.body.appointments.length).toBe(2);
    });

    test('should modify an appointment', async () => {
        // First, book an appointment
        await request(app)
            .post('/api/appointments/book')
            .send({
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                timeSlot: '10:00 AM - 11:00 AM',
                doctorName: 'Dr. Smith',
            });

        // Modify the appointment
        const response = await request(app)
            .put('/api/appointments/modify')
            .send({
                email: 'john.doe@example.com',
                originalTimeSlot: '10:00 AM - 11:00 AM',
                newTimeSlot: '11:00 AM - 12:00 PM',
            });
        expect(response.statusCode).toBe(200);
        expect(response.body.appointment.timeSlot).toBe('11:00 AM - 12:00 PM');
    });

    test('should cancel an appointment', async () => {
        // First, book an appointment
        await request(app)
            .post('/api/appointments/book')
            .send({
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                timeSlot: '10:00 AM - 11:00 AM',
                doctorName: 'Dr. Smith',
            });

        // Cancel the appointment
        const response = await request(app)
            .delete('/api/appointments/cancel')
            .send({
                email: 'john.doe@example.com',
                timeSlot: '10:00 AM - 11:00 AM',
            });
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Appointment cancelled');
    });
});
