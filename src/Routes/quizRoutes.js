const express = require('express');
const quiz = express.Router();

const quizController = require('../Controller/quizController');

//For sending quiz
quiz.get('/api/sendingquiz', quizController.Quiz );

//For submiting quiz
quiz.post('/api/submitquiz', quizController.Answers );

module.exports = function (app,routes){
    //For sending quiz
    app.route('/api/sendingquiz').get(quizController.Quiz)
    //For submiting quiz
    app.route('/api/submitquiz').post(quizController.Answers)
}
