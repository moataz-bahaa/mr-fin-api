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
import appointmentRoutes from './features/appointment/routes.js';
import authRoues from './features/auth/auth.roues.js';
import branchRoutes from './features/branch/branch.routes.js';
import clientRoutes from './features/client/client.routes.js';
import { postContactUsMessage } from './features/contact-us-messages/controller.js';
import contactUsMessagesRoutes from './features/contact-us-messages/routes.js';
import emailRoutes from './features/email/email.routes.js';
import employeeDailyReportRoutes from './features/employee-daily-report/routes.js';
import employeeRoutes from './features/employee/employee.routes.js';
import fileRotues from './features/file/routes.js';
import invoiceRoutes from './features/invoice/invoice.routes.js';
import meetingRoutes from './features/meeting/routes.js';
import reviewRoutes from './features/review/routes.js';
import serviceRoutes from './features/service/service.routes.js';
import taskRoutes from './features/task/routes.js';
import teamRoutes from './features/team/team.routes.js';
import { APIKeyGuard } from './middlewares/api-key.middleware.js';
import prisma from './prisma/client.js';

const app = express();

app.use(cors({ origin: '*' }));
app.use('/public', express.static(path.resolve('public')));
app.use(express.json());
app.use(helmet());
app.use(morgan('common'));

app.use(APIKeyGuard);
app.use('/api/auth', authRoues);
app.post('/api/contact-us', postContactUsMessage);
app.use(isAuth);
app.use('/api/branches', branchRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/daily-reports', employeeDailyReportRoutes);
app.use('/api/emails', emailRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/meetings', meetingRoutes);
app.use('/api/files', fileRotues);
app.use('/api/tasks', taskRoutes);
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
  let roomId;
  socket.on('setup', (userId) => {
    if (userId) {
      roomId = userId;
      socket.join(userId.toString());
      socket.emit('connected');

      prisma.account
        .update({
          where: {
            id: roomId,
          },
          data: {
            isOnline: true,
          },
        })
        .then(() => {})
        .catch(() => {});
    }
  });

  socket.on('disconnect', () => {
    console.log('Disconnected');
    if (roomId) {
      prisma.account
        .update({
          where: {
            id: roomId,
          },
          data: {
            isOnline: false,
            logoutAt: new Date().toISOString()
          },
        })
        .then(() => {})
        .catch(() => {});
    }
  });
});
