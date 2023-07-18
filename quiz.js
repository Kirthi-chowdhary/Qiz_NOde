const express = require('express')
const app = express()
const routes = express.Router();
const cors = require('cors')
const bodyParser = require("body-parser")
app.use(cors())
require('dotenv').config()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

//For adding new Questions
require('./src/Routes/addQusetionRoutes')(app,routes)

// For Login and registration
require('./src/Routes/authRoutes')(app,routes)

// For setting and submiting Quiz
require('./src/Routes/quizRoutes')(app,routes)

//For Getting score
require('./src/Routes/scoreRoutes')(app,routes)

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`)
})