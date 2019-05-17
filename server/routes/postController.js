const express = require('express')
const postRouter = express.Router()
const Post = require('../models/post')
const logger = require('../logger');

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
            logger.info('GET /posts => 520 ', error)
            res.status(520).send({ query: "findAllPosts", message: error })
        } else {
            res.status(200).send({ posts: data, length: data.length, query: "findAllPosts" });
            logger.info('GET /posts => 200 ')
        }
    });
});

// post api/posts create a new post
postRouter.post('/', (req, res) => {
    try {
        let reqData = req.body;
        const authUserid = req.userid;
        reqData.post.author = authUserid;
    } catch (error) {
        logger.info('POST /posts => 400 ', error)
        res.status(400).send({ query: "createNewPost", status: 'unsucessful', message: error.toString() });
        return;
    }

    let newPost = new Post(reqData.post);
    newPost.save((error, data) => {
        if (error) {
            logger.info('POST /posts => 520', error)
            res.status(520).send({ query: "createNewPost", status: 'unsucessful', message: error })
        } else {
            res.status(200).send({ post: data, query: "createNewPost", status: 'sucessful' })
            logger.info('POST /posts => 200', error)
        }
    });
});

// get posts by post id
postRouter.get('/:id', (req, res) => {
    Post.findById(req.params.id, (error, data) => {
        if (error) {
            logger.info('GET /posts/:id => 520 ', error)
            res.status(520).send({ query: "findPostById", message: error })
            return;
        }
        if (data) {
            logger.info('GET /posts/:id => 200 ')
            res.status(200).send({ post: data, query: "findPostById" })
        } else {
            logger.info('GET /posts/:id => 404 ', "post not found")
            res.status(404).send({ status: 'unsucessful', query: "findPostById", message: "post not found" })
        }
    })
});

//https://nemethgergely.com/async-function-best-practices/
const awaitHandlerFactory = (middleware) => {
    return async (req, res, next) => {
        try {
            await middleware(req, res, next)
        } catch (err) {
            next(err)
        }
    }
}


//PATCH api/posts
postRouter.patch('/:id', awaitHandlerFactory(async (req, res) => {
    // check permission
    var hasPermission = false;
    const authUserid = req.userid;
    var reqPost = null;
    try {
        // check the body structure
        reqPost = req.body.post;
        if (!reqPost || reqPost == undefined) throw Error("body has no post")
    } catch (error) {
        logger.info("PATCH api/posts/:id => 400 ", error.toString())
        res.status(400).send({ query: "createNewPost", status: 'unsucessful', message: error.toString() });
        return;
    }

    // find post with given id
    var post = await Post.findById(req.params.id).catch((error) => {
        if (error) {
            logger.info("PATCH api/posts/:id => 404 ", error)
            res.status(404).send({ query: "updatePostById", status: 'unsucessful', message: error })
        }
    });

    if (!post || post == undefined) {
        // if no post found, end
        return;
    }
    if (authUserid && authUserid != undefined && authUserid == post.author) {
        // check permission
        hasPermission = true;
    }

    if (hasPermission) {
        // update post
        if (reqPost.title != undefined) {
            post.title = reqPost.title;
        }
        if (reqPost.content != undefined) {
            post.content = reqPost.content;
        }
        post.save((error, newPost) => {
            if (error) {
                logger.info("PATCH api/posts/:id => 403 ", error)
                res.status(403).send({ query: "updatePostById", status: 'unsucessful', message: error })
            } else {
                logger.info("PATCH api/posts/:id => 200 ")
                res.status(200).send({ query: "updatePostById", status: 'sucessful' })
            }
        })
    } else if (!hasPermission) {
        // no permission
        logger.info("PATCH api/posts/:id => ", error)
        res.status(403).send({ query: "updatePostById", status: 'unsucessful', message: "no permission" })
        return;
    }
}));


// delete posts by id
postRouter.delete('/:id', (req, res) => {
    //TODO: permission check
    Post.findByIdAndDelete(req.params.id, (error, data) => {
        if (error) {
            logger.info('DELETE api/posts/:id => 520 ', error)
            res.status(520).send({ query: "deletePostById", message: error })
        } else {
            logger.info('DELETE api/posts/:id => 200 ')
            res.status(200).send({ query: "deletePostById" })
        }
    })
});


//GET api/posts/user/:id
postRouter.get('/user/:id', (req, res) => {
    // get posts of user with id
    let query = pasrseUrlToQuery(req.query);
    query.select.author = req.params.id;
    Post.execute(query, (error, data) => {
        if (error) {
            logger.info('GET api/posts/user/:id => 404 ', error);
            res.status(404).send({ query: "findPostsByUserId", message: error });
            return;
        } else {
            logger.info('GET api/posts/user/:id => 200 ')
            res.status(200).send({ query: "findPostsByUserId", status: 'sucessful', posts: data, length: data.length });
            return;
        }
    });
})


module.exports = postRouter