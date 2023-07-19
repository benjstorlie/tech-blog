const Blogpost = require('./Blogpost');
const Tag = require('./Tag');
const BlogpostTag = sequelize.define('TagBlogposts', {
  blogpostId: {
    type: DataTypes.INTEGER,
    references: {
      model: Blogpost,
      key: 'id'
    }
  },
  tagId: {
    type: DataTypes.INTEGER,
    references: {
      model: Tag, 
      key: 'id'
    }
  }
});

module.exports = BlogpostTag;