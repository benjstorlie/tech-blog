const router = require('express').Router();
const { Blogpost, Comment, Tag, User } = require('../models');
const {  blogpostGet, commentGet, tagGet } = require('./api');
const withAuth = require('../utils/auth');
const { literal } = require('sequelize');

router.get('/', async (req, res) => {
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

    // count the comments for each post
    blogposts.forEach((blogpost) => {
      blogpost.commentCount = blogpost.comments.length;
    })

    // Pass serialized data and session flag into template
    res.render('homepage', { 
      blogposts, blogpostCount, page,
      logged_in: req.session.logged_in 
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/blogpost/:id',withAuth, async (req, res) => {
  try {
    const blogpostId = req.params.id;
    const blogpostData = await blogpostGet.findByPk(blogpostId);
    const options = ( req.session.logged_in ? 
      {
        attributes: {include: [[literal(`user.id = ${req.session.userId}`),'isUserComment']]}
        } : {});
    const commentData = await commentGet.findAllWithBlogpost(blogpostId, options);
    const blogpost = blogpostData.get({ plain: true });
    blogpost.commentCount = commentData.count;
    const comments = commentData.rows.map((comment) => comment.get({ plain: true }));
    res.render('blogpost', {
      blogpost, comments,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/editpost/:id', withAuth,async (req, res) => {
  try {
    const blogpostId = req.params.id;
    const blogpostData = await blogpostGet.findByPk(blogpostId);
    const blogpost = blogpostData.get({ plain: true });

    if (blogpost.userId !== req.session.userId) {
      res.redirect('/login');
      return;
    }

    const blogpostTags = blogpostData.tags.map((tag) => tag.id)

    const tagData = await Tag.findAll();
    const tags = tagData.map((tag) => tag.get({ plain: true }));

    tags.forEach((tag) => {
      tag.isBlogpostTag = (blogpostTags.includes(tag.id))
    })

    res.render('editpost', {
      blogpost, tags,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Use withAuth middleware to prevent access to route
router.get('/dashboard', withAuth, async (req, res) => {
  try {
    const userData = await User.findByPk(req.session.userId,{attributes: {exclude: ['password','email','id']}});
    const user = userData.get({plain: true});

    // page will be 1-indexed, because users see it. 
    const page = req.query.page || 1;

    const blogpostData = await blogpostGet.findAllWithUser(req.session.userId,(page > 1 ?{offset: 5*(page-1)} : {}));

    const blogposts = blogpostData.rows.map((blogpost) => blogpost.get({ plain: true }));

    // count the comments for each post
    blogposts.forEach((blogpost) => {
      blogpost.commentCount = blogpost.comments.length;
    })

    const blogpostCount = blogpostData.count;

    res.render('dashboard', {
      user, blogposts, blogpostCount,
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

router.get('/newpost',withAuth, async (req, res) => {
  try {
  
    const tagData = await Tag.findAll();
    const tags = tagData.map((tag) => tag.get({ plain: true }));

  res.render('newpost', {
    tags,
  logged_in: req.session.logged_in
  })

  } catch (err) {
  res.status(500).json(err);
  }
});

router.get('/profile',withAuth, async (req, res) => {
  try {
    if (false) {
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
    } else {
      res.render('errorpage', {
      message: "Profile Page Coming Soon",
      logged_in: req.session.logged_in
      })
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/tag/:id',async (req,res) => {
  try {
    // page will be 1-indexed, because users see it. 
    const page = req.query.page || 1;
    
    // Get all projects and JOIN with user data
    const blogpostData = await blogpostGet.findAllWithTag(req.params.id,(page > 1 ?{offset: 5*(page-1)} : {}));

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
    // count the comments for each post
    blogposts.forEach((blogpost) => {
      blogpost.commentCount = blogpost.comments.length;
    })
    // Pass serialized data and session flag into template
    res.render('homepage', { 
      blogposts, blogpostCount, page,
      logged_in: req.session.logged_in 
    });
  } catch (err) {
    res.status(500).json(err);
  }
})

router.get('/user/:id',async (req,res) => {
  try {
    // page will be 1-indexed, because users see it. 
    const page = req.query.page || 1;
    
    // Get all projects and JOIN with user data
    const blogpostData = await blogpostGet.findAllWithUser(req.params.id,(page > 1 ?{offset: 5*(page-1)} : {}));

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
    // count the comments for each post
    blogposts.forEach((blogpost) => {
      blogpost.commentCount = blogpost.comments.length;
    })
    // Pass serialized data and session flag into template
    res.render('homepage', { 
      blogposts, blogpostCount, page,
      logged_in: req.session.logged_in 
    });
  } catch (err) {
    res.status(500).json(err);
  }
})

module.exports = router;
