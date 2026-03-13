const express = require('express');
const { protect } = require('../middleware/auth');
const Quiz = require('../models/Quiz');
const Result = require('../models/Result');

const router = express.Router();

router.use(protect);

// @route   GET /api/quizzes
// @desc    Get all quizzes
router.get('/', async (req, res) => {
  try {
    const quizzes = await Quiz.find().select('-questions.correctAnswer'); 
    res.status(200).json({ success: true, quizzes });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   GET /api/quizzes/results/me
// @desc    Get current user's quiz results
router.get('/results/me', async (req, res) => {
  try {
    const results = await Result.find({ user: req.user.id })
      .populate('quiz', 'title description')
      .sort('-createdAt');
    res.status(200).json({ success: true, results });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   GET /api/quizzes/:id
// @desc    Get single quiz
router.get('/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).select('-questions.correctAnswer');
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    res.status(200).json({ success: true, quiz });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   POST /api/quizzes/:id/submit
// @desc    Submit a quiz and save result
router.post('/:id/submit', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    
    const { answers } = req.body;
    let score = 0;
    
    quiz.questions.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) {
        score += 1;
      }
    });

    const totalQuestions = quiz.questions.length;
    const percentage = (score / totalQuestions) * 100;

    const result = await Result.create({
      user: req.user.id,
      quiz: quiz._id,
      score,
      totalQuestions,
      percentage
    });

    res.status(200).json({ success: true, score, total: totalQuestions, result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   POST /api/quizzes/generate
// @desc    Auto-generate a quiz using semantic template engine
router.post('/generate', async (req, res) => {
  try {
    const { subject, count } = req.body;
    const { generateQuizFromTemplate } = require('../utils/tempateEngine');
    
    const quizData = generateQuizFromTemplate(subject, count || 5);
    
    if (!quizData) {
      return res.status(400).json({ 
        message: 'Unsupported subject. Try "javascript", "react", or "database".' 
      });
    }

    const quiz = await Quiz.create(quizData);
    res.status(201).json({ success: true, quiz });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
