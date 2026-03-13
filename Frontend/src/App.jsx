import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { useContext } from 'react';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import TakeQuiz from './pages/TakeQuiz';
import QuizEditor from './pages/QuizEditor';
import Progress from './pages/Progress';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" />;
  return children;
};

const AppRoutes = () => {
  const { user } = useContext(AuthContext);
  return (
    <>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Navigate to={user ? (user.role === 'admin' ? '/admin/dashboard' : '/dashboard') : '/login'} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          
          <Route path="/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
          <Route path="/progress" element={<ProtectedRoute><Progress /></ProtectedRoute>} />
          <Route path="/quiz/:id" element={<ProtectedRoute><TakeQuiz /></ProtectedRoute>} />
          
          <Route path="/admin/dashboard" element={<ProtectedRoute adminOnly={true}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/quiz/new" element={<ProtectedRoute adminOnly={true}><QuizEditor /></ProtectedRoute>} />
          <Route path="/admin/quiz/edit/:id" element={<ProtectedRoute adminOnly={true}><QuizEditor /></ProtectedRoute>} />
        </Routes>
      </div>
    </>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
        <Toaster position="top-right" toastOptions={{ style: { background: '#1e293b', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' } }} />
      </AuthProvider>
    </Router>
  );
}

export default App;
