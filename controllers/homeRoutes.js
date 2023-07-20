const router = require('express').Router();
const { Blogpost, Comment, Tag, User } = require('../models');
const {  blogpostGet, commentGet, tagGet } = require('./api');
const withAuth = require('../utils/auth');

router.get('/',withAuth, async (req, res) => {
  try {
    // Get all projects and JOIN with user data
    const blogpostData = await blogpostGet.findAll();

    // Serialize data so the template can read it
    const blogposts = blogpostData.map((blogpost) => blogpost.get({ plain: true }));

    // Pass serialized data and session flag into template
    res.render('homepage', { 
      blogposts, 
      logged_in: req.session.logged_in 
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/blogpost/:id', withAuth,async (req, res) => {
  try {
    const blogpostId = req.params.id
    const blogpostData = await blogpostGet.findByPk(blogpostId);
    const blogpost = blogpostData.get({ plain: true });
    const commentData = await commentGet.findAllWithBlogpost(blogpostId);
    const comments = commentData.get({ plain: true })

    res.render('blogpost', {
      ...blogpost, comments,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Use withAuth middleware to prevent access to route
router.get('/profile', withAuth, async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.userId, {
      attributes: { exclude: ['password'] },
      include: [{ model: Blogpost }],
    });

    const user = userData.get({ plain: true });

    res.render('profile', {
      ...user,
      logged_in: true
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/');
    return;
  }

  res.render('login');
});

module.exports = router;
