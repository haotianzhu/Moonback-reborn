const express = require('express')
const userRouter = express.Router()
const User = require('../models/user')
const logger = require('../logger')

// GET api/user/:id
userRouter.get('/:id', (req, res) => {
  const authUserid = req.userid
  const authUsername = req.username
  var hasAuth = false
  if (authUserid && authUserid !== undefined && authUsername && authUsername !== undefined) {
    hasAuth = true
  }
  if (hasAuth) {
    User.findById(req.params.id, '-password -token', (error, data) => {
      if (error) {
        logger.info('GET user/:id => 520 ', error)
        res.status(520).send({ query: 'findUserById', message: error })
      }
      if (data) {
        logger.info('GET user/:id => 200')
        res.status(200).send({ query: 'findUserById', user: data })
      } else {
        logger.info('GET user/:id => 404', 'not found')
        res.status(404).send({ query: 'findUserById', status: 'unsucessful' })
      }
    })
  } else {
    logger.info('GET user/:id => 401', 'unauth')
    res.status(401).send({ query: 'findUserById', status: 'unsucessful' })
  }
})

// PATCH api/user/:id
userRouter.patch('/:id', (req, res) => {
  // update user
  // check permission
  var hasPermission = false
  const authUserid = req.userid
  if (authUserid && authUserid !== undefined && authUserid === req.params.id) {
    hasPermission = true
  }
  var reqData = req.body
  var reqUser = reqData.user

  if (hasPermission) {
    User.generateHashPassword(reqUser.password, async (error, newHashPassword) => {
      // get new information
      if (error) {
        logger.info('PATCH api/user/:id => 520', error)
        res.status(520).send({ query: 'updateUserById', status: 'unsucessful', message: error })
      }
      var newUser = {
        password: newHashPassword
      }
      await User.findByIdAndUpdate(authUserid, newUser, { useFindAndModify: false }, (error) => {
        if (error) {
          logger.info('PATCH api/user/:id => 520', error)
          res.status(520).send({ query: 'updateUserById', status: 'unsucessful' })
        }
        res.status(200).send({ query: 'updateUserById', status: 'sucessful' })
        logger.info('PATCH api/user/:id => 200')
      })
    })
  } else {
    // no permission
    logger.info('PATCH api/user/:id => 403 ', 'no permission')
    res.status(403).send({ query: 'updateUserById', status: 'unsucessful', message: 'no permission' })
  }
})

module.exports = userRouter
