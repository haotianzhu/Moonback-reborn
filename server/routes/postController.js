const express = require('express')
const postRouter = express.Router()
const Post = require('../models/post')
const User = require('../models/user')
const logger = require('../shared/logger')
const { echartModify } = require('../shared/chart')

const checkCategory = (category) => {
  var isValidate = false
  switch (category) {
    case 'game':
      isValidate = true
      break
    case 'anime':
      isValidate = true
      break
    case 'novel':
      isValidate = true
      break
    case 'manga':
      isValidate = true
      break
    default:
      isValidate = false
  }
  return isValidate
}

const pasrseUrlToQuery = (params) => {
  let query = { select: {}, limit: 100, skip: 0, sort: {} }
  for (var key in params) {
    var value = params[key]
    switch (key) {
      case 'limit':
        query.limit = parseInt(value)
        break
      case 'skip':
        query.skip = parseInt(value)
        break
      case 'sort':
        query.sort = value
        break
      default:
        query.select[key] = value
    }
  }
  return query
}

// get api/posts return all posts
postRouter.get('/', (req, res) => {
  let query = pasrseUrlToQuery(req.query)
  Post.execute(query, (error, data) => {
    if (error) {
      logger.info('GET /posts => 520 ', error)
      res.status(520).send({ query: 'findAllPosts', message: error })
    } else {
      res.status(200).send({ posts: data, length: data.length, query: 'findAllPosts' })
      logger.info('GET /posts => 200 ')
    }
  })
})

// post api/posts create a new post
postRouter.post('/', verifyToken, async (req, res) => {
  let reqData = req.body
  try {
    const authUserid = req.userid
    reqData.post.author = authUserid
  } catch (error) {
    logger.info('POST api/posts => 400 ', error)
    return res.status(400).send({ query: 'createNewPost', status: 'unsucessful', message: error.toString() })
  }
  if (!checkCategory(reqData.post.category)) {
    logger.info('POST api/posts => 400 no category')
    return res.sendStatus(400)
  }
  let newPost = new Post(reqData.post)
  await newPost.save(async (error, data) => {
    if (error) {
      logger.info('POST /posts => 520', error)
      res.status(520).send({ query: 'createNewPost', status: 'unsucessful', message: error })
    } else {
      await User.findById(data.author, (err, user) => {
        if (err) {
          logger.err('update user eachrt after successfully create a post', err)
        }
        if (user) {
          user.echart = echartModify(user, data.category, 1)
          console.log(user.echart)
          user.save()
        }
      })
      res.status(200).send({ post: data, query: 'createNewPost', status: 'sucessful' })
      logger.info('POST /posts => 200', error)
    }
  })
})

// get posts by post id
postRouter.get('/:id', (req, res) => {
  Post.findById(req.params.id, (error, data) => {
    if (error) {
      logger.info('GET /posts/:id => 520 ', error)
      return res.status(520).send({ query: 'findPostById', message: error })
    }
    if (data) {
      logger.info('GET /posts/:id => 200 ')
      res.status(200).send({ post: data, query: 'findPostById' })
    } else {
      logger.info('GET /posts/:id => 404 ', 'post not found')
      res.status(404).send({ status: 'unsucessful', query: 'findPostById', message: 'post not found' })
    }
  })
})

// https://nemethgergely.com/async-function-best-practices/
const awaitHandlerFactory = (middleware) => {
  return async (req, res, next) => {
    try {
      await middleware(req, res, next)
    } catch (err) {
      next(err)
    }
  }
}

// PATCH api/posts
postRouter.patch('/:id', verifyToken, awaitHandlerFactory(async (req, res) => {
  // check permission
  var hasPermission = false
  const authUserid = req.userid
  var reqPost = null
  try {
    // check the body structure
    reqPost = req.body.post
    if (!reqPost || reqPost === undefined) throw Error('body has no post')
  } catch (error) {
    logger.info('PATCH api/posts/:id => 400 ', error.toString())
    return res.status(400).send({ query: 'createNewPost', status: 'unsucessful', message: error.toString() })
  }

  // find post with given id
  var post = await Post.findById(req.params.id).catch((error) => {
    if (error) {
      logger.info('PATCH api/posts/:id => 404 ', error)
      res.status(404).send({ query: 'updatePostById', status: 'unsucessful', message: error })
    }
  })

  if (!post || post === undefined) {
    // if no post found, end
    return
  }
  if (authUserid && authUserid !== undefined && authUserid === post.author.toString()) {
    // check permission
    hasPermission = true
  }
  if (hasPermission) {
    // update post
    if (reqPost.title !== undefined) {
      post.title = reqPost.title
    }
    if (reqPost.content !== undefined) {
      post.content = reqPost.content
    }
    post.save((error, newPost) => {
      if (error) {
        logger.info('PATCH api/posts/:id => 403 ', error)
        res.status(403).send({ query: 'updatePostById', status: 'unsucessful', message: error })
      } else {
        logger.info('PATCH api/posts/:id => 200 ')
        res.status(200).send({ query: 'updatePostById', status: 'sucessful' })
      }
    })
  } else if (!hasPermission) {
    // no permission
    logger.info('PATCH api/posts/:id => no permission')
    return res.status(403).send({ query: 'updatePostById', status: 'unsucessful', message: 'no permission' })
  }
}))

// delete posts by id
postRouter.delete('/:id', verifyToken, (req, res) => {
  // TODO: permission check
  Post.findByIdAndDelete(req.params.id, (error, data) => {
    if (error) {
      logger.info('DELETE api/posts/:id => 520 ', error)
      res.status(520).send({ query: 'deletePostById', message: error })
    } else {
      logger.info('DELETE api/posts/:id => 200 ')
      res.status(200).send({ query: 'deletePostById' })
    }
  })
})

// GET api/posts/user/:id
postRouter.get('/user/:id', (req, res) => {
  // get posts of user with id
  let query = pasrseUrlToQuery(req.query)
  query.select.author = req.params.id
  Post.execute(query, (error, data) => {
    if (error) {
      logger.info('GET api/posts/user/:id => 404 ', error)
      res.status(404).send({ query: 'findPostsByUserId', message: error })
    } else {
      logger.info('GET api/posts/user/:id => 200 ')
      res.status(200).send({ query: 'findPostsByUserId', status: 'sucessful', posts: data, length: data.length })
    }
  })
})

function verifyToken (req, res, next) {
  // verify the Json Token
  if (!req.headers.authorization) {
    return res.status(401).send('Unauthorized request')
  }
  let token = req.headers.authorization.split(' ')[1]
  if (token === 'null') {
    return res.status(401).send('Unauthorized request')
  }
  try {
    let payload = jwt.verify(token, 'moonback-reborn-secrete')
    req.userid = payload.id
    req.username = payload.username
  } catch (error) {
    logger.info('verifyToken => ' + error)
    return res.status(401).send({ error: error })
  }
  next()
}


module.exports = postRouter
