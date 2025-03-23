const Joi = require('joi')
const {patient, Patient} = require('../model/patient');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');  
const config = require('config')

// validate input 

router.post('/', async (req,res)=>{
    const {error} = validateLogin(req.body)
    
    if(error) return res.status(400).send(error.details[0].message);

    // check if the email or password already exist
    let patient = await Patient.findOne({email: req.body.email})
    if(!patient) return res.status(400).json({success: false, message:'Invacalid email or password'})

    const validPassword = await bcrypt.compare( req.body.password, patient.password);
    
    if (!validPassword) return res.status(400).send('Invalid email or password');

    // Generaate jsonwebtoken 


  const token  = jwt.sign({_id: patient._id} , 'jwtPrivateKey' )
    res.send(token);
});
// Information Expert Principle 


function validateLogin(req) {
    const schema = Joi.object({
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required(),
    });
    return schema.validate(req); // Pass only the request data
}

module.exports = router;