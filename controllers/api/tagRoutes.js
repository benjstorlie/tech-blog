const router = require('express').Router();
const { Blogpost, Tag, } = require('../../models');


// Get ALL tags
router.get('/all', async (req, res) => {
  try {
    const tagData = await Tag.findAll();
    res.status(200).json(tagData);
  } catch {
    res.status(500).json(err);
  }
});



const get = {
  
}

module.exports = {router , get};