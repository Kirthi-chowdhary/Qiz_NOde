const bodyParser = require('body-parser');

const Score =require('../Utill/scoreQuery')

exports.score = [
    bodyParser.json(),
    async(req,res) => {
        const user = req.query.user

        try{
            const{ score} = await Score.score(user)
            res.status(200).json({ message: 'Your score', score: score });
        } catch (err){
            console.error('An error occurred during login:', err);
        res.status(500).json({ success: false, error: 'Registration failed' });
        }
    }
]