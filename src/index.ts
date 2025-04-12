import express, { Request, Response, NextFunction } from 'express';
import admin from 'firebase-admin';
import * as swaggerUi from 'swagger-ui-express';
const swaggerDocument = require('./swagger.json'); // Import Swagger definition

// Initialize Firebase Admin SDK
const serviceAccount = require('../serviceAccountKey.json'); // Path to your service account key
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();
const port = process.env.PORT || 3000;

// Middleware to verify Firebase Authentication
const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
  }

  const token = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken; // Attach user info to the request
    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

// Example API endpoint (protected with Firebase Authentication)
app.get('/api/protected', authenticate, (req: Request, res: Response) => {
  res.json({
    message: 'Protected API endpoint accessed successfully!',
    user: req.user, // Access user data from the decoded token
  });
});

// Serve Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Default route
app.get('/', (req: Request, res) => {
  res.send('Welcome to the API!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
