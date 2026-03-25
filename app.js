require('dotenv').config();

const fs = require('fs');
const path = require('path');
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const connectDatabase = require('./dataAccess/database');
const routes = require('./routes');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

const app = express();
const port = process.env.PORT || 3000;
const swaggerDocumentPath = path.join(__dirname, 'swagger.json');

app.use(express.json());

if (fs.existsSync(swaggerDocumentPath)) {
  const swaggerDocument = require(swaggerDocumentPath);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

app.get('/', (req, res) => {
  // #swagger.ignore = true
  res.status(200).json({
    message: 'Storekeeper API is running.',
    documentation: '/api-docs'
  });
});

app.use('/api', routes);

app.use(notFoundHandler);
app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDatabase();
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  }
};

// #swagger.start
startServer();
