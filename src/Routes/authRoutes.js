const express = require('express');
const auth = express.Router();

const authController = require('../Controller/authContorller');

auth.post('/api/register', authController.registerUser );

auth.post('/api/authentication', authController.login );


module.exports = auth;