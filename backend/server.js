
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { OpenAI } = require('openai');
const { translateText } = require('./utils/translator');
const logger = require('./utils/logger');
const { validateInput } = require('./utils/validator');
const legalPrompts = require('./data/legalPrompts');
const rateLimit = require('express-rate-limit');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Set up rate limiting for API
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per 15 minutes
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: 'Too many requests, please try again later.',
});

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/', limiter); // Apply rate limiting to API routes

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
}

// API routes
app.post('/api/chat', async (req, res) => {
  try {
    const { message, language = 'en' } = req.body;
    
    // Validate input
    if (!validateInput(message)) {
      return res.status(400).json({ error: 'Invalid input' });
    }
    
    // Log the incoming request
    logger.info(`Received message in ${language}: ${message}`);
    
    // If not in English, translate to English for processing
    let processedMessage = message;
    if (language !== 'en') {
      processedMessage = await translateText(message, language, 'en');
      logger.info(`Translated to English: ${processedMessage}`);
    }
    
    // Get the appropriate legal context prompt based on detected topics
    const legalContext = getLegalContext(processedMessage);
    
    // Prepare the prompt for OpenAI
    const prompt = `
      You are NyaySadhak, a legal information assistant designed to provide helpful, accurate, and accessible legal information.
      
      ${legalContext}
      
      Important guidelines:
      - Provide accurate legal information based on current laws and regulations.
      - Clearly state that you are providing general information, not legal advice.
      - Recommend consulting a qualified legal professional for specific situations.
      - Be concise but comprehensive in your responses.
      - Use simple language that is easy to understand.
      - If uncertain about specific jurisdiction details, make that clear.
      - Do not make up information or speculate on legal outcomes.
      
      User's question: ${processedMessage}
    `;
    
    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-3.5-turbo", // Use environment variable or default to gpt-3.5-turbo
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: processedMessage }
      ],
      temperature: 0.7,
      max_tokens: 1500
    });
    
    let responseMessage = completion.choices[0].message.content;
    
    // If not in English, translate the response back to the requested language
    if (language !== 'en') {
      responseMessage = await translateText(responseMessage, 'en', language);
      logger.info(`Translated response to ${language}`);
    }
    
    // Send the response
    return res.json({ message: responseMessage });
  } catch (error) {
    logger.error('Error processing message:', error);
    return res.status(500).json({ error: 'An error occurred while processing your request' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// API documentation endpoint
app.get('/api/docs', (req, res) => {
  res.status(200).json({
    description: 'NyaySadhak API Documentation',
    endpoints: [
      {
        path: '/api/chat',
        method: 'POST',
        description: 'Send a legal query and get a response',
        params: {
          message: 'The legal question or query (required)',
          language: 'Language code (optional, defaults to "en")'
        },
        example: {
          request: {
            message: 'What is habeas corpus?',
            language: 'en'
          },
          response: {
            message: 'Habeas corpus is a legal principle...'
          }
        }
      },
      {
        path: '/api/health',
        method: 'GET',
        description: 'Check if the API is operational',
        example: {
          response: {
            status: 'ok'
          }
        }
      }
    ]
  });
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
      { code: 'mr', name: 'मराठी (Marathi)' },
      { code: 'gu', name: 'ગુજરાતી (Gujarati)' },
      { code: 'kn', name: 'ಕನ್ನಡ (Kannada)' },
      { code: 'ml', name: 'മലയാളം (Malayalam)' },
      { code: 'pa', name: 'ਪੰਜਾਬੀ (Punjabi)' },
      { code: 'ur', name: 'اردو (Urdu)' }
    ]
  });
});

// Feedback endpoint
app.post('/api/feedback', (req, res) => {
  const { message, rating, comment } = req.body;
  
  // Log feedback
  logger.info('Received feedback:', {
    message,
    rating,
    comment
  });
  
  // In a production environment, you might want to store this in a database
  
  res.status(200).json({ success: true });
});

// Serve the React app in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
  });
}

// Helper function to determine the legal context based on the message
function getLegalContext(message) {
  const lowerMessage = message.toLowerCase();
  
  // Check for different legal domains and return appropriate context
  if (lowerMessage.includes('constitution') || lowerMessage.includes('fundamental rights')) {
    return legalPrompts.constitutional;
  } else if (lowerMessage.includes('criminal') || lowerMessage.includes('fir') || lowerMessage.includes('police')) {
    return legalPrompts.criminal;
  } else if (lowerMessage.includes('property') || lowerMessage.includes('land') || lowerMessage.includes('real estate')) {
    return legalPrompts.property;
  } else if (lowerMessage.includes('marriage') || lowerMessage.includes('divorce') || lowerMessage.includes('custody')) {
    return legalPrompts.family;
  } else if (lowerMessage.includes('consumer') || lowerMessage.includes('refund') || lowerMessage.includes('product')) {
    return legalPrompts.consumer;
  } else if (lowerMessage.includes('job') || lowerMessage.includes('employee') || lowerMessage.includes('workplace')) {
    return legalPrompts.labor;
  } else if (lowerMessage.includes('contract') || lowerMessage.includes('agreement') || lowerMessage.includes('breach')) {
    return legalPrompts.contract;
  } else {
    return legalPrompts.general;
  }
}

// Start the server
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

module.exports = app; // For testing purposes
