const router = require('express').Router();

//const apiRoutes = require('./api/');
const homeRoutes = require('./home-routes.js');
const commentRoutes = require('./api/comment-routes');
const userRoutes = require('./api/user-routes');
const postRoutes = require('./api/post-routes');

router.use('/', homeRoutes);
//router.use('/api', apiRoutes);
router.use('/api/comments', commentRoutes);
router.use('/api/users', userRoutes);
router.use('/api/posts', postRoutes);

module.exports = router;