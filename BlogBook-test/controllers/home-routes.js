const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment, Vote } = require('../models');

// get all posts for homepage
router.get('/', (req, res) => {
  console.log('======================');
  Post.findAll({
    attributes: [
      'id',
      'title',
      'body',
      'user_id'
    ],
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['username'],
      },
      {
        model: Comment,
        as: 'comments',
        attributes: ['id', 'comment_text', 'user_id']
      },
    ],
  })
    .then(dbPostData => {
        if (!dbPostData) {
            res.status(404).json({ message: "Posts not found "});
        }
      const posts = dbPostData.map(post => post.get({ plain: true }));

      res.render('homepage', { posts, loggedIn: req.session.loggedIn });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get('/login', (req, res) => {
  res.render('login', { loggedIn: req.session.loggedIn });
});

router.get('/viewpost/:id', (req, res) => {
  Post.findOne({
    where: {
      id: req.params.id
    },
    attributes: [
      'id',
      'title',
      'body',
      'user_id'
    ],
    include: [
      {
        model: User, 
        as: 'user',
        attributes: ['username'],
      },
      {
          model: Comment, 
          as: 'comments',
          attributes: [
              'id',
              'comment_text',
              'user_id'
          ],
          include: [
            {
                model: User, 
                as: 'user',
                attributes: ['username'],
              },
          ],
      },
    ],
  })
    .then(dbPostData => {
      if (!dbPostData) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
      }

      // serialize the data
      const post = dbPostData.get({ plain: true });
      console.log(post);
      const myPost = port.user_id == req.session.user_id;
      // pass data to template
      res.render('single-post', { 
          post, 
            loggedIn: req.session.loggedIn,
            currentUser: myPost,
        });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get('/dashboard', (req, res) => {
    Post.findAll({
      where: {
        user_id: req.session.user_id
      },
      attributes: [
        'id',
        'title',
        'body',
        'user_id'
      ],
      include: [
        {
          model: User, 
          as: 'user',
          attributes: ['username'],
        },
        {
            model: Comment, 
            as: 'comments',
            attributes: [
                'id',
                'comment_text',
                'user_id'
            ],
            include: [
              {
                  model: User, 
                  as: 'user',
                  attributes: ['username'],
                },
            ],
        },
      ],
    })
      .then(dbPostData => {
        if (!dbPostData) {
          res.status(404).json({ message: 'No post found with this id' });
          return;
        }
  
        // serialize the data
        const post = dbPostData.map(post => post.get({ plain: true }));
        // pass data to template
        res.render('dashboard', { 
            posts, 
            loggedIn: req.session.loggedIn,
          });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

router.get('/post', (req, res) => {
    res.render('create-post', { loggedIn: req.session.loggedIn });
});

router.get('/edit/:id', (req, res) => {
    res.render('edit-post', {
        loggedIn: req.session.loggedIn,
        post_id: req.params.id,
    });
});

module.exports = router;