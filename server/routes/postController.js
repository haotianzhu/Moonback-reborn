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
        if (error) {
            res.status(520).send({query: "findAllPosts", error: error})
        } else {
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
            res.status(520).send({query: "createNewPost", error: error})
        } else {
            res.status(200).send({ post: data, query: "createNewPost" })
        } 
    });
});

// get posts by post id
postRouter.get('/:id', (req, res) => {
    Post.findById(req.params.id, (error, data) => {
        if (error) {
            console.log(error)
            res.status(520).send({query: "findPostById", error: error})
        } else {
            res.status(200).send({ post: data, query: "findPostById" })
        }
    })
});

// delete posts by id
postRouter.delete('/:id',  (req, res) => {
    //TODO: permission check
    Post.findByIdAndDelete(req.params.id, (error, data) => {
        if (error) {
            console.log(error);
            res.status(520).send({query: "deletePostById", error: error})
        } else {
            res.status(200).send({ query: "deletePostById" })
        }
    })
});

module.exports = postRouter