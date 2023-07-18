const express = require('express')
const app = express()
const routes = express.Router();
const cors = require('cors')
const bodyParser = require("body-parser")
app.use(cors())
const port = 3000; // Choose a port number for your server

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


app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})