const { Model, DataTypes, fn , col } = require('sequelize');
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
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
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
      allowNull: false,
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
    modelName: 'comment',
    hooks: {
      afterCreate: async (comment, options) => {
        await Blogpost.increment({commentCount: 1}, {where: {id: comment.blogpostId}});
      },
      afterDestroy: async (comment, options) => {
        await Blogpost.decrement({commentCount: 1}, {where: {id: comment.blogpostId}});
      },
      afterBulkCreate: async (comments, options) => {
        // Group comments by blogpostId and count them using Sequelize's aggregate function
        const commentCounts = await Comment.findAll({
          attributes: ['blogpostId', [fn('COUNT', col('id')), 'count']],
          group: ['blogpostId'],
          raw: true,
        });
        for (const countData of commentCounts) {
          const { blogpostId, count } = countData;
          await Blogpost.update({ commentCount: count }, { where: { id: blogpostId } });
        }
      }
    }
  }
);

module.exports = Comment;
