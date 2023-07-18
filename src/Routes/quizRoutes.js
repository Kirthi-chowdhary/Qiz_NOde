const express = require('express');
const quiz = express.Router();

const quizController = require('../Controller/quizController');

module.exports = function (app,routes){
    //For sending quiz
    app.route('/api/sendingquiz').get(quizController.Quiz)
    //For submiting quiz
    app.route('/api/submitquiz').post(quizController.Answers)
}
