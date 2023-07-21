const router = require('express').Router();
const { Blogpost, User, Tag, Comment } = require('../../models');

router.post('/', async (req, res) => {
  try {
    const newBlogpost = await Blogpost.create({
      ...req.body,
      userId: req.session.user_id,
    });

    res.status(200).json(newBlogpost);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put('/tags', async (req, res) => {
  try {
    const { blogpostId , tagIds } = req.body;
    const blogpost= await Blogpost.findByPk(blogpostId);

    if (!blogpost) {
      res
        .status(404)
        .json({ message: `No blogpost with id ${blogpostId}` });
      return;
    } 
    const tags = await Tag.findAll({where: {id: tagIds}});

    if (tags.length != tagIds.length) {
      res
        .status(404)
        .json({ message: `Some tag ids were not found.` });
      return;
    }

    await blogpost.setTags(tags);
    blogpost = await blogpost.reload()
    res.status(200).json(blogpost);

  } catch (err) {
    res.status(500).json(err);
  }
})

router.put('/:id',  async (req, res) => {
  try {
    const blogpostId = req.params.id;
    const blogpost = await Blogpost.findByPk(blogpostId, {attributes:['userId']});

    if (req.session.userId !== blogpost.userId) {
      res
        .status(400)
        .json({ message: 'You can only update your own posts.' });
      return;
    }

    Blogpost.update( req.body , {where: {id: blogpostId}});

    res.status(200).json("Success.");
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const blogpostData = await Blogpost.destroy({
      where: {
        id: req.params.id,
        userId: req.session.userId,
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

// Get ALL blogposts
router.get('/all', async (req, res) => {
  try {
    const blogpostData = await Blogpost.findAll();
    res.status(200).json(blogpostData);
  } catch {
    res.status(500).json(err);
  }
});

router.get('/', async (req, res) => {
  try {
    const page = req.query.page;
    const blogpostData = await get.findAll({offset: (page > 1 ? (page-1)*5 : 0)});
    res.status(200).json(blogpostData);
  } catch {
    res.status(500).json(err);
  }
});

router.get('/id', async (req, res) => {
  try {
    const blogpostData = await get.findByPk(id);
    res.status(200).json(blogpostData);
  } catch {
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
