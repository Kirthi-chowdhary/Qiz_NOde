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

    /**
* To get the grade of the user
* @param {JSON} user This object contains the data like who is attending the quiz
* @return {number} sends the score   
*/
  exports.score = async (User) =>{
    const query = `SELECT score from score where email= ?`

    var scores

    try{
        if (User.user.email){
            scores =await pool.query(query,[User.user.email])
        }
        else{
            scores =await pool.query(query,[User.user.user.email])
        }

       // getting the score
       const score= scores[0][0].score
       //sending the score
       if (scores.length > 0 && score !== undefined) {
    
        return {score}
      } else {
        console.log('No score found');
        
      }
    }catch(err){
        console.log(err)
    }
  }