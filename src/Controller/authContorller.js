
const bodyParser = require('body-parser');

const register = require('../Utill/regiseterQuery');

const log =require('../Utill/loginQuery');
const e = require('cors');

/**
* To register a new user
* @param {JSON} req This object contains the data sent from the  request end and is used for registering a new user
* @param {JSON} res This object contains the return result
* @return {JSON} res sends the response to the user that weather a new ia added to the database or not 
*/
exports.registerUser = 
    
    async(req, res) => {
        bodyParser.json()
        const {name, email, password} = req.body;

        
    try {
        await register.newUser(name, email, password);
        res.status(200).json({ success: true, message: 'Registration successful' });
      } catch (error) {
        console.error('An error occurred during registration:', error);
        res.status(500).json({ success: false, error: 'Registration failed' });
      }
    }


/**
* To check wether the user is registered or not
* @param {JSON} req This object contains the data like username and password sent from the request end and is used for authentication 
* @param {JSON} res This object contains the return result
* @return {JSON} res sends the response to the user whether he is a registers user or not  
*/
exports.login = 
    async(req, res) => {
        bodyParser.json()
        const{username, password}= req.body

        try{
            const { email, type } = await log.login(username, password)
            res.status(200).json({success: true,  email:email, type: type, message: 'login sucessfull'})
        } catch (err){
            console.error('An error occurred during login:', err);
        res.status(401).json({ success: false, error: 'Invalid Email ID or Password!' });
        }
    }


