const router = require('express').Router();
const { Blogpost, User, Tag, Comment } = require('../../models');

router.post('/', async (req, res) => {
  try {
    const newBlogpost = await Blogpost.create({
      ...req.body,
      user_id: req.session.user_id,
    });

    res.status(200).json(newBlogpost);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put('/:id',  async (req, res) => {
  try {
    const blogpostId = req.params.id;
    const blogpost = await Blogpost.findByPk(blogpostId);

      if (req.session.userId !== blogpost.userId) {
        res
          .status(400)
          .json({ message: 'You can only update your own tasks.' });
        return;
      }

      blogpost.set( req.body )
      
      blogpost.save();
      res.status(200).json("Success.");
    } catch (err) {
      res.status(400).json(err);
    }
  }
);

router.delete('/:id', async (req, res) => {
  try {
    const blogpostData = await Blogpost.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!blogpostData) {
      res.status(404).json({ message: 'No blogpost found with this id!' });
      return;
    }

    res.status(200).json(blogpostData);
  } catch (err) {
    res.status(500).json(err);
  }
});

const get = {
  /**
   * Find all blogposts. Default is return limit 5, ordered by createdAt, descending.
   * @param {Object} [options] - A hash of options to describe the scope of the search
   * @returns {Promise<{count: number|number[], rows: Blogpost[]}>}
   */
  async findAll(options={}) {
    const query = { 
      limit: 5 ,
      order:[['createdAt','DESC']] ,
      include: [
        { model: User, attributes: { exclude: ['password', 'email'] } },
        { model: Tag, through: { attributes: [] } }, // Exclude junction table attributes 
      ]
    }

    return Blogpost.findAndCountAll({...options, ...query})
  },

  /**
   * Find all blogposts, with a given tagId. Default is return limit 5, ordered by createdAt, descending.
   * @param {Object} options - A hash of options to describe the scope of the search
   * @returns {Promise<{count: number|number[], rows: Blogpost[]}>}
   */
    async findAllWithTag(tagId,options={}) {
      const query = { 
        limit: 5 ,
        order:[['createdAt','DESC']] ,
        include: [
          { model: User, attributes: { exclude: ['password', 'email'] } },
          { model: Tag, where: { id: tagId}, through: { attributes: [] } }, // Exclude junction table attributes 
        ]
      }

      return Blogpost.findAndCountAll({...options, ...query})
    },

    /**
   * Find all blogposts, with a given userId. Default is return limit 5, ordered by createdAt, descending.
   * @param {Object} options - A hash of options to describe the scope of the search
   * @returns {Promise<{count: number|number[], rows: BlogPost[]}>}
   */
      async findAllWithUser(userId,options={}) {
        const query = { 
          limit: 5 ,
          order:[['createdAt','DESC']] ,
          include: [
            { model: User, where:{ id: userId }, attributes: { exclude: ['password', 'email'] } },
            { model: Tag, through: { attributes: [] } }, // Exclude junction table attributes 
          ]
        }
  
        return Blogpost.findAndCountAll({...options, ...query})
      },

  /**
   * Find blogpost by primary key
   * @param {Number | String} param - The value of the desired instance's primary key.
   * @param {Object} [options] - find options
   * @returns {Promise<Blogpost>}
   */
  async findByPk(blogpostId , options={}) {
    const query = {
      include: [
        { model: User, attributes: { exclude: ['password', 'email'] } },
        { model: Tag, through: { attributes: [] } }, // Exclude junction table attributes
      ]
    }
    return Blogpost.findByPk( blogpostId, {...options, ...query} )
  }
}

module.exports = {router , get};
