const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const Post = require('../models/post')
const database = 'mongodb://yz:qaz98765432@ds155213.mlab.com:55213/db1'

// init connetction to remote database
mongoose.connect(database, { useNewUrlParser: true },error =>{
    if(error){
        console.error(error)
    }else{
        console.log("connected")
    }
})

function verifyToken(req, res, next) {
    // verify the Json Token 
    if(!req.headers.authorization) {
        return res.status(401).send('Unauthorized request');
    }
    let token = req.headers.authorization.split(' ')[1];

    if(token === 'null') {
        return res.status(401).send('Unauthorized request');
    }
    try {
        let payload = jwt.verify(token, 'secretKey');
        req.userId = payload.userid;
    } catch (e){
        return res.status(401).send('Unauthorized request');
    }
    next();
}
