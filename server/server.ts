import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import { serve } from 'inngest/express';
import { inngest, functions } from './inngest/index.js';
import { connectDB } from './config/db.js';
import { clerkMiddleware } from '@clerk/express';
import moviesRouter from './routes/moviesRoutes.js';
import bookingsRouter from './routes/bookingsRoutes.js';
import adminRouter from './routes/adminRoutes.js';
import userRouter from './routes/userRoutes.js';

const app = express();

await connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware())
app.use('/api/inngest', serve({ client: inngest, functions }));
app.use('/api/movies', moviesRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/admin', adminRouter);
app.use('/api/users', userRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// API routes
app.get('/', (req, res) => {
    res.send('Quick Show Server is running');
});
