// imports
import express from 'express';
import dotenv from 'dotenv';
import cookieParse from 'cookie-parser';
import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';
import postRoutes from './routes/post.route.js';
import notificationRoutes from './routes/notification.route.js';
import connectionsRoutes from './routes/connections.route.js';
import { connectDB } from './lib/db.js';
// instances
const app = express();
dotenv.config();

const port = process.env.PORT || 3500;
app.use(express.json());
app.use(cookieParse());
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/posts', postRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/connections', connectionsRoutes);

app.listen(port, () => {
  connectDB();
  console.log(`server is listening on port ${port}`);
});
