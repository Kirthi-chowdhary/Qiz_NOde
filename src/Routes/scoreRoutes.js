const express = require('express');
const score = express.Router();

const scoreController = require('../Controller/scoreController');

score.get('/api/getScore', scoreController.score );

module.exports = score;