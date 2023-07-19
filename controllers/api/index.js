const router = require('express').Router();
const {router:userRoutes} = require('./userRoutes');
const {router: blogpostRoutes} = require('./blogpostRoutes');
const {router: commentRoutes} = require('./commentRoutes');
const {router: tagRoutes} = require('./tagRoutes');

router.use('/users', userRoutes);
router.use('/projects', projectRoutes);

module.exports = router;
