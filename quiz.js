const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require("body-parser")
app.use(cors())
const port = 3000; // Choose a port number for your server

const authRoute = require('./src/Routes/authRoutes');
const scoreRoute = require('./src/Routes/scoreRoutes')

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// For Login and registration
app.use('/', authRoute)

//For Getting score
app.use('/', scoreRoute)

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

      

      //Adding Question
      app.post('/api/addQuestion', async (req, res) => {
        try{
          const {question, choices,questionType} = req.body

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
          // Retriving random 10 questions along with their choices from the table
 
          const questionQuery = `
          SELECT sub.questionID, sub.questions, o.optionID, o.choice
          FROM (
            SELECT q.questionID, q.questions
            FROM questions q
            ORDER BY RAND()
            LIMIT 10
          ) sub
          JOIN options o ON sub.questionID = o.questionID
          ORDER BY sub.questionID ASC
            `
            const questions = await pool.query(questionQuery)
            if (questions[0].length > 0 )  {
              res.status(200).send({ questions: questions[0] })
            }
          } catch (error) {
            console.error('An error occurred while fetching quiz:', error)
            res.status(500).send({ error: error.message })
          }
        });



      // submiting quiz
      app.post('/api/submitquiz', async(req, res)=>{
        const{selectedOptions,user}=req.body

        const questionIDs = selectedOptions.map((option) => option.question)
        console.log(questionIDs)

        const answersQuery = `
          SELECT questionID,optionID,answer
          FROM options
          WHERE questionID IN (${questionIDs.join(',')}) and answer = 1
          `
        const [answers] = await pool.query(answersQuery)
        console.log(user)

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

        console.log(score,'score')


        // geting data from score table
        if(user.user.email){
          const scoreQuery =await pool.query('SELECT * from score where email= ?', [user.user.email])
          //checking if any data is being fetched or not
          if(scoreQuery[0].length >0){
      
            const update= await pool.query('UPDATE score set score= ? where email =?',[score,user.user.email])
            console.log('Updation succesfull')
          }else{
  
            const insert= await pool.query('INSERT into score (email, score) VALUES (?, ?)',[user.user.email, score])
            console.log('Insertion succesfull')
          }
        }
        if(user.user.user.email){
          const scoreQuery =await pool.query('SELECT * from score where email= ?', [user.user.user.email])
          //checking if any data is being fetched or not
          if(scoreQuery[0].length >0){
      
            const update= await pool.query('UPDATE score set score= ? where email =?',[score,user.user.user.email])
            console.log('Updation succesfull')
          }else{
  
            const insert= await pool.query('INSERT into score (email, score) VALUES (?, ?)',[user.user.user.email, score])
            console.log('Insertion succesfull')
          }
        }
        else{
          const scoreQuery =await pool.query('SELECT * from score where email= ?', [user.user.user.user.email])
          //checking if any data is being fetched or not
          if(scoreQuery[0].length >0){
      
            const update= await pool.query('UPDATE score set score= ? where email =?',[score,user.user.user.user.email])
            console.log('Updation succesfull')
          }else{
  
            const insert= await pool.query('INSERT into score (email, score) VALUES (?, ?)',[user.user.user.user.email, score])
            console.log('Insertion succesfull')
          }
        }

        res.status(200).json({ message: 'Quiz data received successfully.', score: score })
  
      })

      

      app.listen(port, () => {
        console.log(`Server is running on port ${port}`)
      })
