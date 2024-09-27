const express = require('express');
const bodyParser = require('body-parser');
const appointmentRoutes = require('./routes/appointmentRoutes');

const app = express();
app.use(bodyParser.json());

app.use('/api/appointments', appointmentRoutes);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

module.exports = app;
