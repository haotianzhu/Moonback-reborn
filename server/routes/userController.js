const express = require('express')
const userRouter = express.Router()
const User = require('../models/user')


//GET api/user/:id
userRouter.get('/:id', (req, res) => {
    const authUserid = req.userid;
    const authUsername = req.username;
    var hasAuth = false;
    if (authUserid && authUserid != undefined && authUsername && authUsername != undefined) {
        hasAuth = true;
    }
    if (hasAuth) {
        User.findById(req.params.id, '-password -token', (error, data) => {
            if (error) {
                console.log('GET user/:id => ', error);
                res.status(520).send({ query: "findUserById", message: error });
            }
            if (data) {
                res.status(200).send({ query: "findUserById", user: data })
            } else {
                res.status(404).send({ query: "findUserById", status: 'unsucessful' })
            }
        })
    } else {
        res.status(401).send({ query: "findUserById", status: 'unsucessful' })
    }
})

//PATCH api/user/:id
userRouter.patch('/:id', (req, res) => {
    // update user
    // check permission
    var hasPermission = false;
    const authUserid = req.userid;
    if (authUserid && authUserid != undefined && authUserid == req.params.id) {
        hasPermission = true;
    }
    var reqData = req.body;
    var reqUser = reqData.user;

    if (hasPermission) {
        User.generateHashPassword(reqUser.password, async (error, newHashPassword) => {
            // get new information
            if (error) {
                console.log("PATCH api/user/:id => ", error)
                res.status(520).send({ query: "updateUserById", status: 'unsucessful', message: error })
            }
            var newUser = {
                password: newHashPassword,
            }
            await User.findByIdAndUpdate(authUserid, newUser, { useFindAndModify: false }, (error) => {
                if (error) {
                    console.log("PATCH api/user/:id => ", error)
                    res.status(200).send({ query: "updateUserById", status: 'unsucessful' })
                }
                res.status(200).send({ query: "updateUserById", status: 'sucessful' })
            });
        });
    } else {
        // no permission
        res.status(403).send({ query: "updateUserById", status: 'unsucessful', message: "no permission" })
    }
})



module.exports = userRouter
