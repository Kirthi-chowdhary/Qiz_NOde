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

  exports.newUser = async (name, email, password) => {
    const query = 'INSERT INTO registered (name,  email, password, type) VALUES (?, ?, ?, ?)';
    try {
      const result = await pool.query(query, [name, email, password, 'user']);
      return result;
    } catch (error) {
      throw error;
    }
  };
  