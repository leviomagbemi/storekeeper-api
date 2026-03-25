const express = require('express');
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
  // #swagger.tags = ['Suppliers']
  // #swagger.summary = 'Get all suppliers'
  getAllSuppliers
);

router.get(
  '/:id',
  validateObjectId,
  // #swagger.tags = ['Suppliers']
  // #swagger.summary = 'Get a supplier by id'
  // #swagger.parameters['id'] = { in: 'path', description: 'Supplier id', required: true, type: 'string' }
  getSupplierById
);

router.post(
  '/',
  validateCreateSupplierPayload,
  // #swagger.tags = ['Suppliers']
  // #swagger.summary = 'Create a supplier'
  createSupplier
);

router.put(
  '/:id',
  validateObjectId,
  validateUpdateSupplierPayload,
  // #swagger.tags = ['Suppliers']
  // #swagger.summary = 'Update a supplier'
  // #swagger.parameters['id'] = { in: 'path', description: 'Supplier id', required: true, type: 'string' }
  updateSupplier
);

router.delete(
  '/:id',
  validateObjectId,
  // #swagger.tags = ['Suppliers']
  // #swagger.summary = 'Delete a supplier'
  // #swagger.parameters['id'] = { in: 'path', description: 'Supplier id', required: true, type: 'string' }
  deleteSupplier
);

module.exports = router;
