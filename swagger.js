const fs = require('fs');
const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Storekeeper API',
    description: 'Inventory management API for CSE341 Week 3 project'
  },
  host: 'localhost:3000',
  schemes: ['http'],
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

const outputFile = './swagger.json';
const endpointsFiles = ['./app.js'];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  const swaggerOutput = JSON.parse(fs.readFileSync(outputFile, 'utf8'));

  swaggerOutput.paths['/api/items/'].post.parameters = [
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

  swaggerOutput.paths['/api/items/{id}'].put.parameters = [
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

  swaggerOutput.paths['/api/suppliers/'].post.parameters = [
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

  swaggerOutput.paths['/api/suppliers/{id}'].put.parameters = [
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

  delete swaggerOutput.paths['/api/items/'].post.requestBody;
  delete swaggerOutput.paths['/api/items/{id}'].put.requestBody;
  delete swaggerOutput.paths['/api/suppliers/'].post.requestBody;
  delete swaggerOutput.paths['/api/suppliers/{id}'].put.requestBody;

  fs.writeFileSync(outputFile, JSON.stringify(swaggerOutput, null, 2));
});
