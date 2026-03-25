const express = require('express');
const { validateObjectId } = require('../validators/common');
const {
  validateCreateItemPayload,
  validateUpdateItemPayload
} = require('../validators/items');
const {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem
} = require('../controllers/items');

const router = express.Router();

router.get(
  '/',
  // #swagger.tags = ['Items']
  // #swagger.summary = 'Get all inventory items'
  getAllItems
);

router.get(
  '/:id',
  validateObjectId,
  // #swagger.tags = ['Items']
  // #swagger.summary = 'Get an item by id'
  // #swagger.parameters['id'] = { in: 'path', description: 'Item id', required: true, type: 'string' }
  getItemById
);

router.post(
  '/',
  validateCreateItemPayload,
  // #swagger.tags = ['Items']
  // #swagger.summary = 'Create an inventory item'
  createItem
);

router.put(
  '/:id',
  validateObjectId,
  validateUpdateItemPayload,
  // #swagger.tags = ['Items']
  // #swagger.summary = 'Update an inventory item'
  // #swagger.parameters['id'] = { in: 'path', description: 'Item id', required: true, type: 'string' }
  updateItem
);

router.delete(
  '/:id',
  validateObjectId,
  // #swagger.tags = ['Items']
  // #swagger.summary = 'Delete an inventory item'
  // #swagger.parameters['id'] = { in: 'path', description: 'Item id', required: true, type: 'string' }
  deleteItem
);

module.exports = router;
