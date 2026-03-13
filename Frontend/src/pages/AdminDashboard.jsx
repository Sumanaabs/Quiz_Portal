import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import api from '../api';
import AIGenerator from '../components/AIGenerator';

const AdminDashboard = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchQuizzes = async () => {
    try {
      const res = await api.get('/quizzes');
      setQuizzes(res.data.quizzes || []);
    } catch (err) {
      toast.error('Failed to load quizzes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      try {
        await api.delete(`/admin/quizzes/${id}`);
        toast.success('Quiz deleted successfully');
        fetchQuizzes(); // refetch
      } catch (err) {
        toast.error('Failed to delete quiz');
      }
    }
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '4rem' }}>Loading Admin Panel...</div>;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem' }}>Admin Dashboard</h1>
        <Link to="/admin/quiz/new" className="btn-primary">
          <FiPlus /> New Quiz
        </Link>
      </div>

      <AIGenerator onQuizGenerated={() => fetchQuizzes()} />

      <h2 style={{ marginBottom: '1.5rem', fontSize: '1.8rem', opacity: 0.9 }}>Managed Quizzes</h2>
      
      {quizzes.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center' }}>
          <p style={{ opacity: 0.8, marginBottom: '1rem' }}>No quizzes created yet.</p>
          <Link to="/admin/quiz/new" className="btn-primary">Create Your First Quiz!</Link>
        </div>
      ) : (
        <div className="quiz-grid">
          {quizzes.map((quiz, index) => (
            <motion.div 
              key={quiz._id}
              className="glass-card"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--secondary-color)' }}>{quiz.title}</h2>
              <p style={{ opacity: 0.8, marginBottom: '1.5rem', minHeight: '3rem' }}>{quiz.description}</p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--glass-border)', paddingTop: '1rem' }}>
                <span style={{ fontSize: '0.9rem', opacity: 0.6 }}>{quiz.questions?.length || 0} Questions</span>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Link to={`/admin/quiz/edit/${quiz._id}`} className="btn-secondary" style={{ padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FiEdit2 />
                  </Link>
                  <button onClick={() => handleDelete(quiz._id)} className="btn-secondary" style={{ padding: '0.5rem', color: '#ef4444', borderColor: '#ef444433' }}>
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default AdminDashboard;
