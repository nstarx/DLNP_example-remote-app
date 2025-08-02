import express from 'express';
import cors from 'cors';
import axios from 'axios';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const FASTAPI_URL = process.env.FASTAPI_URL || 'http://localhost:8000';

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:4173'], // Vite dev and preview
  credentials: true
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(morgan('combined'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Proxy endpoints to FastAPI
app.get('/api/stats', async (req, res) => {
  try {
    const response = await axios.get(`${FASTAPI_URL}/api/stats`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching stats:', error.message);
    res.status(error.response?.status || 500).json({
      error: 'Failed to fetch statistics',
      message: error.message
    });
  }
});

app.get('/api/items', async (req, res) => {
  try {
    const response = await axios.get(`${FASTAPI_URL}/api/items`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching items:', error.message);
    res.status(error.response?.status || 500).json({
      error: 'Failed to fetch items',
      message: error.message
    });
  }
});

app.get('/api/items/:id', async (req, res) => {
  try {
    const response = await axios.get(`${FASTAPI_URL}/api/items/${req.params.id}`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching item:', error.message);
    res.status(error.response?.status || 500).json({
      error: 'Failed to fetch item',
      message: error.message
    });
  }
});

app.post('/api/items', async (req, res) => {
  try {
    const response = await axios.post(`${FASTAPI_URL}/api/items`, req.body);
    res.status(201).json(response.data);
  } catch (error) {
    console.error('Error creating item:', error.message);
    res.status(error.response?.status || 500).json({
      error: 'Failed to create item',
      message: error.message
    });
  }
});

app.put('/api/items/:id', async (req, res) => {
  try {
    const response = await axios.put(`${FASTAPI_URL}/api/items/${req.params.id}`, req.body);
    res.json(response.data);
  } catch (error) {
    console.error('Error updating item:', error.message);
    res.status(error.response?.status || 500).json({
      error: 'Failed to update item',
      message: error.message
    });
  }
});

app.delete('/api/items/:id', async (req, res) => {
  try {
    const response = await axios.delete(`${FASTAPI_URL}/api/items/${req.params.id}`);
    res.json(response.data);
  } catch (error) {
    console.error('Error deleting item:', error.message);
    res.status(error.response?.status || 500).json({
      error: 'Failed to delete item',
      message: error.message
    });
  }
});

// Additional endpoints for dashboard data
app.get('/api/sales-trend', async (req, res) => {
  // Mock sales trend data
  const salesData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Sales',
      data: [12000, 19000, 15000, 25000, 22000, 30000],
      borderColor: '#10b981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)'
    }]
  };
  res.json(salesData);
});

app.get('/api/recent-activity', async (req, res) => {
  // Mock activity data
  const activities = [
    { id: 1, user: 'John Doe', action: 'Created new order #1234', timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
    { id: 2, user: 'Jane Smith', action: 'Updated product inventory', timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString() },
    { id: 3, user: 'Bob Johnson', action: 'Completed order #1233', timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
    { id: 4, user: 'Alice Brown', action: 'Added new customer', timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString() },
    { id: 5, user: 'Charlie Wilson', action: 'Generated monthly report', timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString() }
  ];
  res.json(activities);
});

// Documentation endpoints
app.get('/api/docs', async (req, res) => {
  try {
    const response = await axios.get(`${FASTAPI_URL}/api/docs`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching docs:', error.message);
    res.status(error.response?.status || 500).json({
      error: 'Failed to fetch documentation list',
      message: error.message
    });
  }
});

app.get('/api/docs/:docName', async (req, res) => {
  try {
    const response = await axios.get(`${FASTAPI_URL}/api/docs/${req.params.docName}`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching doc content:', error.message);
    res.status(error.response?.status || 500).json({
      error: 'Failed to fetch documentation content',
      message: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong!'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

app.listen(PORT, () => {
  console.log(`Node.js server running on http://localhost:${PORT}`);
  console.log(`Connecting to FastAPI backend at ${FASTAPI_URL}`);
});