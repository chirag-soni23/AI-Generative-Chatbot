import express from 'express'; 
import 'dotenv/config.js'; 
import morgan from 'morgan';
import {connectDb } from './db/db.js';
import userRoutes from './routes/userRoutes.js';
import cookieParser from 'cookie-parser';


connectDb();


const app = express(); 

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send("Hello, World!");
});

app.use('/api/user',userRoutes);

export default app;
