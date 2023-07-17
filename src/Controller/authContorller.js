
const bodyParser = require('body-parser');

const register = require('../Utill/regiseterQuery');

const log =require('../Utill/loginQuery');
const e = require('cors');

exports.registerUser = [
    bodyParser.json(),
    async(req, res) => {
        const {name, email, password} = req.body;

        
    try {
        await register.newUser(name, email, password);
        res.status(200).json({ success: true, message: 'Registration successful' });
      } catch (error) {
        console.error('An error occurred during registration:', error);
        res.status(500).json({ success: false, error: 'Registration failed' });
      }
    }
]

exports.login = [
    bodyParser.json(),
    async(req, res) => {
        const{username, password}= req.body

        try{
            const { user, email, type } = await log.login(username, password)
            res.status(200).json({success: true, user:user, email:email, type: type, message: 'login sucessfull'})
        } catch (err){
            console.error('An error occurred during login:', err);
        res.status(500).json({ success: false, error: 'Registration failed' });
        }
    }
]

