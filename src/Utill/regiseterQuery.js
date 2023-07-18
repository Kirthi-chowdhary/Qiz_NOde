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
* To add a new user to the database
* @param {string} selectedOptions This object contains data like name sent from the  request 
* @param {string} user This object contains data like email sent from the reqest
* @param {string} password This object contains data like password sent from the request
* @return {string} sends werher the user is sucesdsfully registerd or not   
*/
  exports.newUser = async (name, email, password) => {
    const query = 'INSERT INTO registered (name,  email, password, type) VALUES (?, ?, ?, ?)';
    try {
      const result = await pool.query(query, [name, email, password, 'user']);
      return result;
    } catch (error) {
      throw error;
    }
  };
  