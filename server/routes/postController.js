const express = require('express')
const postRouter = express.Router()
const Post = require('../models/post')

function pasrseUrlToQuery(params) {
    let query = { select: {}, limit: 100, skip: 0, sort: {} }
    for (var key in params) {
        value = params[key]
        switch (key) {
        case "limit":
            query.limit = parseInt(value);
            break;
        case "skip":
            query.skip = parseInt(value);
            break;
        case "sort":
            query.sort = value;
            break;
        default:
            query.select[key] = value;
        }
    }
    return query
};

// get api/posts return all posts
postRouter.get('/', (req, res) => {
    let query = pasrseUrlToQuery(req.query)
    Post.execute(query, (error, data) => {
        if (error) throw Error(error);
        if (data) {
            res.status(200).send({ posts: data, length: data.length, query: "findAllPosts" });
        }
    });
});

// post api/posts create a new post
postRouter.post('/', (req, res) => {
    let data = req.body;
    let newPost = new Post(data.post);
    newPost.save((error, data) => {
        if (error) {
            console.log(error)
        } else {
            res.status(200).send({ post: data, query: "createNewPost" })
        } 
    });
});

// get posts by post id
postRouter.get('/:id', (req, res) => {
    Post.findById(req.params.id, (error, data) => {
        if (error) {
            throw Error(error);
        } else {
            res.status(200).send({ post: data, query: "findPostById" })
        }
    })
});

// delete posts by id
postRouter.delete('/:id', function (req, res) {
    //TODO: permission check
    console.log(req.params)
    Post.findByIdAndRemove(res.params.id, (error) => {
        if (error) {
            throw Error(error);
        } else {
            res.status(204).send({ query: "deletePostById" })
        }
    })
});

module.exports = postRouter