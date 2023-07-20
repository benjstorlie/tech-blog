const router = require('express').Router();
const { Blogpost, Tag, BlogpostTag } = require('../../models');


// Get ALL tags
router.get('/all', async (req, res) => {
  try {
    const tagData = await Tag.findAll();
    res.status(200).json(tagData);
  } catch {
    res.status(500).json(err);
  }
});

// Get ALL blogpostTags, the through model for the many-to-many association between Tag and Blogpost
router.get('/all/blogpostTag', async (req, res) => {
  try {
    const blogpostTagData = await BlogpostTag.findAll();
    res.status(200).json(blogpostTagData);
  } catch {
    res.status(500).json(err);
  }
});

const get = {
  
}

module.exports = {router , get};