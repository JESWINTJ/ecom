import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import router from './routes/index.js';
import connectDB from './configs/db.js';
import mainApiRouter from './routes/index.js';


dotenv.config();
const app = express();
const port = process.env.PORT || 5000;



// Middleware
app.use(express.json());
app.use(mainApiRouter); // ✅ This must be present
app.use(cookieParser());
// app.use(cors({
//   origin: 'http://localhost:5173',
//   credentials: true
// }));
app.use(cors());


// Routes
app.use('/api', router);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    message: err.message || 'Internal Server Error',
  });
});

// Connect to DB and start server
connectDB()
  .then(() => {
    console.log('✅ Database connected successfully');
    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
    });
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err);
    process.exit(1);
  });
