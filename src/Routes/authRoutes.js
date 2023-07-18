const express = require('express');
const auth = express.Router();

const authController = require('../Controller/authContorller');

module.exports = function (app,routes){
    app.route('/api/register').post(authController.registerUser)
    app.route('/api/authentication').post(authController.login)
}

