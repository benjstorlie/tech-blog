const router = require('express').Router();
const {BlogpostTag} = require('../../models')
const {router: userRoutes} = require('./userRoutes');
const {router: blogpostRoutes, get: blogpostGet} = require('./blogpostRoutes');
const {router: commentRoutes, get: commentGet} = require('./commentRoutes');
const {router: tagRoutes, get: tagGet} = require('./tagRoutes');
const withAuth = require('../../utils/auth');



// Get ALL blogpostTags, the through model for the many-to-many association between Tag and Blogpost
router.get('/blogpostTag', withAuth, async (req, res) => {
  try {
    const blogpostTagData = await BlogpostTag.findAll();
    res.status(200).json(blogpostTagData);
  } catch {
    res.status(500).json(err);
  }
});

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
