import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../api';

const Progress = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await api.get('/quizzes/results/me');
        setResults(res.data.results || []);
      } catch (err) {
        toast.error('Failed to load progress');
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  if (loading) return <div style={{ textAlign: 'center', marginTop: '4rem' }}>Loading Progress...</div>;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 style={{ marginBottom: '2rem', fontSize: '2.5rem' }}>My Quiz Progress</h1>
      
      {results.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center' }}>
          <p style={{ opacity: 0.8 }}>You haven't taken any quizzes yet. Start learning today!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {results.map((result, index) => (
            <motion.div 
              key={result._id}
              className="glass-card"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <div>
                <h2 style={{ fontSize: '1.5rem', color: 'var(--primary-color)', marginBottom: '0.5rem' }}>
                  {result.quiz?.title || 'Unknown Quiz'}
                </h2>
                <p style={{ opacity: 0.6, fontSize: '0.9rem' }}>
                  Taken on: {new Date(result.createdAt).toLocaleDateString()} at {new Date(result.createdAt).toLocaleTimeString()}
                </p>
              </div>
              
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: result.percentage >= 70 ? '#10b981' : '#f59e0b' }}>
                  {result.score} / {result.totalQuestions}
                </div>
                <div style={{ fontSize: '1rem', opacity: 0.8 }}>
                  {Math.round(result.percentage)}% Score
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default Progress;
