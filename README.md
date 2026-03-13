# Online Quiz Portal

A Full-Stack Online Quiz Portal built with React (Vite) and Node.js/Express, MongoDB. 
It features a premium user interface with animations and glassmorphism.

## Features
- **Authentication**: User and Admin login, register, and forgot password flow.
- **Admin Dashboard**: Admins can Create, Edit, and Delete quizzes and questions. Admin role is required to access the backend quiz CRUD endpoints.
- **User Dashboard**: Users can take quizzes and see their live score.
- **UI/UX**: Beautiful animated CSS, React Hot Toasts, and Framer Motion transitions.

## Project Structure
- `backend/` - Node.js Express server.
  - `models/` - Mongoose schemas (`User.js`, `Quiz.js`).
  - `routes/` - API endpoints (`auth.js`, `admin.js`, `quiz.js`).
  - `middleware/` - JWT protection.
  - `server.js` - App entry point.
- `Frontend/` - React application built with Vite.
  - `src/App.jsx` - Main React Router setup.
  - `src/index.css` - Core beautiful global CSS rules.
  - `src/pages/` - All animated UI pages.
  - `src/context/` - Auth Context API for global state.

## How to Run locally

### Prerequisites
Make sure you have MongoDB running locally at `mongodb://127.0.0.1:27017/quiz_portal`.

### 1. Start Backend
```bash
cd backend
npm install
npm start
# Server runs on http://localhost:5000
```

### 2. Start Frontend
```bash
cd Frontend
npm install
npm run dev
# React app runs on http://localhost:5173
```
