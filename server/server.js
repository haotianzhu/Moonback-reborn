const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')
const PORT = 3000
const app = express()
const postApi = require('./routes/postController')
const userApi = require('./routes/userController')
const database = 'mongodb://yz:qaz98765432@ds155213.mlab.com:55213/db1'
const timeout = require('connect-timeout'); //express v4

// init connetction to remote database
mongoose.connect(database, { useNewUrlParser: true }, error => {
    if (error) {
        console.error(error)
    } else {
        console.log("connected")
    }
})

app.use(cors())
app.use(timeout('5s')) 
app.use(bodyParser.json())
app.use(haltOnTimedout);
// add api controllers
app.use('/api/posts', postApi)
app.use('/api/authentication', userApi)



app.use(haltOnTimedout)
app.listen(PORT, function () {
    console.log('server running on localhost' + PORT)
})

function haltOnTimedout (error, req, res, next) {
    //https://www.npmjs.com/package/connect-timeout
    if (!req.timedout) {
        next()
    } else {
        res.status(408).send({message: "timeout!"})
    }
}   