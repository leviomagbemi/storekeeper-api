require('dotenv').config();

const fs = require('fs');
const path = require('path');
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const connectDatabase = require('./dataAccess/database');
const { generateSwagger } = require('./swagger');
const routes = require('./routes');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

const app = express();
const port = process.env.PORT || 3000;
const swaggerDocumentPath = path.join(__dirname, 'swagger.json');

app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Storekeeper API is running.',
    documentation: '/api-docs'
  });
});

app.use('/', routes);

const startServer = async () => {
  try {
    await generateSwagger();

    if (fs.existsSync(swaggerDocumentPath)) {
      const swaggerDocument = JSON.parse(
        fs.readFileSync(swaggerDocumentPath, 'utf8')
      );
      app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    }

    app.use(notFoundHandler);
    app.use(errorHandler);

    await connectDatabase();
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  }
};

startServer();
