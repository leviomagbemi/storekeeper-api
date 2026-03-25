const express = require('express');
const itemsRouter = require('./items');
const suppliersRouter = require('./suppliers');

const router = express.Router();

router.use('/items', itemsRouter);
router.use('/suppliers', suppliersRouter);

module.exports = router;
