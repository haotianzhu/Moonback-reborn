const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')
const timeout = require('connect-timeout')
const jwt = require('jsonwebtoken')
const path = require('path')
const postApi = require('./routes/postController')
const authApi = require('./routes/authController')
const userApi = require('./routes/userController')
const emailApi = require('./routes/emailController')
const logger = require('./logger')
const database = 'mongodb://yz:qaz98765432@ds155213.mlab.com:55213/db1'
const app = express()
mongoose.set('useCreateIndex', true)
const PORT = process.env.PORT || 3000

// init connetction to remote database
mongoose.connect(database, { useNewUrlParser: true }, error => {
  if (error) {
    logger.error(error)
  } else {
    logger.info('connected')
  }
})

// angualr static file
app.use(express.static(path.join(__dirname, './')))

app.use(cors())
app.use(timeout('10s'))
app.use(bodyParser.urlencoded({ extended: true, limit: '5mb' }))
app.use(bodyParser.json({ limit: '5mb' }))
app.use(haltOnTimedout)
// add api controllers
app.use('/api/email', verifyToken, emailApi)
app.use('/api/posts', verifyToken, postApi)
app.use('/api/authentication', authApi)
app.use('/api/user', verifyToken, userApi)
app.all('/*', function (req, res, next) {
  // Just send the index.html for other files to support HTML5Mode
  res.sendFile('index.html', { root: __dirname })
})

app.use(haltOnTimedout)

app.listen(PORT, function () {
  logger.info('server running on localhost' + PORT)
})

function verifyToken (req, res, next) {
  // verify the Json Token
  if (!req.headers.authorization) {
    return res.status(401).send('Unauthorized request')
  }
  let token = req.headers.authorization.split(' ')[1]
  if (token === 'null') {
    return res.status(401).send('Unauthorized request')
  }
  try {
    let payload = jwt.verify(token, 'secret')
    req.userid = payload.id
    req.username = payload.username
  } catch (error) {
    logger.info('verifyToken => ' + error)
    return res.status(401).send({ error: error })
  }
  next()
}

function haltOnTimedout (error, req, res, next) {
  if (error) {
    logger.error(error)
    if (error.status) {
      res.status(error.status).send({ message: error.message })
      return
    }
  }
  // https://www.npmjs.com/package/connect-timeout
  if (!req.timedout) {
    logger.info(JSON.stringify(req.route))
    next()
  } else {
    res.status(508).send({ message: 'timeout!' })
  }
}
