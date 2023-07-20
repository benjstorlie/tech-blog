const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const Blogpost = require('./Blogpost');

class Comment extends Model {}

Comment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    body: {
      type: DataTypes.TEXT,
    },
    blogpostId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'blogpost',
        key: 'id',
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'user',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    timestamps: true,
    freezeTableName: true,
    underscored: true,
    modelName: 'comments',
    hooks: {
      afterCreate: async (comment, options) => {
        const blogpostId = comment.blogpostId;
        const count = await Comment.count({
          where: { blogpostId: comment.blogpostId}
        })

      },
      afterUpdate: async (comment, options) => {

      }
    }
  }
);

module.exports = Comment;
