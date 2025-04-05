cat > backend/mockServer.js << 'EOF'
/**
 * Mock server for development and testing without actual API dependencies
 */
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const logger = require('./utils/logger');

// Load predefined responses
const mockResponses = require('./data/mockResponses');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the frontend build directory
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
}

// API routes
app.post('/api/chat', (req, res) => {
  const { message, language = 'en' } = req.body;
  
  logger.info(`[MOCK] Received message in ${language}: ${message}`);
  
  // Find a suitable mock response
  let response = findMockResponse(message);
  
  // Simulate processing delay
  setTimeout(() => {
    res.json({ message: response });
  }, 1000);
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Get supported languages
app.get('/api/languages', (req, res) => {
  res.status(200).json({
    languages: [
      { code: 'en', name: 'English' },
      { code: 'hi', name: 'हिंदी (Hindi)' },
      { code: 'bn', name: 'বাংলা (Bengali)' },
      { code: 'te', name: 'తెలుగు (Telugu)' },
      { code: 'ta', name: 'தமிழ் (Tamil)' },
      { code: 'mr', name: 'मराठी (Marathi)' }
    ]
  });
});

// Feedback endpoint
app.post('/api/feedback', (req, res) => {
  logger.info('[MOCK] Received feedback:', req.body);
  res.status(200).json({ success: true });
});

// Serve the React app in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
  });
}

// Find a mock response based on keywords in the message
function findMockResponse(message) {
  const lowerMessage = message.toLowerCase();
  
  // Check for specific legal topics
  if (lowerMessage.includes('constitution') || lowerMessage.includes('fundamental rights')) {
    return mockResponses.constitutional;
  } else if (lowerMessage.includes('criminal') || lowerMessage.includes('fir') || lowerMessage.includes('police')) {
    return mockResponses.criminal;
  } else if (lowerMessage.includes('property') || lowerMessage.includes('land')) {
    return mockResponses.property;
  } else if (lowerMessage.includes('marriage') || lowerMessage.includes('divorce')) {
    return mockResponses.family;
  } else if (lowerMessage.includes('consumer') || lowerMessage.includes('refund')) {
    return mockResponses.consumer;
  } else if (lowerMessage.includes('job') || lowerMessage.includes('employee')) {
    return mockResponses.labor;
  } else if (lowerMessage.includes('contract') || lowerMessage.includes('agreement')) {
    return mockResponses.contract;
  } 
  
  // For simple greetings
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return mockResponses.greeting;
  }
  
  // Default response
  return mockResponses.general;
}

// Start the server
app.listen(PORT, () => {
  logger.info(`[MOCK] Server running on port ${PORT}`);
});
EOF