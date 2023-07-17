
const bodyParser = require('body-parser');

const AddQuestion = require('../Utill/addQusetionQuery')

exports.addQuestion = [
    bodyParser.json(),
    async(req,res) =>{
        const {question, choices,questionType} = req.body
        try{
            await AddQuestion.addQuestion(question, choices,questionType)
            res.status(200).json({success: true, message: 'question added successfully sucessfull'})
        }catch(err){
            console.error('An error occurred during addting the question:', err);
        res.status(500).json({ success: false, error: 'Adding new question failed' });
        }
    }
]