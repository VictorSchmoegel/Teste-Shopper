import express from 'express';
import bodyParser from 'body-parser';
import rideRoutes from './routes/ride.routes';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use('/api', rideRoutes);

export default app;
