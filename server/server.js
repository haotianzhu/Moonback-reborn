const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')
const PORT = 3000
const app = express()
const postApi = require('./routes/postController')
const database = 'mongodb://yz:qaz98765432@ds155213.mlab.com:55213/db1'

// init connetction to remote database
mongoose.connect(database, { useNewUrlParser: true }, error => {
    if (error) {
        console.error(error)
    } else {
        console.log("connected")
    }
})

app.use(cors())
app.use(bodyParser.json())
// add api controllers
app.use('/api/posts', postApi)

app.listen(PORT, function () {
    console.log('server running on localhost' + PORT)
})