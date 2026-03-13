import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../api';

const TakeQuiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState([]); // Array of strings matching selected options
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await api.get(`/quizzes/${id}`);
        setQuiz(res.data.quiz);
        setAnswers(new Array(res.data.quiz.questions.length).fill(''));
      } catch (err) {
        toast.error('Failed to load quiz');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [id, navigate]);

  const handleSelectOption = (option) => {
    const newAnswers = [...answers];
    newAnswers[currentQIndex] = option;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQIndex < quiz.questions.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentQIndex > 0) {
      setCurrentQIndex(currentQIndex - 1);
    }
  };

  const handleSubmit = async () => {
    // Check if all answered
    if (answers.includes('')) {
      const confirmSubmit = window.confirm('You have unanswered questions. Are you sure you want to submit?');
      if (!confirmSubmit) return;
    }

    setSubmitting(true);
    try {
      const res = await api.post(`/quizzes/${id}/submit`, { answers });
      setResult({ score: res.data.score, total: res.data.total });
    } catch (err) {
      toast.error('Failed to submit quiz');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '4rem' }}>Loading Quiz...</div>;
  if (!quiz) return null;

  if (result) {
    const percentage = Math.round((result.score / result.total) * 100);
    return (
      <motion.div 
        className="glass-card" 
        style={{ maxWidth: '600px', margin: '4rem auto', textAlign: 'center' }}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', bounce: 0.5 }}
      >
        <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--primary-color)' }}>Quiz Completed!</h2>
        <div style={{ fontSize: '4rem', fontWeight: 'bold', margin: '2rem 0', background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          {result.score} / {result.total}
        </div>
        <p style={{ fontSize: '1.2rem', opacity: 0.8, marginBottom: '2rem' }}>
          You scored {percentage}%. {percentage >= 70 ? 'Great job!' : 'Keep practicing!'}
        </p>
        <button onClick={() => navigate('/dashboard')} className="btn-primary" style={{ width: '100%' }}>
          Back to Dashboard
        </button>
      </motion.div>
    );
  }

  const currentQ = quiz.questions[currentQIndex];

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', color: 'var(--text-color)' }}>{quiz.title}</h1>
        <p style={{ opacity: 0.8 }}>Question {currentQIndex + 1} of {quiz.questions.length}</p>
        
        {/* Progress bar */}
        <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', marginTop: '1rem', overflow: 'hidden' }}>
          <motion.div 
            style={{ height: '100%', background: 'linear-gradient(90deg, var(--primary-color), var(--secondary-color))' }}
            initial={{ width: 0 }}
            animate={{ width: `${((currentQIndex) / quiz.questions.length) * 100}%` }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQIndex}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -50, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="glass-card"
        >
          <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem', lineHeight: '1.4' }}>
            {currentQ.questionText}
          </h2>

          <div style={{ display: 'grid', gap: '1rem' }}>
            {currentQ.options.map((opt, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelectOption(opt)}
                style={{
                  padding: '1rem 1.5rem',
                  borderRadius: '8px',
                  background: answers[currentQIndex] === opt ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${answers[currentQIndex] === opt ? 'var(--primary-color)' : 'var(--glass-border)'}`,
                  color: 'white',
                  textAlign: 'left',
                  fontSize: '1.1rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem'
                }}
              >
                <div style={{ 
                  width: '24px', 
                  height: '24px', 
                  borderRadius: '50%', 
                  border: `2px solid ${answers[currentQIndex] === opt ? 'var(--primary-color)' : 'rgba(255,255,255,0.3)'}`,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  background: answers[currentQIndex] === opt ? 'var(--primary-color)' : 'transparent'
                }}>
                  {answers[currentQIndex] === opt && <div style={{ width: '10px', height: '10px', background: 'white', borderRadius: '50%' }} />}
                </div>
                {opt}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
        <button 
          className="btn-secondary" 
          onClick={handlePrev} 
          disabled={currentQIndex === 0}
          style={{ opacity: currentQIndex === 0 ? 0.3 : 1 }}
        >
          Previous
        </button>

        {currentQIndex === quiz.questions.length - 1 ? (
          <button 
            className="btn-primary" 
            onClick={handleSubmit}
            disabled={submitting}
            style={{ fontWeight: 'bold' }}
          >
            {submitting ? 'Submitting...' : 'Submit Quiz'}
          </button>
        ) : (
          <button className="btn-primary" onClick={handleNext}>
            Next Question
          </button>
        )}
      </div>
    </div>
  );
};

export default TakeQuiz;
