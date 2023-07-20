const sequelize = require('../config/connection');
const { User, Blogpost, Comment, Tag, BlogpostTag, BlogpostComment } = require('../models');

const userSeeds = require('./userSeeds.json');
const blogpostSeeds = require('./blogpostSeeds.json');
const tagSeeds = require('./tagSeeds.json');
const commentSeeds = require('./commentSeeds.json');
const blogpostTagSeeds = require('./blogpostTagSeeds.json');

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  const users = await User.bulkCreate(userSeeds, {
    individualHooks: true,  // encrypts passwords
    returning: true,
  });

  const blogposts = await Blogpost.bulkCreate(blogpostSeeds, {
    returning: true,
  });

  const comments = await Comment.bulkCreate(commentSeeds, {
    returning: true,
  });

  const tags = await Tag.bulkCreate(tagSeeds, {
    returning: true,
  });

  const blogpostTags = await BlogpostTag.bulkCreate(blogpostTagSeeds, {
    returning: true,
  });

  process.exit(0);
};

seedDatabase();
