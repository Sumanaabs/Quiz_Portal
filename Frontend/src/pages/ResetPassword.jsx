import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../api';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return toast.error('Passwords do not match');
    }
    
    setLoading(true);
    try {
      await api.post(`/auth/reset-password/${token}`, { password });
      toast.success('Password updated successfully');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid or expired token');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <motion.div 
        className="glass-card"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ width: '100%', maxWidth: '400px' }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Create New Password</h2>
        
        <form onSubmit={handleSubmit}>
          <input 
            type="password" 
            placeholder="New Password" 
            className="input-field" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength="6"
          />
          <input 
            type="password" 
            placeholder="Confirm New Password" 
            className="input-field" 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
            {loading ? 'Updating...' : 'Set Password'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
