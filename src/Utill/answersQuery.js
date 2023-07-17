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

  exports.answers = async(selectedOptions,user)=>{
    const questionIDs = selectedOptions.map((option) => option.question)
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
        //   if(user.user.user.email){
      //     const scoreQuery =await pool.query('SELECT * from score where email= ?', [user.user.user.email])
      //     //checking if any data is being fetched or not
      //     if(scoreQuery[0].length >0){
      
      //       const update= await pool.query('UPDATE score set score= ? where email =?',[score,user.user.user.email])
      //       console.log('Updation succesfull')
      //     }else{
  
      //       const insert= await pool.query('INSERT into score (email, score) VALUES (?, ?)',[user.user.user.email, score])
      //       console.log('Insertion succesfull')
      //     }
      //   }
      //   else{
      //     const scoreQuery =await pool.query('SELECT * from score where email= ?', [user.user.user.user.email])
      //     //checking if any data is being fetched or not
      //     if(scoreQuery[0].length >0){
      
      //       const update= await pool.query('UPDATE score set score= ? where email =?',[score,user.user.user.user.email])
      //       console.log('Updation succesfull')
      //     }else{
  
      //       const insert= await pool.query('INSERT into score (email, score) VALUES (?, ?)',[user.user.user.user.email, score])
      //       console.log('Insertion succesfull')
      //     }
      //   }
        return score
        
  }