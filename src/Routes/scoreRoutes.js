const express = require('express');
const score = express.Router();

const scoreController = require('../Controller/scoreController');

module.exports = function (app,routes){
    // To get the score
    app.route('/api/getScore').get(scoreController.score)
}
