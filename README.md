

# NyaySadhak - Legal Information Chatbot

<p align="center">
  <img src="frontend/public/logo.png" alt="NyaySadhak Logo" width="200" />
</p>

<p align="center">
  <strong>Accessible legal information in multiple Indian languages</strong>
</p>

## 🌟 Overview

NyaySadhak (meaning "Legal Seeker" in Hindi) is an AI-powered legal information chatbot designed to make legal knowledge more accessible to people across India. It provides general legal information in 11 Indian languages, helping users understand their rights and legal processes without legal jargon.

### Key Features

- 📚 **Legal Information**: Access information about constitutional rights, criminal procedures, property laws, family law, consumer protection, labor laws, and contract law
- 🗣️ **Multilingual Support**: Available in 11 Indian languages including Hindi, Bengali, Tamil, Telugu, and more
- 🔊 **Voice Input**: Speak your questions for a more natural interaction experience
- 🤖 **AI-Powered**: Leverages OpenAI's language models for accurate, contextual responses
- 🌐 **Accessibility**: Simple interface designed for users of all technical backgrounds

## 📋 Table of Contents

- [Demo](#demo)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [Roadmap](#roadmap)
- [License](#license)
- [Acknowledgements](#acknowledgements)

## 🎬 Demo

[View Live Demo](https://nyaysadhak.vercel.app) (Coming Soon)

<p align="center">
  <img src="docs/screenshots/chat-interface.png" alt="NyaySadhak Interface" width="600" />
</p>

## 💻 Technology Stack

### Frontend
- React.js
- CSS3 with responsive design
- Web Speech API for voice input

### Backend
- Node.js with Express
- OpenAI API for natural language processing
- Google Cloud Translation API for language support
- Winston for logging

## 🚀 Getting Started

### Prerequisites
- Node.js (v16.0.0 or higher)
- npm or yarn
- OpenAI API key
- Google Cloud Translation API credentials (for multilingual support)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/NyaySadhak.git
   cd NyaySadhak
   ```

2. Install backend dependencies
   ```bash
   cd backend
   npm install
   ```

3. Set up environment variables
   ```bash
   cp .env.template .env
   # Edit .env with your API keys and configuration
   ```

4. Install frontend dependencies
   ```bash
   cd ../frontend
   npm install
   ```

5. Start the development servers

   Backend:
   ```bash
   cd ../backend
   npm run dev
   ```

   Frontend (in a new terminal):
   ```bash
   cd ../frontend
   npm start
   ```

6. Open your browser and navigate to `http://localhost:3000`

## 📁 Project Structure

```
NyaySadhak/
├── backend/                # Node.js backend
│   ├── data/               # Mock responses and legal prompts
│   ├── utils/              # Utility functions for logging, validation, etc.
│   ├── server.js           # Main server file
│   └── mockServer.js       # Mock server for testing without API calls
│
├── frontend/               # React frontend
│   ├── public/             # Static files
│   └── src/                # React source code
│       ├── components/     # UI components
│       ├── App.js          # Main application component
│       └── index.js        # Entry point
│
└── docs/                   # Documentation
```

## 📘 API Documentation

### Chat Endpoint
`POST /api/chat`

Request body:
```json
{
  "message": "What is habeas corpus?",
  "language": "en"
}
```

Response:
```json
{
  "message": "Habeas corpus is a legal principle that ensures..."
}
```

### Languages Endpoint
`GET /api/languages`

Response:
```json
{
  "languages": [
    { "code": "en", "name": "English" },
    { "code": "hi", "name": "हिंदी (Hindi)" },
    ...
  ]
}
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🗺️ Roadmap

- [ ] Add more specialized legal domains
- [ ] Implement user accounts for saving conversation history
- [ ] Develop mobile applications
- [ ] Add document parsing for legal documents
- [ ] Integrate with legal aid resources

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👏 Acknowledgements

- OpenAI for their powerful language models
- Google Cloud for translation capabilities
- All contributors who have helped build and improve NyaySadhak
- Legal professionals who provided guidance on legal content accuracy

---

<p align="center">
  Made with ❤️ for making legal information accessible to all
</p>
```

