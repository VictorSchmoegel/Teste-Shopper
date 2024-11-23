import express from 'express';
import rideRoutes from './routes/ride.routes';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());
app.use('/api', rideRoutes);

export default app;
