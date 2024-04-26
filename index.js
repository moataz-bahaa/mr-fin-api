import 'dotenv/config';
import express from 'express';
import 'express-async-errors';
import helmet from 'helmet';
import morgan from 'morgan';

import { initSocket } from './libs/socket.js';

import { isAuth } from './middlewares/auth.js';
import errorHandler from './middlewares/error-handler.js';

import branchRoutes from './features/branch/branch.routes.js';
import categoryRoutes from './features/category/category.routes.js';
import chatRoutes from './features/chat/chat.routes.js';
import clientRoutes from './features/client/client.routes.js';
import contactUsMessagRoutes from './features/contactUsMessage/contactUsMessage.routes.js';
import departmentRoutes from './features/department/department.routes.js';
import emailRoutes from './features/email/email.routes.js';
import employeeRoutes from './features/employee/employee.routes.js';
import fileRoutes from './features/file/file.routes.js';
import folderRoutes from './features/folder/folder.routes.js';
import invoiceRotues from './features/invoice/invoice.routes.js';
import serviceRoutes from './features/service/service.routes.js';
import teamRoutes from './features/team/team.routes.js';
import userRoutes from './features/user/user.routes.js';

const app = express();

app.use(express.json());
app.use(helmet());
app.use(morgan('common'));

app.use('/api/users', userRoutes);
app.use(isAuth);
app.use('/api/chats', chatRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/emails', emailRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/branches', branchRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/branches/teams', teamRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/contact-us-messages', contactUsMessagRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/invoices', invoiceRotues);
app.use('/api/folders', folderRoutes);
app.use('/api/files', fileRoutes);

// error handler
app.use(errorHandler);

const port = process.env.PORT || 8800;

const server = app.listen(port, () => {
  console.log(`Backend Server is running on port ${port}`);
});

// init socket server
initSocket(server);
