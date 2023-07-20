const User = require('./User');
const Blogpost = require('./Blogpost');
const Comment = require('./Comment');
const Tag = require('./Tag');
const BlogpostTag = require('./BlogpostTag');


// for One-To-One and One-to-Many relationships, ON DELETE defaults to SET NULL and ON UPDATE defaults to CASCADE.

// Unlike One-To-One and One-To-Many relationships, the defaults for both ON UPDATE and ON DELETE are CASCADE for Many-To-Many relationships

User.hasMany(Blogpost, {
  onDelete: 'CASCADE'
});

Blogpost.belongsTo(User, {
  foreignKey: 'userId'
});

User.hasMany(Comment, {
   onDelete: 'CASCADE'
});

Blogpost.hasMany(Comment, {
  onDelete: 'CASCADE'
})

Comment.belongsTo(Blogpost, {
  foreignKey: 'blogpostId',
})

// Blogposts belongToMany Tags (through BlogpostTag)
Blogpost.belongsToMany(Tag, {
  through: BlogpostTag,
})

// Tags belongToMany Blogposts (through BlogpostTag)
Tag.belongsToMany(Blogpost, {
  through: BlogpostTag,
})






module.exports = { User, Blogpost, Tag, Comment, BlogpostTag };
