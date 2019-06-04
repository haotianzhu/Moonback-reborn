const express = require('express')
const nodemailer = require('nodemailer')
const emailRouter = express.Router()
const User = require('../models/user')
const Token = require('../models/token')
const logger = require('../shared/logger')

var transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: 'moonbackreborn@gmail.com',
    pass: 'qaz98765432'
  }
})

const verifyEmailToken = (date) => {
  const today = new Date()
  return today.getTime() < date.getTime()
}

emailRouter.post('/s', (req, res) => {
  var targetUser = {}
  if (req.body.email && req.body.username) {
    targetUser.email = req.body.email
    targetUser.username = req.body.username
  } else {
    logger.info('=> api/email/s, no username and no email')
    return res.sendStatus(400)
  }
  const message = (req.body.message) ? req.body.message : 'Please confirm your email address. '
  
  User.findOne(targetUser, '-password -token', (error, data) => {
    if (error) {
      logger.info('=> api/email/s', error)
      return res.sendStatus(520)
    }
    if (data) {
      var token = new Token({ userId: data.id })
      if (!data.email) {
        logger.info('Email sent:  no email address')
        return res.sendStatus(400)
      }
      token.save()
      if (token) {
        const mailOptions = {
          from: 'moonbackreborn@gmail.com',
          to: data.email,
          subject: 'MoonBack-reborn Email Vertification',
          text: `${message + token.value}`
        }
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            logger.error(error)
            return res.sendStatus(520)
          }
          if (info) {
            logger.info('Email sent: ' + info.response)
            return res.status(200).send({ 'id': data.id })
          }
        })
      }
    } else {
      logger.info('=> api/email/s => 404', 'not found')
      return res.sendStatus(404)
    }
  })
})

emailRouter.post('/v', (req, res) => {
  var token = null
  if (req.body.value && req.body.id) {
    token = {
      value: req.body.value,
      type: 'email',
      userId: req.body.id
    }
  } else {
    logger.info('=> api/email/s, no value and no id')
    return res.sendStatus(400)
  }

  if (token) {
    Token.findOne(token, (err, data) => {
      if (err) {
        logger.error('=> api/email/v', err)
      }
      if (data) {
        if (verifyEmailToken(data.date)) {
          User.findByIdAndUpdate(data.userId, { isActivated: true }, { useFindAndModify: false }, (error, data) => {
            if (error) {
              logger.error('GET api/email/v => 520 ', error)
              return res.sendStatus(520)
            }
            if (data) {
              logger.info('GET api/email/v  => 200')
              return res.status(200).send({'status': 'success'})
            }
          })
        } else {
          logger.info('=> api/email/v 401 token expired')
          return res.sendStatus(401)
        }
      } else {
        logger.info('=> api/email/v 404 no token is found')
        return res.sendStatus(404)
      }
    })
  }
})

module.exports = emailRouter
