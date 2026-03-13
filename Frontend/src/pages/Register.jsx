import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const data = await register(name, email, password, role);
      toast.success('Registration successful!');
      if (data.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <motion.div 
        className="glass-card"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ width: '100%', maxWidth: '450px' }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '2rem' }}>Create Account</h2>
        
        <form onSubmit={handleRegister}>
          <input 
            type="text" 
            placeholder="Full Name" 
            className="input-field" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
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
            minLength="6"
          />
          
          <select 
            className="input-field" 
            value={role} 
            onChange={(e) => setRole(e.target.value)}
            style={{ appearance: 'none' }}
          >
            <option value="user" style={{ background: '#0f172a' }}>Student / User</option>
            <option value="admin" style={{ background: '#0f172a' }}>Teacher / Admin</option>
          </select>
          
          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Sign Up</button>
        </form>
        
        <p style={{ textAlign: 'center', marginTop: '1.5rem', opacity: 0.8 }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary-color)', textDecoration: 'none' }}>Login</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
