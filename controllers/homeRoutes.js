const router = require('express').Router();
const { Blogpost, Comment, Tag, User } = require('../models');
const {  blogpostGet, commentGet, tagGet } = require('./api');
const withAuth = require('../utils/auth');

router.get('/',withAuth, async (req, res) => {
  try {
    // page will be 1-indexed, because users see it. 
    const page = req.query.page || 1;
    
    // Get all projects and JOIN with user data
    const blogpostData = await blogpostGet.findAll((page > 1 ?{offset: 5*(page-1)} : {}));

    const blogpostCount = blogpostData.count;

    if (!blogpostData.rows.length) {
      res.render('errorpage', { 
        blogpostCount, page, 
        logged_in: req.session.logged_in 
      });
      return;
    }

    // Serialize data so the template can read it
    const blogposts = blogpostData.rows.map((blogpost) => blogpost.get({ plain: true }));

    // Pass serialized data and session flag into template
    res.render('homepage', { 
      blogposts, blogpostCount, page,
      logged_in: req.session.logged_in 
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/blogpost/:id', withAuth,async (req, res) => {
  try {
    const blogpostId = req.params.id;
    const blogpostData = await blogpostGet.findByPk(blogpostId);
    const commentData = await commentGet.findAllWithBlogpost(blogpostId);
    const blogpost = blogpostData.get({ plain: true });
    const comments = commentData.rows.map((comment) => comment.get({ plain: true }));
    res.render('blogpost', {
      blogpost, comments,
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
