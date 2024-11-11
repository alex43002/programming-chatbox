# Programming Chatbox Project

This project is a conversational chatbox application designed to help users with programming-related questions. It uses a Node.js backend to interact with the Gemini API for AI-generated responses and a React frontend with Markdown support to display formatted messages. The frontend mimics a chat interface similar to ChatGPT, with Markdown formatting for enhanced readability.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Project](#running-the-project)
  - [Starting the Backend](#starting-the-backend)
  - [Starting the Frontend](#starting-the-frontend)
- [Project Structure](#project-structure)

## Prerequisites

Make sure you have the following installed on your system:

- **Node.js**: v18.17.0
- **npm**: v9.6.7

You can check your versions by running:

```bash
node -v
npm -v
```

If you need to install Node.js and npm, download the installer from [Node.js official website](https://nodejs.org/).

## Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/your-username/programming-chatbox.git
   cd programming-chatbox
   ```

2. **Install dependencies for the backend**:

   ```bash
   cd backend
   npm install
   ```

3. **Install dependencies for the frontend**:

   ```bash
   cd ../frontend
   npm install
   ```

## Configuration

1. In the `backend` directory, create a `.env` file to store your Gemini API credentials:

   ```plaintext
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   GEMINI_API_URL=https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent
   CACHE_DURATION=86400
   ```

   Replace `your_actual_gemini_api_key_here` with your Gemini API key.

2. Add `chatHistory.json` in the `backend` folder if it doesn’t exist. This file will be used to store conversation history and should be initialized with an empty array:

   ```json
   []
   ```

## Running the Project

### Starting the Backend

1. Navigate to the `backend` directory:

   ```bash
   cd backend
   ```

2. Start the backend server:

   ```bash
   npm start
   ```

   The backend will run at `http://localhost:5000`.

### Starting the Frontend

1. Open a new terminal and navigate to the `frontend` directory:

   ```bash
   cd frontend
   ```

2. Start the frontend server:

   ```bash
   npm start
   ```

   The frontend will run at `http://localhost:3000`.

## Project Structure

Here’s a quick overview of the project structure:

```
programming-chatbox/
├── backend/
│   ├── .env               # Environment variables for the backend
│   ├── chatHistory.json   # Stores conversation history
│   ├── server.js          # Express server and API endpoint logic
│   ├── package.json       # Backend dependencies
└── frontend/
    ├── src/               # React components and frontend logic
    ├── public/            # Public assets
    ├── package.json       # Frontend dependencies
    └── README.md          # Project documentation
```

## Dependencies

### Backend Dependencies

The backend relies on the following dependencies:

- **express**: Web server framework for handling routes and API requests.
- **dotenv**: Loads environment variables from `.env` file.
- **cors**: Allows cross-origin requests from the frontend.

### Frontend Dependencies

The frontend relies on the following dependencies:

- **react**: JavaScript library for building user interfaces.
- **react-dom**: Allows React to interact with the DOM.
- **react-markdown**: Renders Markdown for formatted responses.
- **tailwindcss**: Utility-first CSS framework for styling.

### Development Dependencies

- **tailwindcss** and **postcss**: For configuring and processing Tailwind CSS.

## Notes

- The chat history is saved to `chatHistory.json` in the backend and retrieved for each conversation.
- The frontend uses Markdown to render formatted messages, giving a clean, readable chat interface.
- This project utilizes context-based messaging by sending previous messages in each API request to maintain conversation continuity.

## License

This project is open-source and available under the MIT License.