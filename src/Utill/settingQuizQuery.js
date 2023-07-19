const mysql = require('mysql2/promise')
const NodeCache = require( "node-cache" )
const myCache = new NodeCache()

require('dotenv').config()

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

    /**
* To send the quiz to the user
* @return {JSON} sends a quiz for the user to answer   
*/
  exports.setQuiz = async () =>{
    try{
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
          
          
          var cacheData =myCache.get('questions')
          if(cacheData){
            console.log('From Cache')
            return cacheData
          }
          else{
            const questions = await pool.query(questionQuery)
            myCache.set('questions', questions[0],900000)
            console.log('From Database')
            if (questions[0].length > 0 )  {
              return questions[0]
            }
            
          }
          
    }catch(error){
        console.error('An error occurred while fetching quiz:', error)
        return error
    }
  }