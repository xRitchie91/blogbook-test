const router = require('express').Router();
const sequelize = require('../../config/connection');
const { Post, User, Comment } = require('../../models');

// get all users
router.get('/', (req, res) => {
  console.log('======================');
  Post.findAll({
    attributes: ['id', 'title', 'body', 'user_id'],
    include: [
      {
          model: Comments,
          as: 'comments',
          attributes: ['id', 'comment_text', 'user_id'],
        },
    ],
})
  .then(dbPostData => res.json(dbPostData))
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

router.get('/:id', (req, res) => {
  Post.findOne({
    where: {
      id: req.params.id
    },
    attributes: ['id', 'title', 'body', 'user_id'],
    include: [
      {
          model: Comments,
          as: 'comments',
          attributes: ['id', 'comment_text', 'user_id'],
        },
    ],
})
  .then(dbPostData => {
      if (!dbPostData) {
          res.status(404).json({ message: 'No post found with this id!' });
          return;
      }
        res.json(dbPostData);
    })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

router.post('/', (req, res) => {
  // expects {title: 'Taskmaster goes public!', post_url: 'https://taskmaster.com/press', user_id: 1}
  Post.create({
    title: req.body.title,
    body: req.body.body,
    user_id: req.session.user_id
  })
    .then(dbPostData => {
        res.json(dbPostData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.put('/:id', (req, res) => {
  Post.update(
    {
      title: req.body.title,
      body: req.body.body,
    },
    {
      where: {
        id: req.params.id
      }
    }
  )
    .then(dbPostData => {
      if (!dbPostData) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
      }
      res.json(dbPostData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.delete('/:id', (req, res) => {
  console.log('id', req.params.id);
  Post.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(dbPostData => {
      if (!dbPostData) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
      }
      res.json(dbPostData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;