import 'dotenv/config';
import express from 'express';
import 'express-async-errors';
import helmet from 'helmet';
import morgan from 'morgan';

import { isAuth } from './middlewares/auth.middleware.js';
import errorHandler from './middlewares/error-handler.js';

import cors from 'cors';
import path from 'path';
import { Server } from 'socket.io';
import authRoues from './features/auth/auth.roues.js';
import { setUserIsOnline } from './features/auth/auth.service.js';
import branchRoutes from './features/branch/branch.routes.js';
import clientRoutes from './features/client/client.routes.js';
import contactUsMessagesRoutes from './features/contact-us-messages/routes.js';
import emailRoutes from './features/email/email.routes.js';
import employeeDailyReportRoutes from './features/employee-daily-report/routes.js';
import employeeRoutes from './features/employee/employee.routes.js';
import serviceRoutes from './features/service/service.routes.js';
import teamRoutes from './features/team/team.routes.js';
import { APIKeyGuard } from './middlewares/api-key.middleware.js';

const app = express();

app.use(cors({ origin: '*' }));
app.use('/public', express.static(path.resolve('public')));
app.use(express.json());
app.use(helmet());
app.use(morgan('common'));

app.use(APIKeyGuard);
app.use('/api/auth', authRoues);
app.use(isAuth);
app.use('/api/branches', branchRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/daily-reports', employeeDailyReportRoutes);
app.use('/api/emails', emailRoutes);
app.use('/api/contact-us', contactUsMessagesRoutes);

// error handler
app.use(errorHandler);

const port = process.env.PORT || 8080;

const server = app.listen(port, () => {
  console.log(`Backend Server is running on port ${port}`);
});

export const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

io.on('connection', (socket) => {
  console.log('connected', socket.id);
  socket.on('setup', (userId) => {
    console.log({ userId });
    console.log('Setup', userId);
    socket.join(userId.toString());
    socket.emit('connected');
    // TODO
    // setUserIsOnline(userId, true);
  });

  socket.on('disconnect', () => {
    console.log('Disconnected');
    // Remove the user from any rooms they are in
    Object.keys(socket.rooms).forEach((room) => {
      socket.leave(room);

      // TODO: set user isOnline = false
    });
  });
});
