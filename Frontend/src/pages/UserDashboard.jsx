import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api';

const UserDashboard = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchQuizzes = async () => {
    try {
      const res = await api.get('/quizzes');
      setQuizzes(res.data.quizzes || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  if (loading) return <div style={{ textAlign: 'center', marginTop: '4rem' }}>Loading Quizzes...</div>;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 style={{ marginBottom: '2rem', fontSize: '2.5rem' }}>Available Quizzes</h1>
      
      {quizzes.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center' }}>
          <p style={{ opacity: 0.8 }}>No quizzes available at the moment. Check back later!</p>
        </div>
      ) : (
        <div className="quiz-grid">
          {quizzes.map((quiz, index) => (
            <motion.div 
              key={quiz._id}
              className="glass-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
            >
              <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--primary-color)' }}>{quiz.title}</h2>
              <p style={{ opacity: 0.8, marginBottom: '1.5rem', minHeight: '3rem' }}>{quiz.description}</p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.9rem', opacity: 0.6 }}>{quiz.questions?.length || 0} Questions</span>
                <Link to={`/quiz/${quiz._id}`} className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                  Take Quiz
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default UserDashboard;
