import 'dotenv/config';

import app from './src/app.js';
import connectDB from './src/config/db.js';
import swaggerRouter from './src/docs/swagger.js';

const PORT = process.env.PORT || 5000;

// Mount Swagger documentation UI
app.use('/api-docs', swaggerRouter);

// Connect to database
connectDB();

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
