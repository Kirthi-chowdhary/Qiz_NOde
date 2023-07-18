const express = require('express');
const score = express.Router();

const scoreController = require('../Controller/scoreController');

module.exports = function (app,routes){
    app.route('/api/getScore').get(scoreController.score)
}
