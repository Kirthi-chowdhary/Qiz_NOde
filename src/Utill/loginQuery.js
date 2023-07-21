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
    conn.release()
  })
  .catch((err) => {
    console.error('Failed to connect to database:', err)
  })

  /**
* To authenticate a user
* @param {JSON} username This object contains the data like username sent from the  request 
* @param {JSON} password This object contains the data like password sent from the request
* @return {JSON} sends the user email and type of user   
*/
  exports.login = async (username, password) =>{
    const query = `SELECT * FROM registered WHERE email = ? AND password = ?`
    try{
        const result = await pool.query(query, [username,password])
        const type= result[0][0].type

        let email=username
         //If user present
         if (result.length > 0) {      
            const { name } = result[0]  
            const user=name
            return { email, type}
          } 
    } catch(error){
        console.error(error)
    }
  }