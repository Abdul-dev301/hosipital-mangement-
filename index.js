
//  DEPENDENCIES 
const express = require('express');
const Joi = require('joi')
const jwt = require('jsonwebtoken');
const app = express();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const config = require('config')

// IMPORT ROUTE 
const patient = require('./routes/patient.js')
const auth = require('./Authentication/auth.js');
const doctorRoute = require('./routes/Doctor.js')
const appointmentRoute= require('./routes/Appointment.js');

if( !config.get('jwtPrivateKey')){
console.error('FATAL ERROR: jwtPrivateKey is not defined.');
process.exit(1);
}


// MIDDLEWARE FUNCTIOIN 
app.use(express.json());
app.use(express.urlencoded({extended: true}))

app.use('/api/patient', patient );
app.use('/api/auth', auth)
app.use('/api/doctor', doctorRoute)
app.use('/api/appointment', appointmentRoute)

// DATABASE CONNECTION TO MONGODB 
mongoose.connect("mongodb://localhost/Hospital")
.then(()=> console.log('Connected to Database....'))
.catch(err=>console.log('Not Connected to Database...', err));

  

  
  
  
//SERVER CONNECTION 
const port = process.env.PORT || 3000
app.listen(port,()=>console.log(`Server is listnening to ${port}`))