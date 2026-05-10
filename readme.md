# 🤖 Full-Stack AI Chat Platform

A high-performance chat application featuring a **Node.js/Express** backend and a **Vite/React** frontend. Built with a focus on speed, minimalist design, and seamless AI integration.

---

## 🏗️ System Architecture

| Component | Responsibility | Tech Stack |
| :--- | :--- | :--- |
| **Frontend** | UI/UX, Chat Interface, Auth Views | React, Vite, CSS Modules |
| **Backend** | API Logic, JWT Auth, AI Orchestration | Node.js, Express |
| **Storage** | User & Session Persistence | JSON File System |
| **AI Engine** | Natural Language Processing | Groq SDK |

---

## 🛠️ Project Structure

### 📂 Backend
> Located in `/backend`
* **`routes/`**: Handles authentication and chat logic.
* **`middleware/`**: Custom `auth.js` to protect private routes.
* **`data/`**: Local JSON storage for user profiles and history.

### 📂 Frontend
> Located in `/frontend`
* **`context/`**: Global state management for User and Chat data.
* **`hooks/`**: Custom logic for `useAutoScroll` and `useLocalStorage`.
* **`components/`**: Modularized UI components (ChatInput, Sidebar, etc.).

---

## 🚀 Installation & Setup

### 1. Root Configuration
Ensure your `.gitignore` is in the root directory to keep your `node_modules` and `.env` files out of your repository.

### 2. Backend Environment
```bash
# 1. Enter directory
cd backend

# 2. Install dependencies
npm install

# 3. Create .env file
touch .env