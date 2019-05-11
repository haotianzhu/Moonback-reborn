const express = require('express')
const authRouter = express.Router()
const User = require('../models/user')
const jwt = require('jsonwebtoken')

// api/authentication/signup
authRouter.post('/signup', (req, res) => {
    let data = req.body;
    let newUser = new User(data.user);
    console.log(newUser)
    newUser.save((error, data) => {
        if (error) {
            console.log('signup => ', error);
            res.status(400).send({ message: error, query: "signUp", status: "unsucessful" });
        } else {
            let user = {
                username: data.username,
                id: data.id,
                createDate: data.createDate
            }
            res.status(200).send({ user: user, query: "signUp", status: "sucessful" });
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
    let data = req.body;
    let signinUser = new User(data.user);
    await User.findOne({ username: signinUser.username }, (error, user) => {
        if (error) {
            console.log('signin => ', error);
            res.status(520).send({ message: error, query: "signIn", status: "unsucessful" });
            return;
        }
        if (!user || user == undefined) {
            console.log('signin => password or username is not correct ');
            res.status(400).send({
                message: 'password/username is not correct',
                query: "signIn",
                status: "unsucessful"
            });
            return
        }
        // verify password
        User.validatePassword(user.password, signinUser.password, async (error, isMatch) => {
            if (error) {
                console.log('signin => ', error);
                res.status(400).send({ message: error, query: "signIn", status: "unsucessful" });
            }
            if (isMatch) {
                try {
                    // token exists
                    // check if token is expired
                    jwt.verify(user.token, 'secret');
                    const usrJson = {
                        id: user.id,
                        username: user.username,
                        token: user.token,
                    };
                    res.status(200).send({ user: usrJson, query: "signIn", status: "sucessful" });
                    return;
                } catch (error) {
                    // token is expire
                    // generate token
                    if (error.name == 'TokenExpiredError' || error.name == 'JsonWebTokenError') {
                        const usrJson = User.toAuthJSON(user);
                        await User.updateOne(user, { token: usrJson.token })
                        res.status(200).send({ user: usrJson, query: "signIn", status: "sucessful" });
                        return;
                    } else {
                        console.log('signin => ', error);
                        res.status(400).send({ message: error, query: "signIn", status: "unsucessful" });
                        return;
                    }
                }
            } else {
                res.status(403).send({
                    query: "signIn",
                    status: "unsucessful",
                    message: "username/password is not correct"
                });
                return;
            }
        })
    });
}));

// api/authentication/signout
authRouter.delete('/signout', verifyToken, (req, res) => {
    User.findByIdAndUpdate(req.userid, { 'token': '' }, { useFindAndModify: false }, (error) => {
        if (error) {
            console.log('signout => ', error);
            res.status(520).send({ query: "signOut", message: error })
        } else {
            res.status(200).send({ query: "signOut" })
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

module.exports = authRouter
