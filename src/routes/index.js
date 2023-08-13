const router = require('express').Router();
const { requireAll } = require('../utils/core-helpers');
const { usersRoutes, petsRoutes, authRoutes } = requireAll('./routes');

const getServerStatus = (req, res) => {
  res.send({ success: true, message: 'Welcome to Wiggler' });
};
const catchAllUnhandled = (req, res) => {
  res.status(404).send({
    message: `Can't find method ${req.method} on ${req.originalUrl}`,
  });
};

router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/pets', petsRoutes);

// server routes:
router.route('/').get(getServerStatus);
router.route('*').all(catchAllUnhandled);

module.exports = router;
