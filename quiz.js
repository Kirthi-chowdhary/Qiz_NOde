const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require("body-parser")
app.use(cors())
const port = 3000; // Choose a port number for your server

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

const mysql = require('mysql2/promise')

//Connect to database
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'quiz'
  })


  pool.getConnection()
      .then((conn) => {
        console.log('Connected to database!')
        conn.release()
      })
      .catch((err) => {
        console.error('Failed to connect to database:', err)
      })

      //Registration
      app.post('/api/register', async (req, res) => {
       try{
        // Extract the registration data from the request body
        const { name, email, password } = req.body
        const type = 'user'
        // Inserting the data into the table
        await pool.query(`
        INSERT INTO registered (name,  email, password, type) VALUES (?, ?, ?,?)        
        `, [name,  email,  password, type])
    
        console.log('New user created successfully')
        //Sending response to the user
        res.status(200).json({success: true, message: 'registeration sucessfull'})
       }catch(error){
        console.error('An error occurred during registration:',error)
        res.status(500).json({ success: false, error: 'Registration failed' })
       }
      })



      //Login Authentication
      app.post('/api/authentication', async (req, res) =>{
        try{
            // Extract the login data from the request body
            const{username, password}= req.body
            //getting data from the registered table
            const [rows] = await pool.query(`SELECT * FROM registered WHERE email = ? AND password = ?`,
            [username, password])

            const type= rows[0].type
            
            let email=username

            //If user present
            if (rows.length > 0) {              
                const { name } = rows[0]
                
                let user=name
                
                res.status(200).json({success: true, user:name, email:username, type: type, message: 'login sucessfull'})

              } else {
                // User is not authenticated, display error message
                res.status(500).json({ success: false, error: 'login failed' })
              }
        }catch(error){
            console.error(error)
        }
      })


      //Adding Question
      app.post('/api/addQuestion', async (req, res) => {
        try{
          const {question, choices,questionType} = req.body
          console.log(question)
          console.log(choices)
          console.log('Question Type:', questionType)

          const qusetionInsertion = await pool.query('INSERT into questions (questions, type) VALUES (?, ?)',[question, questionType])
          console.log('Inserted into questions table succesfully')

          const qusetionID = await pool.query(' SELECT questionID from questions where questions =? ',[question])
          console.log(qusetionID[0][0].questionID)

          const InsertChoices = choices.map( async (choice)=>{
            const id = choice.id
            const value = choice.value
            const answer = choice.answer
            console.log(id)
            console.log(value)
            console.log(answer);
            const insertChoice = await pool.query('INSERT into options (questionID, optionID, choice, answer) VALUES (?, ?, ?, ?)',[qusetionID[0][0].questionID, id, value, answer]) 
          })
          res.status(200).json({success: true, message: 'question added successfully sucessfull'})

         }catch(err){
          console.error(err)
        }
      })

      
      // Sending quiz
      app.get('/api/sendingquiz', async (req, res) => {
        try {
          // Retriving random 10 questions from the table
          const randQuestions = await pool.query(
            'SELECT * from questions ORDER BY RAND() LIMIT 10'
            )

            const questionIDs = randQuestions[0].map( (row)=>{
              return row.questionID

            })

          // Retrieve options based on the questionIDs
          const optionsQuery = `
            SELECT questionID, optionID, choice
            FROM options
            WHERE questionID IN (${questionIDs.join(',')})
            `
            const options = await pool.query(optionsQuery)
   
            if (randQuestions[0].length > 0 && options[0].length > 0)  {
              res.status(200).send({ questions: randQuestions[0], options: options[0], questionIDs: questionIDs })
            } else {
              res.status(200).send([]); // Empty array if no results found
            }
          } catch (error) {
            console.error('An error occurred while fetching quiz:', error)
            res.status(500).send({ error: error.message })
          }
        });



      // submiting quiz
      app.post('/api/submitquiz', async(req, res)=>{
        const{selectedOptions,questionIDs,user}=req.body

        const answersQuery = `
          SELECT questionID,optionID,answer
          FROM options
          WHERE questionID IN (${questionIDs.join(',')})
          `
        const [answers] = await pool.query(answersQuery)

        let score=0

        //selecting correct answer
        selectedOptions.forEach((selectedOption) => {

        const correctAnswer = answers.find(
          (answer) =>
            answer.questionID === selectedOption.question &&
            answer.optionID === selectedOption.option
        )
  
        //tallying the score
        if (correctAnswer && correctAnswer.answer == 1 && correctAnswer.optionID == selectedOption.option) {
        
          score++;
        }
        });    

        // geting data from score table
        const scoreQuery =await pool.query('SELECT * from score where email= ?', [user.user.email])

        //checking if any data is being fetched or not 
        if(scoreQuery[0].length >0){
      
          const update= await pool.query('UPDATE score set score= ?',[score])
          console.log('Updation succesfull')
        }else{

          const insert= await pool.query('INSERT into score (email, score) VALUES (?, ?)',[user.user.email, score])
          console.log('Insertion succesfull')
        }

        res.status(200).json({ message: 'Quiz data received successfully.', score: score })
  
      })



      // To get the score
      app.get('/api/getScore', async(req, res) =>{

        const user = req.query.user

        let scores
        if (user.user.email)
       { 
         scores =await pool.query('SELECT score from score where email= ?', [user.user.email])
       }
       else{
          scores =await pool.query('SELECT score from score where email= ?', [user.user.user.email])
       }

        // getting the score
        const score= scores[0][0].score

        //sending the score
        if (scores.length > 0 && score !== undefined) {
    
          res.status(200).json({ message: 'Your score', score: score });
        } else {
          console.log('No score found');
          res.status(200).json({ message: 'No score found' });
        }
      })
      

      app.listen(port, () => {
        console.log(`Server is running on port ${port}`)
      })
