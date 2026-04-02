require('dotenv').config();

const fs = require('fs');
const path = require('path');
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo').default;
const swaggerUi = require('swagger-ui-express');
const connectDatabase = require('./dataAccess/database');
const { generateSwagger } = require('./swagger');
const { passport, configurePassport } = require('./middleware/passport');
const routes = require('./routes');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

const app = express();
const port = process.env.PORT || 3000;
const swaggerDocumentPath = path.join(__dirname, 'swagger.json');
const isProduction = process.env.NODE_ENV === 'production';
const sessionSecret =
  process.env.SESSION_SECRET ||
  (isProduction ? null : 'development-session-secret');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (!sessionSecret) {
  throw new Error('SESSION_SECRET is required in production.');
}

configurePassport();

if (isProduction) {
  app.set('trust proxy', 1);
}

app.use(
  session({
    name: 'storekeeper.sid',
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      dbName: process.env.DB_NAME || 'storekeeper',
      collectionName: 'sessions'
    }),
    cookie: {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24
    }
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Storekeeper API is running.',
    documentation: '/api-docs',
    authentication: '/auth/status'
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
