const mysql = require('mysql2/promise')

require('dotenv').config();

//Connect to database
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
});

pool.getConnection()
  .then((conn) => {
    console.log('Connected to database!')
    conn.release()
  })
  .catch((err) => {
    console.error('Failed to connect to database:', err)
  })

  exports.addQuestion = async(question, choices,questionType)=>{
    try{
        const qusetionInsertion = await pool.query('INSERT into questions (questions, type) VALUES (?, ?)',[question, questionType])
          console.log('Inserted into questions table succesfully')

          const qusetionID = await pool.query(' SELECT questionID from questions where questions =? ',[question])

          const InsertChoices = choices.map( async (choice)=>{
            const id = choice.id
            const value = choice.value
            const answer = choice.answer
            const insertChoice = await pool.query('INSERT into options (questionID, optionID, choice, answer) VALUES (?, ?, ?, ?)',[qusetionID[0][0].questionID, id, value, answer]) 
          })
    }catch(error){
        console.error(error)
    }
  }