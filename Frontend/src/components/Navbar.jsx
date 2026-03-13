import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="nav-bar">
      <Link to="/" style={{ textDecoration: 'none' }}>
        <motion.div 
          className="logo"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          QuizPortal
        </motion.div>
      </Link>
      
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        {user ? (
          <>
            <span style={{ fontWeight: 500, opacity: 0.8 }}>Hello, {user.name}</span>
            {user.role === 'admin' ? (
              <Link to="/admin/dashboard" className="btn-secondary" style={{ textDecoration: 'none', padding: '0.4rem 1rem' }}>Admin</Link>
            ) : (
              <>
                <Link to="/dashboard" className="btn-secondary" style={{ textDecoration: 'none', padding: '0.4rem 1rem' }}>Quizzes</Link>
                <Link to="/progress" className="btn-secondary" style={{ textDecoration: 'none', padding: '0.4rem 1rem' }}>My Progress</Link>
              </>
            )}
            <button onClick={handleLogout} className="btn-secondary" style={{ padding: '0.4rem 1rem' }}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn-secondary" style={{ textDecoration: 'none' }}>Login</Link>
            <Link to="/register" className="btn-primary" style={{ textDecoration: 'none' }}>Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
