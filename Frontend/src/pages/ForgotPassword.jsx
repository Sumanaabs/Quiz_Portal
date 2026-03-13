import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [tokenHint, setTokenHint] = useState(''); // Just for demo purposes

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/forgot-password', { email });
      setSuccess(true);
      toast.success(res.data.message);
      if (res.data.resetToken) {
        setTokenHint(res.data.resetToken); // Show token on screen for local testing
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error processing request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <motion.div 
        className="glass-card"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{ width: '100%', maxWidth: '400px' }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Recover Password</h2>
        <p style={{ textAlign: 'center', opacity: 0.8, marginBottom: '2rem' }}>
          Enter your email and we'll send you a reset token.
        </p>
        
        {!success ? (
          <form onSubmit={handleSubmit}>
            <input 
              type="email" 
              placeholder="Your Email Address" 
              className="input-field" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', color: '#10b981', marginBottom: '1rem' }}>✓</div>
            <p>Token generated successfully!</p>
            {tokenHint && (
              <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', wordBreak: 'break-all' }}>
                <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>Demo Token:</span><br/>
                <strong style={{ color: 'var(--primary-color)' }}>{tokenHint}</strong>
              </div>
            )}
            <Link to={`/reset-password/${tokenHint || 'YOUR_TOKEN'}`} className="btn-primary" style={{ display: 'block', marginTop: '1.5rem', textDecoration: 'none' }}>
              Proceed to Reset Password
            </Link>
          </div>
        )}
        
        <p style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link to="/login" style={{ color: 'var(--text-color)', opacity: 0.8, textDecoration: 'none' }}>&larr; Back to Login</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
