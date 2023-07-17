const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require("body-parser")
app.use(cors())
const port = 3000; // Choose a port number for your server

const authRoute = require('./src/Routes/authRoutes');
const scoreRoute = require('./src/Routes/scoreRoutes')
const quizRoute = require('./src/Routes/quizRoutes')
const addQuestionRoute =require('./src/Routes/addQusetionRoutes')

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

//For adding new Questions
app.use('/',addQuestionRoute)

// For Login and registration
app.use('/', authRoute)

// For setting and submiting Quiz
app.use('/',quizRoute)

//For Getting score
app.use('/', scoreRoute)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})