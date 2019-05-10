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
            console.log('GET /posts => ', error)
            res.status(520).send({ query: "findAllPosts", message: error })
        } else {
            res.status(200).send({ posts: data, length: data.length, query: "findAllPosts" });
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
        console.log('POST /posts => ', error)
        res.status(400).send({ query: "createNewPost", status: 'unsucessful', message: error.toString() });
        return;
    }

    let newPost = new Post(reqData.post);
    newPost.save((error, data) => {
        if (error) {
            console.log('POST /posts => ', error)
            res.status(520).send({ query: "createNewPost", status: 'unsucessful', message: error })
        } else {
            res.status(200).send({ post: data, query: "createNewPost", status: 'sucessful' })
        }
    });
});

// get posts by post id
postRouter.get('/:id', (req, res) => {
    Post.findById(req.params.id, (error, data) => {
        if (error) {
            console.log('GET /posts/:id => ', error)
            res.status(520).send({ query: "findPostById", message: error })
            return;
        }
        if (data) {
            res.status(200).send({ post: data, query: "findPostById" })
        } else {
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
        console.log("PATCH api/posts/:id => ", error.toString())
        res.status(400).send({ query: "createNewPost", status: 'unsucessful', message: error.toString() });
        return;
    }

    // find post with given id
    var post = await Post.findById(req.params.id).catch((error) => {
        if (error) {
            console.log("PATCH api/posts/:id => ", error)
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
                console.log("PATCH api/posts/:id => ", error)
                res.status(403).send({ query: "updatePostById", status: 'unsucessful', message: error })
            } else {
                res.status(200).send({ query: "updatePostById", status: 'sucessful' })
            }
        })
    } else if (!hasPermission) {
        // no permission
        console.log("PATCH api/posts/:id => ", error)
        res.status(403).send({ query: "updatePostById", status: 'unsucessful', message: "no permission" })
        return;
    }
}));


// delete posts by id
postRouter.delete('/:id', (req, res) => {
    //TODO: permission check
    Post.findByIdAndDelete(req.params.id, (error, data) => {
        if (error) {
            console.log(error);
            res.status(520).send({ query: "deletePostById", message: error })
        } else {
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
            console.log('GET api/posts/user/:id => ', error);
            res.status(404).send({ query: "findPostsByUserId", message: error });
            return;
        } else {
            res.status(200).send({ query: "findPostsByUserId", status: 'sucessful', posts: data, length: data.length });
            return;
        }
    });
})


module.exports = postRouter