import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';

import authRoutes from './routes/auth.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import resourceRoutes from './routes/resource.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import lookupRoutes from './routes/lookup.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';

const app = express();

app.use(cors());

app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.resolve('uploads')));

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Resource Management Backend is running'
  });
});

app.use('/api/user', authRoutes);

app.use('/api/uploads', uploadRoutes);

app.use('/api/resources', resourceRoutes);
app.use('/api/notifications', notificationRoutes);

// Start 1-minute recurring cron for running resource notifications
import('./services/notification.service.js').then(({ startResourceRunningCron }) => {
  startResourceRunningCron();
});

app.use('/api/dashboard', dashboardRoutes);

app.use('/api', lookupRoutes);

export default app;
