const router = require('express').Router();
const {router: userRoutes} = require('./userRoutes');
const {router: blogpostRoutes, get: blogpostGet} = require('./blogpostRoutes');
const {router: commentRoutes, get: commentGet} = require('./commentRoutes');
const {router: tagRoutes, get: tagGet} = require('./tagRoutes');
const withAuth = require('../../utils/auth');

router.use('/user', userRoutes);
router.use('/blogpost',withAuth, blogpostRoutes);
router.use('/comment',withAuth, commentRoutes);
router.use('/tag',withAuth, tagRoutes);

module.exports = {
  router,
  blogpostGet,
  commentGet,
  tagGet
};
