# DevChat — AI Assistant for Developers

> A full-stack AI chat application built exclusively for developers. Debug code, explain concepts, optimize solutions — powered by Groq's llama-3.3-70b model.

**Live Demo:** [dev-chat-gilt.vercel.app](https://dev-chat-gilt.vercel.app)  
**GitHub:** [github.com/Qasim-Akram/DevChat](https://github.com/Qasim-Akram/DevChat)

---

## Tech Stack

**Frontend**
- React 19 + Vite
- React Router v6
- Context API + useReducer
- CSS Modules
- react-markdown + react-syntax-highlighter

**Backend**
- Node.js + Express
- MongoDB Atlas
- JWT authentication + bcrypt
- Groq API — llama-3.3-70b-versatile

**DevOps**
- Frontend → Vercel
- Backend → Railway
- Database → MongoDB Atlas

---

## Features

- JWT authentication with bcrypt password hashing
- Per-user chat sessions stored in MongoDB
- Multiple sessions with auto-generated titles
- Markdown rendering with syntax highlighted code blocks
- Copy button on code blocks
- Typing indicator animation
- Quick action chips — Debug, Explain, Optimize
- Collapsible sidebar with session history
- Error boundaries for graceful error handling
- Loading states throughout
- Glassmorphism dark UI

---

## Project Structure

```
DevChat/
├── frontend/
│   ├── src/
│   │   ├── components/     Sidebar, ChatMessage, ChatInput, CodeBlock, TypingIndicator, ErrorBoundary
│   │   ├── context/        AuthContext, ChatContext (useReducer)
│   │   ├── hooks/          useAutoScroll, useFormInput, useLocalStorage
│   │   ├── pages/          Login, Signup, Chat
│   │   └── utils/          auth.js, api.js
│   └── vercel.json
└── backend/
    ├── routes/             auth.js, chat.js, sessions.js
    ├── middleware/         auth.js (JWT verify)
    ├── db.js
    └── index.js
```

---

## Getting Started

### 1. Clone

```bash
git clone https://github.com/Qasim-Akram/DevChat.git
cd DevChat
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env
```

```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/devchat
GROQ_API_KEY=gsk_your_key_here
JWT_SECRET=your_random_secret
CLIENT_URL=http://localhost:5173
```

```bash
npm run dev
```

### 3. Frontend

```bash
cd frontend
npm install
cp .env.example .env
```

```env
VITE_API_URL=http://localhost:5000
```

```bash
npm run dev
```

---

## Environment Variables

### backend/.env

| Variable | Description |
|----------|-------------|
| `PORT` | Server port |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `GROQ_API_KEY` | From console.groq.com |
| `JWT_SECRET` | Any random string |
| `CLIENT_URL` | Frontend URL for CORS |

### frontend/.env

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API URL |

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/signup` | No | Create account |
| POST | `/api/auth/login` | No | Login |
| GET | `/api/sessions` | Yes | Get all sessions |
| POST | `/api/sessions` | Yes | Create session |
| GET | `/api/sessions/:id` | Yes | Get session + messages |
| DELETE | `/api/sessions/:id` | Yes | Delete session |
| POST | `/api/sessions/:id/messages` | Yes | Add message |
| POST | `/api/chat` | Yes | Get AI response |
| GET | `/api/health` | No | Health check |

---

## How It Works

1. User signs up → password hashed with bcrypt → JWT signed and returned
2. JWT stored in localStorage → sent with every request via `Authorization: Bearer`
3. Backend verifies JWT on every protected route
4. Messages sent to backend → Groq API called → response saved to MongoDB
5. Groq API key never leaves the server

---

## Author

**Muhammad Qasim Akram**  
BSCS — Islamia University of Bahawalpur  
[LinkedIn](https://linkedin.com/in/qasimakram) · [GitHub](https://github.com/Qasim-Akram) · [Portfolio](https://muhammadqasimakram.netlify.app)

---

## License

MIT
