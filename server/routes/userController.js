const express = require('express')
const userRouter = express.Router()
const User = require('../models/user')

// api/authentication/signup
userRouter.post('/signup', (req, res) => {
    let data = req.body;
    let newUser = new User(data.user);
    console.log(newUser.username, data.user);
    console.log(newUser.password);
    newUser.save((error, data) => {
        if (error) {
            console.log(error);
            res.status(400).send({ error: error, query: "signUp", status: "unsucessful" });
        } else {
            res.status(200).send({ user: data, query: "signUp", status: "sucessful" });
        }
    })

})

// api/authentication/signin
userRouter.post('/signin', async (req, res) => {
    let data = req.body;
    let signinUser = new User(data.user);
    User.findOne({ username: signinUser.username }, (error, user) => {
        if (error) {
            console.log(error);
            res.status(520).send({ error: error, query: "signIn", status: "unsucessful" });
        }
        // verify password
        User.validatePassword(user.password, signinUser.password, (error, isMatch) => {

            if (error) {
                console.log(error);
                res.status(400).send({ error: error, query: "signIn", status: "unsucessful" });
            }
            if (isMatch) {
                // generate Token
                const usrJson = User.toAuthJSON(signinUser);
                res.status(200).send({ user: usrJson, query: "signIn", status: "sucessful" });
            } else {
                res.status(403).send({ query: "signIn", status: "unsucessful" });
            }
        })
    });
})

module.exports = userRouter