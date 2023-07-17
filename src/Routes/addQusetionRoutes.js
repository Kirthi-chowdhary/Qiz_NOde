const express = require('express');
const addQues = express.Router();

const addQuestionController= require('../Controller/addQuestionController')

addQues.post('/api/addQuestion', addQuestionController.addQuestion)

module.exports = addQues