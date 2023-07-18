const express = require('express');
const addQues = express.Router();

const addQuestionController= require('../Controller/addQuestionController')

module.exports = function (app,routes){
    //For adding new qusetions to the database
    app.route('/api/addQuestion').post(addQuestionController.addQuestion)
}