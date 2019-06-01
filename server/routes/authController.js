
const express = require('express')
const authRouter = express.Router()
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const logger = require('../shared/logger')
const { dailyLogin } = require('../shared/chart')

// api/authentication/signup
authRouter.post('/signup', (req, res) => {
  let data = req.body
  let newUser = new User(data.user)
  newUser.save((error, data) => {
    if (error) {
      logger.info('/signup => 400 ', error)
      res.status(400).send({ message: error, query: 'signUp', status: 'unsucessful' })
    } else {
      let user = {
        username: data.username,
        id: data.id,
        createDate: data.createDate
      }
      logger.info('/signup => 200 ')
      res.status(200).send({ user: user, query: 'signUp', status: 'sucessful' })
    }
  })
})

const awaitHandlerFactory = (middleware) => {
  return async (req, res, next) => {
    try {
      await middleware(req, res, next)
    } catch (err) {
      next(err)
    }
  }
}

// api/authentication/signin
authRouter.post('/signin', awaitHandlerFactory(async (req, res) => {
  let data = req.body
  let signinUser = new User(data.user)
  await User.findOne({ username: signinUser.username }, (error, user) => {
    if (error) {
      logger.info('/signin => 520 ', error)
      res.status(520).send({ message: error, query: 'signIn', status: 'unsucessful' })
      return
    }
    if (!user || user === undefined) {
      logger.info('/signin => 400 ', 'password or username is not correct')
      return res.status(400).send({
        message: 'password/username is not correct',
        query: 'signIn',
        status: 'unsucessful'
      })
    }
    // verify password
    User.validatePassword(user.password, signinUser.password, async (error, isMatch) => {
      if (error) {
        logger.info('/signin => 400 ', error)
        res.status(400).send({ message: error, query: 'signIn', status: 'unsucessful' })
      }
      if (isMatch) {
        try {
          // token exists
          // check if token is expired
          jwt.verify(user.token, 'secret')
          const usrJson = User.toAuthJSON(user)
          await User.findById(user.id, '-password', (err, data) => {
            if (err) return res.sendStatus(520)
            if (data) {
              data.echart = dailyLogin(user)
              data.save()
              logger.info('api/signin => 200 ')
              return res.status(200).send({ user: usrJson, query: 'signIn', status: 'sucessful' })
            }
          })
        } catch (error) {
          // token is expire
          // generate token
          if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
            const usrJson = User.toAuthJSON(user, true)
            await User.findById(user.id, '-password', (err, data) => {
              if (err) return res.sendStatus(520)
              if (data) {
                data.token = usrJson.token
                data.echart = dailyLogin(user)
                data.save()
                logger.info('api/signin => 200 token refresh')
                res.status(200).send({ user: usrJson, query: 'signIn', status: 'sucessful' })
              }
            })
          } else {
            logger.info('/signin => 400 ', error)
            res.status(400).send({ message: error, query: 'signIn', status: 'unsucessful' })
          }
        }
      } else {
        logger.info('/signin => 403 ', error)
        res.status(403).send({
          query: 'signIn',
          status: 'unsucessful',
          message: 'username/password is not correct'
        })
      }
    })
  })
}))

// api/authentication/signout
authRouter.delete('/signout', verifyToken, (req, res) => {
  User.findByIdAndUpdate(req.userid, { 'token': '' }, { useFindAndModify: false }, (error) => {
    if (error) {
      logger.info('/signout => 520 ', error)
      res.status(520).send({ query: 'signOut', message: error })
    } else {
      logger.info('/signout => 200 ')
      res.status(200).send({ query: 'signOut' })
    }
  })
})

function verifyToken(req, res, next) {
  // verify the Json Token
  if (!req.headers.authorization) {
    logger.info('verifyToken => 401 ', 'Unauthorized request')
    return res.status(401).send('Unauthorized request')
  }
  let token = req.headers.authorization.split(' ')[1]
  if (token === 'null') {
    logger.info('verifyToken => 401 ', 'Unauthorized request')
    return res.status(401).send('Unauthorized request')
  }
  try {
    let payload = jwt.verify(token, 'secret')
    req.username = payload.username
    req.userid = payload.id
  } catch (error) {
    logger.info('verifyToken => 401 ', 'Unauthorized request')
    return res.status(401).send({ error: error })
  }
  next()
}

module.exports = authRouter
