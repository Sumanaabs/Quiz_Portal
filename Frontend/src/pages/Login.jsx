import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await login(email, password);
      toast.success(`Welcome back, ${data.user.name}!`);
      if (data.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <motion.div 
        className="glass-card animate-float"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        style={{ width: '100%', maxWidth: '400px' }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '2rem' }}>Welcome Back</h2>
        
        <form onSubmit={handleLogin}>
          <input 
            type="email" 
            placeholder="Email Address" 
            className="input-field" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="input-field" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.8 }}>
              <input type="checkbox" /> Remember me
            </label>
            <Link to="/forgot-password" style={{ color: 'var(--secondary-color)', textDecoration: 'none' }}>Forgot Password?</Link>
          </div>
          
          <button type="submit" className="btn-primary" style={{ width: '100%' }}>Login</button>
        </form>
        
        <p style={{ textAlign: 'center', marginTop: '1.5rem', opacity: 0.8 }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--primary-color)', textDecoration: 'none' }}>Sign up</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
