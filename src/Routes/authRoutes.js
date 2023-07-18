const express = require('express');
const auth = express.Router();

const authController = require('../Controller/authContorller');

module.exports = function (app,routes){
    // For registration
    app.route('/api/register').post(authController.registerUser)
    // For Login (authentication)
    app.route('/api/authentication').post(authController.login)
}

