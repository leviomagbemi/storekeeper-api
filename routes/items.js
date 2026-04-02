const express = require('express');
const { ensureAuthenticated } = require('../middleware/authenticate');
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
  ensureAuthenticated,
  // #swagger.tags = ['Items']
  // #swagger.summary = 'Get all inventory items'
  // #swagger.security = [{ sessionAuth: [] }]
  getAllItems
);

router.get(
  '/:id',
  validateObjectId,
  ensureAuthenticated,
  // #swagger.tags = ['Items']
  // #swagger.summary = 'Get an item by id'
  // #swagger.parameters['id'] = { in: 'path', description: 'Item id', required: true, type: 'string' }
  // #swagger.security = [{ sessionAuth: [] }]
  getItemById
);

router.post(
  '/',
  ensureAuthenticated,
  validateCreateItemPayload,
  // #swagger.tags = ['Items']
  // #swagger.summary = 'Create an inventory item'
  // #swagger.security = [{ sessionAuth: [] }]
  createItem
);

router.put(
  '/:id',
  validateObjectId,
  ensureAuthenticated,
  validateUpdateItemPayload,
  // #swagger.tags = ['Items']
  // #swagger.summary = 'Update an inventory item'
  // #swagger.parameters['id'] = { in: 'path', description: 'Item id', required: true, type: 'string' }
  // #swagger.security = [{ sessionAuth: [] }]
  updateItem
);

router.delete(
  '/:id',
  validateObjectId,
  ensureAuthenticated,
  // #swagger.tags = ['Items']
  // #swagger.summary = 'Delete an inventory item'
  // #swagger.parameters['id'] = { in: 'path', description: 'Item id', required: true, type: 'string' }
  // #swagger.security = [{ sessionAuth: [] }]
  deleteItem
);

module.exports = router;
