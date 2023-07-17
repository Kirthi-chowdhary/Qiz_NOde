const bodyParser = require('body-parser');

const Quiz =require('../Utill/settingQuizQuery')
const Answers =require('../Utill/answersQuery')

exports.Quiz =[
    bodyParser.json(),
    async(req,res) =>{
        try{
            const questions = await Quiz.setQuiz()
            console.log(questions)
            res.status(200).send({ questions: questions })
        }catch(error){
            console.error('An error occurred while getting quiz:', err);
            res.status(500).json({ success: false, error: 'getting quiz  failed' });
        }
    }
]

exports.Answers =[
    bodyParser.json(),
    async(req,res) =>{
        try{
            const{selectedOptions,user}=req.body

            const score = await Answers.answers(selectedOptions,user)
            res.status(200).json({ message: 'Quiz data received successfully.', score: score })
        }catch(error){
            console.error('An error occurred while submiting the quiz:', error);
            res.status(500).json({ success: false, error: 'submiting the quiz  failed' });
        }
    }
]