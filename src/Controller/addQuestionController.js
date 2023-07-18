
const bodyParser = require('body-parser');

const AddQuestion = require('../Utill/addQusetionQuery')

/**
* To add new question to the database
* @param {JSON} req This object contains the data like the new question we need to add along with it's choices and the correct answer and the type of question is sent from the  request end and is used for getting it to the database
* @param {JSON} res This object contains the return result
* @return {JSON} res sends the response to the user wether the question along with the choices and answer is added to the database or not  
*/
exports.addQuestion = 
    async(req,res) =>{
        bodyParser.json()
        const {question, choices,questionType} = req.body
        try{
            await AddQuestion.addQuestion(question, choices,questionType)
            res.status(200).json({success: true, message: 'question added successfully sucessfull'})
        }catch(err){
            console.error('An error occurred during addting the question:', err);
        res.status(500).json({ success: false, error: 'Adding new question failed' });
        }
    }
