import 'dotenv/config';
import express from 'express';
import 'express-async-errors';
import helmet from 'helmet';
import morgan from 'morgan';

import { isAuth } from './middlewares/auth.middleware.js';
import errorHandler from './middlewares/error-handler.js';

import cors from 'cors';
import path from 'path';
import authRoues from './features/auth/auth.roues.js';
import branchRoutes from './features/branch/branch.routes.js';
import clientRoutes from './features/client/client.routes.js';
import employeeRoutes from './features/employee/employee.routes.js';
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

// error handler
app.use(errorHandler);

const port = process.env.PORT || 8080;

const server = app.listen(port, () => {
  console.log(`Backend Server is running on port ${port}`);
});
