
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class BlogpostTag extends Model {}

BlogpostTag.init({
  blogpostId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'blogpost',
      key: 'id'
    }
  },
  tagId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'tag', 
      key: 'id'
    }
  },
},
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'blogpostTag',
  }
);

module.exports = BlogpostTag;