const router = require('express').Router();
const {BlogpostTag} = require('../../models')
const {router: userRoutes} = require('./userRoutes');
const {router: blogpostRoutes, get: blogpostGet} = require('./blogpostRoutes');
const {router: commentRoutes, get: commentGet} = require('./commentRoutes');
const {router: tagRoutes, get: tagGet} = require('./tagRoutes');



// Get ALL blogpostTags, the through model for the many-to-many association between Tag and Blogpost
router.get('/blogpostTag', async (req, res) => {
  try {
    const blogpostTagData = await BlogpostTag.findAll();
    res.status(200).json(blogpostTagData);
  } catch {
    res.status(500).json(err);
  }
});

router.use('/user', userRoutes);
router.use('/blogpost', blogpostRoutes);
router.use('/comment', commentRoutes);
router.use('/tag', tagRoutes);

module.exports = {
  router,
  blogpostGet,
  commentGet,
  tagGet
};
