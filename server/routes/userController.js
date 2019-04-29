const express = require('express')
const userRouter = express.Router()
const User = require('../models/user')

// api/authentication/signup
userRouter.post('/signup', (req, res) => {
    let data = req.body;
    if (data.query === "signUp") {
        let newUser = new User(data.user);
        console.log(newUser.username)
        console.log(newUser.password)
        newUser.save((error, data) => {
            if (error) {
                console.log(error)
                res.status(400).send({ user:data, query: "signUp",status:"unsucessful" })
            } else {
                res.status(200).send({ user:data, query: "signUp",status:"sucessful" })
            }
        })
    }else{
      res.status(400).send({query: "signUp",status:"unsupported query" })
    }
})

// api/authentication/signin
userRouter.post('/signin', async (req, res) => {
    let data = req.body;
    if (data.query === "signIn") {
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
    }else{
      res.status(400).send({query: "signIn",status:"unsupported query" })
    }
})

  module.exports = userRouter