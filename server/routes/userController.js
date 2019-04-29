const express = require('express')
const userRouter = express.Router()
const User = require('../models/user')

// api/authentication/signup
userRouter.post('/signup', (req, res) => {
    let data = req.body;
    let newUser = new User(data.user);
    console.log(newUser.username,data.user)
    console.log(newUser.password)
    newUser.save((error, data) => {
        if (error) {
            console.log(error)
            res.status(400).send({ user:data, query: "signUp",status:"unsucessful" })
        } else {
            res.status(200).send({ user:data, query: "signUp",status:"sucessful" })
        }
    })
    
})

// api/authentication/signin
userRouter.post('/signin', async (req, res) => {
    let data = req.body;
    let signinUser = new User(data.user);
    await User.findOne({ username: signinUser.username}, (error, user) => {
      if (error) throw error;
        // verify password
      User.validatePassword(user.password, signinUser.password, function(error, isMatch) {
      if (error) {
        res.status(403).send({ user:signinUser.username, query: "signIn", status:"unsucessful"})
      }else {
        res.status(200).send({ user:signinUser.username, query: "signIn", status:"sucessful"})
      }
      })
    });
})

  module.exports = userRouter