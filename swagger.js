require('dotenv').config();

const fs = require('fs');
const path = require('path');
const swaggerAutogen = require('swagger-autogen')();

const resolveBaseUrl = () => {
  if (process.env.APP_BASE_URL) {
    return process.env.APP_BASE_URL;
  }

  if (
    process.env.NODE_ENV === 'production' &&
    process.env.RENDER_EXTERNAL_URL
  ) {
    return process.env.RENDER_EXTERNAL_URL;
  }

  return `http://localhost:${process.env.PORT || 3000}`;
};

const baseUrl = new URL(resolveBaseUrl());

const doc = {
  info: {
    title: 'Storekeeper API',
    description: 'Inventory management API for CSE341 Week 3 project'
  },
  host: baseUrl.host,
  schemes: [baseUrl.protocol.replace(':', '')],
  definitions: {
    SupplierInput: {
      name: 'Tech Source Ltd',
      email: 'sales@techsource.com',
      phone: '+2348012345678',
      address: '12 Warehouse Road, Lagos',
      contactPerson: 'Ada Johnson'
    },
    ItemInput: {
      name: 'Wireless Mouse',
      sku: 'WM-1001',
      category: 'Electronics',
      quantityInStock: 25,
      unitPrice: 19.99,
      supplier: '65f0749dbe57a3fb53c0b111',
      reorderLevel: 10,
      location: 'Shelf A3',
      description: 'Compact wireless mouse',
      lastRestocked: '2026-03-20T00:00:00.000Z'
    }
  }
};

const outputFile = path.join(__dirname, 'swagger.json');
const endpointsFiles = ['./app.js'];

const generateSwagger = async () => {
  await swaggerAutogen(outputFile, endpointsFiles, doc);

  const swaggerOutput = JSON.parse(fs.readFileSync(outputFile, 'utf8'));
  const itemsCollectionPath = swaggerOutput.paths['/items/']
    ? '/items/'
    : '/api/items/';
  const itemByIdPath = swaggerOutput.paths['/items/{id}']
    ? '/items/{id}'
    : '/api/items/{id}';
  const suppliersCollectionPath = swaggerOutput.paths['/suppliers/']
    ? '/suppliers/'
    : '/api/suppliers/';
  const supplierByIdPath = swaggerOutput.paths['/suppliers/{id}']
    ? '/suppliers/{id}'
    : '/api/suppliers/{id}';

  swaggerOutput.paths[itemsCollectionPath].post.parameters = [
    {
      in: 'body',
      name: 'body',
      description: 'Inventory item data',
      required: true,
      schema: {
        $ref: '#/definitions/ItemInput'
      }
    }
  ];

  swaggerOutput.paths[itemByIdPath].put.parameters = [
    {
      name: 'id',
      in: 'path',
      required: true,
      type: 'string',
      description: 'Item id'
    },
    {
      in: 'body',
      name: 'body',
      description: 'Inventory item data',
      required: true,
      schema: {
        $ref: '#/definitions/ItemInput'
      }
    }
  ];

  swaggerOutput.paths[suppliersCollectionPath].post.parameters = [
    {
      in: 'body',
      name: 'body',
      description: 'Supplier data',
      required: true,
      schema: {
        $ref: '#/definitions/SupplierInput'
      }
    }
  ];

  swaggerOutput.paths[supplierByIdPath].put.parameters = [
    {
      name: 'id',
      in: 'path',
      required: true,
      type: 'string',
      description: 'Supplier id'
    },
    {
      in: 'body',
      name: 'body',
      description: 'Supplier data',
      required: true,
      schema: {
        $ref: '#/definitions/SupplierInput'
      }
    }
  ];

  delete swaggerOutput.paths[itemsCollectionPath].post.requestBody;
  delete swaggerOutput.paths[itemByIdPath].put.requestBody;
  delete swaggerOutput.paths[suppliersCollectionPath].post.requestBody;
  delete swaggerOutput.paths[supplierByIdPath].put.requestBody;

  fs.writeFileSync(outputFile, JSON.stringify(swaggerOutput, null, 2));

  return swaggerOutput;
};

if (require.main === module) {
  generateSwagger();
}

module.exports = {
  generateSwagger
};
