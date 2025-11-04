import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import { serve } from 'inngest/express';
import { inngest, functions } from './inngest/index.js';
import { connectDB } from './config/db.js';

const app = express();

await connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/inngest', serve({ client: inngest, functions }));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// API routes
app.get('/', (req, res) => {
    res.send('Quick Show Server is running');
});
