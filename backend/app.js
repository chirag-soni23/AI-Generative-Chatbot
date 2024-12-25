import express from 'express'; 
import 'dotenv/config.js'; 
import morgan from 'morgan';
import {connectDb } from './db/db.js';
import userRoutes from './routes/userRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';


connectDb();


const app = express(); 

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send("Hello, World!");
});

app.use('/api/user',userRoutes);
app.use('/api/project',projectRoutes);

export default app;
