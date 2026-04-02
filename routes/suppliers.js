const express = require('express');
const { ensureAuthenticated } = require('../middleware/authenticate');
const { validateObjectId } = require('../validators/common');
const {
  validateCreateSupplierPayload,
  validateUpdateSupplierPayload
} = require('../validators/suppliers');
const {
  getAllSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier
} = require('../controllers/suppliers');

const router = express.Router();

router.get(
  '/',
  ensureAuthenticated,
  // #swagger.tags = ['Suppliers']
  // #swagger.summary = 'Get all suppliers'
  // #swagger.security = [{ sessionAuth: [] }]
  getAllSuppliers
);

router.get(
  '/:id',
  validateObjectId,
  ensureAuthenticated,
  // #swagger.tags = ['Suppliers']
  // #swagger.summary = 'Get a supplier by id'
  // #swagger.parameters['id'] = { in: 'path', description: 'Supplier id', required: true, type: 'string' }
  // #swagger.security = [{ sessionAuth: [] }]
  getSupplierById
);

router.post(
  '/',
  ensureAuthenticated,
  validateCreateSupplierPayload,
  // #swagger.tags = ['Suppliers']
  // #swagger.summary = 'Create a supplier'
  // #swagger.security = [{ sessionAuth: [] }]
  createSupplier
);

router.put(
  '/:id',
  validateObjectId,
  ensureAuthenticated,
  validateUpdateSupplierPayload,
  // #swagger.tags = ['Suppliers']
  // #swagger.summary = 'Update a supplier'
  // #swagger.parameters['id'] = { in: 'path', description: 'Supplier id', required: true, type: 'string' }
  // #swagger.security = [{ sessionAuth: [] }]
  updateSupplier
);

router.delete(
  '/:id',
  validateObjectId,
  ensureAuthenticated,
  // #swagger.tags = ['Suppliers']
  // #swagger.summary = 'Delete a supplier'
  // #swagger.parameters['id'] = { in: 'path', description: 'Supplier id', required: true, type: 'string' }
  // #swagger.security = [{ sessionAuth: [] }]
  deleteSupplier
);

module.exports = router;
