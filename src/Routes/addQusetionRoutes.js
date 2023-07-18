const express = require('express');
const addQues = express.Router();

const addQuestionController= require('../Controller/addQuestionController')

module.exports = function (app,routes){
    app.route('/api/addQuestion').post(addQuestionController.addQuestion)
}