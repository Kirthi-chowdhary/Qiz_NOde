const bodyParser = require('body-parser');

const Quiz =require('../Utill/settingQuizQuery')
const Answers =require('../Utill/answersQuery')

/**
* To send the quiz to the user
* @param {JSON} req This object contains the request from the user to get quiz question
* @param {JSON} res This object contains the return result
* @return {JSON} res sends 10 random questions selected from the database to the user  
*/
exports.Quiz =
    async(req,res) =>{
        bodyParser.json()
        try{
            const questions = await Quiz.setQuiz()
            res.status(200).send({ questions: questions })
        }catch(error){
            console.error('An error occurred while getting quiz:', err);
            res.status(500).json({ success: false, error: 'getting quiz  failed' });
        }
    }

/**
* To grade the quiz
* @param {JSON} req This object contains the data like selected options and user data sent from the  request end and is used for grading
* @param {JSON} res This object contains the return result
* @return {JSON} res sends the response to the user along with his score he got for the quiz he attended 
*/
exports.Answers =
    async(req,res) =>{
        bodyParser.json()
        try{
            const{selectedOptions,user}=req.body

            const score = await Answers.answers(selectedOptions,user)
            res.status(200).json({ message: 'Quiz data received successfully.', score: score })
        }catch(error){
            console.error('An error occurred while submiting the quiz:', error);
            res.status(500).json({ success: false, error: 'submiting the quiz  failed' });
        }
    }
