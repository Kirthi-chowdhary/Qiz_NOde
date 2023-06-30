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
        const { name, email, password } = req.body;
        // Inserting the data into the table
        await pool.query(`
        INSERT INTO registered (name,  email, password) VALUES (?, ?, ?)        
        `, [name,  email,  password])
    
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
            let email=username

            //If user present
            if (rows.length > 0) {              
                const { name } = rows[0]
                console.log(name)
                let user=name
                
                res.status(200).json({success: true, user:name, email:username, message: 'login sucessfull'})

              } else {
                // User is not authenticated, display error message
                res.status(500).json({ success: false, error: 'login failed' })
              }
        }catch(error){
            console.error(error)
        }
      })

      
app.get('/api/sendingquiz', async (req, res) => {
  try {
    // Retriving random 10 questions from the table
    const randQuestions = await pool.query(
      'SELECT * from questions ORDER BY RAND() LIMIT 10'
    )

    const questionIDs = randQuestions[0].map( (row)=>{
      return row.questionID

    })
    // console.log(questionIDs)

    // Retrieve options based on the questionIDs
    const optionsQuery = `
      SELECT questionID, optionID, choice
      FROM options
      WHERE questionID IN (${questionIDs.join(',')})
    `
    const options = await pool.query(optionsQuery)
    // console.log(options[0])
    
      // console.log(randQuestions[0])
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

app.post('/api/submitquiz', async(req, res)=>{
  const{selectedOptions,questionIDs}=req.body
  
  // console.log(selectedOptions)
  // console.log(questionIDs)
  const answersQuery = `
      SELECT questionID,optionID,answer
      FROM options
      WHERE questionID IN (${questionIDs.join(',')})
    `
    const [answers] = await pool.query(answersQuery)

    // console.log(answers)

    let score=0

    for (const questionID in selectedOptions) {
      const selectedOptionID = selectedOptions[questionID];

      // console.log(selectedOptionID)
      // Find the corresponding answer for the question
      for(const questionId  in questionIDs){
        const answer = answers.map((row) => {
          if(row.questionID===questionId && row.answer == 1){
            return  {
              question : row.questionID,
              answer : row.answer,
              option : row.optiionID
            }
          }
        })
      }
      
      console.log(answer)

      // If the selected option is correct, increment the score
      if (Number(selectedOptionID) === answer) {
        score++;
      }
    }

    console.log('Score:', score);

    res.status(200).json({ message: 'Quiz data received successfully.', score });
  
  

})
      

      app.listen(port, () => {
        console.log(`Server is running on port ${port}`)
      })