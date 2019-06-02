const express = require('express')
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')
const emailRouter = express.Router()
const User = require('../models/user')
const logger = require('../shared/logger')
const EMAILPATH = 'https://moonback-reborn.azurewebsites.net/email/v?token='

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

function verifyEmailToken (token) {
  try {
    let payload = jwt.verify(token, 'secretEmailVertification')
    return payload
  } catch (error) {
    logger.info('token is not correct')
    return null
  }
}

emailRouter.post('/s', (req, res) => {
  var token = null
  const today = new Date()
  const expirationDate = new Date(today)
  expirationDate.setDate(today.getDate() + 1)

  if (req.data.id && req.data.email) {
    User.findById(req.data.id, '-password -token', (error, data) => {
      if (error) {
        logger.info('=> api/email/s', error)
        return res.sendStatus(520)
      }
      if (data) {
        token = jwt.sign({
          username: data.username,
          id: data.id,
          exp: parseInt(expirationDate.getTime() / 1000, 10)
        }, 'secretEmailVertification')

        if (token) {
          const mailOptions = {
            from: 'moonbackreborn@gmail.com',
            to: data.email,
            subject: 'MoonBack-reborn Email Vertification',
            text: `${'please confirm your email address. ' + EMAILPATH + token}`
          }
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              logger.error(error)
            }
            if (info) {
              logger.info('Email sent: ' + info.response)
              return res.sendStatus(200)
            }
          })
        }
      } else {
        logger.info('=> api/email/s => 404', 'not found')
        return res.sendStatus(404)
      }
    })
  } else {
    return res.sendStatus(520)
  }
})

emailRouter.get('/v', (req, res) => {
  var token = null
  try {
    token = req.query.token
  } catch (e) {
    logger.error('No token in query')
    return res.sendStatus(400)
  }
  if (token) {
    const payload = verifyEmailToken(token)
    if (payload) {
      // true
      User.findByIdAndUpdate(payload.id, { isActivated: true }, { useFindAndModify: false }, (error) => {
        if (error) {
          logger.info('GET api/email/v => 520 ', error)
          res.sendStatus(520)
        }
        logger.info('GET api/email/v  => 200')
        res.sendStatus(200)
      })
    }
  }
})

module.exports = emailRouter
