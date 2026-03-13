import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiZap } from 'react-icons/fi';
import api from '../api';

const AIGenerator = ({ onQuizGenerated }) => {
  const [subject, setSubject] = useState('');
  const [count, setCount] = useState(5);
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!subject) return toast.error('Please enter a subject');

    setGenerating(true);
    try {
      const res = await api.post('/quizzes/generate', { subject, count });
      toast.success('Quiz generated successfully!');
      if (onQuizGenerated) onQuizGenerated(res.data.quiz);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Generation failed. Try "javascript", "react", "html", "css", "nodejs", or "database"');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="glass-card" style={{ marginBottom: '2rem', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
      <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-color)' }}>
        <FiZap /> Quick Quiz Generator
      </h3>
      <p style={{ opacity: 0.7, fontSize: '0.9rem', marginBottom: '1.5rem' }}>
        Generate a practice quiz instantly using semantic injection. Try topics like <strong>Javascript</strong>, <strong>React</strong>, <strong>HTML</strong>, <strong>CSS</strong>, <strong>Nodejs</strong>, or <strong>Database</strong>.
      </p>

      <form onSubmit={handleGenerate} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <input 
            type="text" 
            placeholder="Topic (e.g. Javascript)" 
            className="input-field" 
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            style={{ marginBottom: 0 }}
          />
        </div>
        <div style={{ width: '120px' }}>
          <select 
            className="input-field" 
            value={count} 
            onChange={(e) => setCount(Number(e.target.value))}
            style={{ marginBottom: 0, appearance: 'none' }}
          >
            {[1, 3, 5, 10].map(n => (
              <option key={n} value={n} style={{ background: '#0f172a' }}>{n} Qs</option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn-primary" disabled={generating} style={{ height: '45px' }}>
          {generating ? 'Injecting...' : 'Generate Quiz'}
        </button>
      </form>
    </div>
  );
};

export default AIGenerator;
