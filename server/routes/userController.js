const express = require('express')
const userRouter = express.Router()
const User = require('../models/user')
const jwt = require('jsonwebtoken')

// api/authentication/signup
userRouter.post('/signup', (req, res) => {
    let data = req.body;
    let newUser = new User(data.user);
    newUser.save((error, data) => {
        if (error) {
            console.log('signup => ', error);
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
    await User.findOne({ username: signinUser.username }, (error, user) => {
        if (error) {
            console.log('signin => ', error);
            res.status(520).send({ error: error, query: "signIn", status: "unsucessful" });
        }
        // verify password
        User.validatePassword(user.password, signinUser.password, async (error, isMatch) => {
            if (error) {
                console.log('signin => ', error);
                res.status(400).send({ error: error, query: "signIn", status: "unsucessful" });
            }
            if (isMatch) {
                try {
                    // token exists
                    // check if token is expired
                    jwt.verify(user.token, 'secret');
                    const usrJson = {
                        id: user._id,
                        username: user.username,
                        token: user.token,
                    };
                    res.status(200).send({ user: usrJson, query: "signIn", status: "sucessful" });
                } catch (error) {
                    // token is expire
                    // generate token
                    if (error.name == 'TokenExpiredError' || error.name == 'JsonWebTokenError') {
                        const usrJson = User.toAuthJSON(user);
                        await User.updateOne(user, { token: usrJson.token })
                        res.status(200).send({ user: usrJson, query: "signIn", status: "sucessful" });
                    } else {
                        console.log('signin => ', error);
                        res.status(400).send({ error: error, query: "signIn", status: "unsucessful" });
                    }
                }
            } else {
                res.status(403).send({ query: "signIn", status: "unsucessful" });
            }
        })
    });
})

// api/authentication/signout
userRouter.delete('/signout', verifyToken, async (req, res) => {
    await User.findByIdAndUpdate(req.userid, { 'token': '' }, { useFindAndModify: false }, (error) => {
        if (error) {
            console.log('signout => ', error);
            res.status(520).send({ query: "deletePostById", error: error })
        } else {
            res.status(200).send({ query: "deletePostById" })
        }
    });

});


function verifyToken(req, res, next) {
    // verify the Json Token
    if (!req.headers.authorization) {
        return res.status(401).send('Unauthorized request');
    }
    let token = req.headers.authorization.split(' ')[1];
    if (token === 'null') {
        return res.status(401).send('Unauthorized request');
    }
    try {
        let payload = jwt.verify(token, 'secret');
        req.username = payload.username;
        req.userid = payload.id;
    } catch (error) {
        console.log('verifyToken => ' + error);
        return res.status(401).send({ error: error });
    }
    next();
}

module.exports = userRouter