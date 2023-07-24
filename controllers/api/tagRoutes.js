const router = require('express').Router();
const { Blogpost, Tag, } = require('../../models');


// Get ALL tags
router.get('/all', async (req, res) => {
  try {
    const tagData = await Tag.findAll();
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req,res) => {
  try {
    const tag = await Tag.create({
      tagName: req.body.tagName
    })
    res.status(200).json(tag);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete('/:id', async (req,res) => {
  try {
    await Tag.destroy({
      where: {id: req.params.id}
    })
    res.status(200).json(["success"]);
  } catch (err) {
    res.status(500).json(err);
  }
});

const get = {
  // complicated find functions one might want in "homeRoutes" setting up views.
}

module.exports = {router , get};