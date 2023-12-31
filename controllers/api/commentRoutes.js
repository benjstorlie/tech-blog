const router = require('express').Router();
const { Blogpost, Comment , User} = require('../../models');
const { literal } = require('sequelize');

router.post('/',  async (req, res) => {
  try {
    const newComment = await Comment.create({
      ...req.body,
      userId: req.session.userId,
    });

    res.status(200).json(newComment);
  } catch (err) {
    res.status(400).json({
      ...req.body,
      userId: req.session.userId,
    });
  }
});

router.put('/:id',  async (req, res) => {
  try {
    const commentId = req.params.id;
    const comment = await Comment.findByPk(commentId,{attributes:['userId']});

      if (req.session.userId !== comment.userId) {
        res
          .status(400)
          .json({ message: 'You can only update your own comments.' });
        return;
      }

      Comment.update( req.body ,{where: {id: commentId}})
      res.status(200).json("Success.");
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

router.delete('/:id', async (req, res) => {
  try {
    const commentData = await Comment.destroy({
      where: {
        id: req.params.id,
        userId: req.session.userId,
      },
    });

    if (!commentData) {
      res.status(404).json({ message: 'No comment found with this id!' });
      return;
    }

    res.status(200).json(commentData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get ALL comments
router.get('/all', async (req, res) => {
  try {
    const commentData = await Comment.findAll({
      attributes: { exclude: ['userId'] },
    });

    if (!commentData) {
      res.status(404).json({ message: 'No comment found with this id!' });
      return;
    }

    res.status(200).json(commentData);
  } catch (err){
    res.status(500).json(err);
  }
})

router.get('/blogpost/:id', async (req, res) => {
  try {
    const commentData = await get.findAllWithBlogpost(req.params.id);
    if (!commentData) {
      res.status(404).json({ message: 'No comment found with this id!' });
      return;
    }
    res.status(200).json(commentData);
  } catch(err) {
    res.status(500).json(err);
  }
})

router.get('/blogpost/:id/user/:userId', async (req, res) => {
  try {
    const options = {
      attributes: {include: [[literal(`user.id = ${req.params.userId}`),'isUserComment']]}
      } 
    const commentData = await get.findAllWithBlogpost(req.params.id,options);
    if (!commentData) {
      res.status(404).json({ message: 'No comment found with this id!' });
      return;
    }
    res.status(200).json(commentData);
  } catch(err) {
    res.status(500).json(err);
  }
})

router.get('/:id', async (req, res) => {
  try {
    const commentData = await get.findByPk(req.params.id);
    if (!commentData) {
      res.status(404).json({ message: 'No comment found with this id!' });
      return;
    }
    res.status(200).json(commentData);
  } catch(err) {
    res.status(500).json(err);
  }
})


const get = {
  /**
   * Find and count all comments for a given blogpost. Default is return limit 5, ordered by createdAt, descending.
   * @param {Object} [options] - A hash of options to describe the scope of the search
   * @returns {Promise<{count: number|number[], rows: Comment[]}>}
   */
  async findAllWithBlogpost(blogpostId,options={}) {
    const query = { 
      limit: 5 ,
      order:[['createdAt','DESC']] ,
      where: {blogpostId},
      include: [
        { model: User, attributes: { exclude: ['password', 'email'] } },
      ]
    }

    return Comment.findAndCountAll({...options, ...query})
  },

    /**
   * Find and count all comments for a given blogpost. Default is return limit 5, ordered by createdAt, descending.
   * @param {Object} [options] - A hash of options to describe the scope of the search
   * @returns {Promise<Comment>}
   */
    async findByPk(commentId,options={}) {
      const query = {
        attributes: {include: [
          { model: User, },
        ]}
      }
  
      return Comment.findByPk(commentId,{...options, ...query})
    },
}


module.exports = {router, get};