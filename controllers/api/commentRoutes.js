const router = require('express').Router();
const { Blogpost, Comment } = require('../../models');

router.post('/',  async (req, res) => {
  try {
    const newComment = await Comment.create({
      ...req.body,
      user_id: req.session.user_id,
    });

    res.status(200).json(newComment);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put('/:id',  async (req, res) => {
  try {
    const commentId = req.params.id;
    const comment = await Comment.findByPk(commentId);

      if (req.session.userId !== comment.userId) {
        res
          .status(400)
          .json({ message: 'You can only update your own tasks.' });
        return;
      }

      comment.set( req.body )
      
      comment.save();
      res.status(200).json("Success.");
    } catch (err) {
      res.status(400).json(err);
    }
  }
);

router.delete('/:id', async (req, res) => {
  try {
    const commentData = await Comment.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
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


const get = {
  /**
   * Find all comments. Default is return limit 5, ordered by createdAt, descending.
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
 * Find all comments. Default is return limit 5, ordered by createdAt, descending.
 * @param {Object} [options] - A hash of options to describe the scope of the search
 * @returns {Promise<Number>}
 */
  async countAllWithBlogpost(blogpostId,options={}) {
    const query = { 
      where: {blogpostId},
    }

    return Comment.count({...options, ...query})
  },

    /**
 * Find all comments. Default is return limit 5, ordered by createdAt, descending.
 * @param {Object} [options] - A hash of options to describe the scope of the search
 * @returns {Promise<Number>}
 */
  async count(options={}) {


    return Comment.count({...options, ...query})
  },
}


module.exports = router;