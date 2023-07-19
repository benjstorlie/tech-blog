const Blogpost = require('./Blogpost');
const Comment = require('./Comment');
const BlogpostComment = sequelize.define('CommentBlogposts', {
  blogpostId: {
    type: DataTypes.INTEGER,
    references: {
      model: Blogpost,
      key: 'id'
    }
  },
  commentId: {
    type: DataTypes.INTEGER,
    references: {
      model: Comment, 
      key: 'id'
    }
  }
});

module.exports = BlogpostComment;