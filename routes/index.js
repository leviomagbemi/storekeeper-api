const express = require('express');
const authRouter = require('./auth');
const itemsRouter = require('./items');
const suppliersRouter = require('./suppliers');

const router = express.Router();

router.use('/auth', authRouter);
router.use('/items', itemsRouter);
router.use('/suppliers', suppliersRouter);

module.exports = router;
