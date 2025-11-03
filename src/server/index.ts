// Load environment variables FIRST
import './env.js';

import express from 'express';
import cors from 'cors';
import uploadRouter from './routes/upload.js';
import slicingRouter from './routes/slicing.js';
import downloadRouter from './routes/download.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'SlicerCompare API is running' });
});

// Mount routers
app.use('/api', uploadRouter);
app.use('/api', slicingRouter);
app.use('/api/download', downloadRouter);

// Export app for testing
export { app };

// Start server only if not in test mode
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📡 API available at http://localhost:${PORT}/api`);
  });
}
