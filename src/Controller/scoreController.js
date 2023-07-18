const bodyParser = require('body-parser');

const Score =require('../Utill/scoreQuery')

/**
* To get the score of the user
* @param {JSON} req This object contains the data sent from the  request end and is used for getting the score of the user
* @param {JSON} res This object contains the return result
* @return {JSON} res sends the response to the user his score from the database  
*/
exports.score = 
    async(req,res) => {
        bodyParser.json()
        const user = req.query.user

        try{
            const{ score} = await Score.score(user)
            res.status(200).json({ message: 'Your score', score: score });
        } catch (err){
            console.error('An error occurred during login:', err);
        res.status(500).json({ success: false, error: 'Registration failed' });
        }
    }
