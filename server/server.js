const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const port = process.env.PORT || 3000;
const app = express();
const postApi = require('./routes/postController');
const authApi = require('./routes/authController');
const userApi = require('./routes/userController');
const database = 'mongodb://yz:qaz98765432@ds155213.mlab.com:55213/db1';
const timeout = require('connect-timeout'); //express v4
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const path = require('path');
mongoose.set('useCreateIndex', true);

// init connetction to remote database
mongoose.connect(database, { useNewUrlParser: true }, error => {
    if (error) {
        console.error(error);
    } else {
        console.log("connected");
    }
})

// angualr static file
app.use(express.static(path.join(__dirname, './')));

app.use(cors());
app.use(timeout('10s'));
app.use(bodyParser.urlencoded({ extended: true, limit: "5mb" }));
app.use(bodyParser.json({ limit: '5mb' }));
app.use(haltOnTimedout);
// add api controllers
app.use('/api/posts', verifyToken, postApi);
app.use('/api/authentication', authApi);
app.use('/api/user', verifyToken, userApi);
app.use(haltOnTimedout);

app.listen(PORT, function () {
    console.log('server running on localhost' + PORT);
})

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
        req.userid = payload.id;
        req.username = payload.username;
    } catch (error) {
        console.log('verifyToken => ' + error);
        return res.status(401).send({ error: error });
    }
    next();
}

function haltOnTimedout(error, req, res, next) {
    if (error) {
        if (error.status) {
            console.log(error)
            res.status(error.status).send({ message: error.message });
            return;
        }
    }
    //https://www.npmjs.com/package/connect-timeout
    if (!req.timedout) {
        next();
    } else {
        res.status(508).send({ message: "timeout!" });
    }
}