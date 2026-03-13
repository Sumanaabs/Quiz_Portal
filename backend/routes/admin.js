const express = require('express');
const { protect, admin } = require('../middleware/auth');
const Quiz = require('../models/Quiz');

const router = express.Router();

// Apply middleware to all routes
router.use(protect);
router.use(admin);

// @route   POST /api/admin/quizzes
// @desc    Create a new quiz
router.post('/quizzes', async (req, res) => {
  try {
    const { title, description, questions } = req.body;
    const quiz = await Quiz.create({ title, description, questions });
    res.status(201).json({ success: true, quiz });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   PUT /api/admin/quizzes/:id
// @desc    Update a quiz
router.put('/quizzes/:id', async (req, res) => {
  try {
    let quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    
    quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({ success: true, quiz });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   DELETE /api/admin/quizzes/:id
// @desc    Delete a quiz
router.delete('/quizzes/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    
    await quiz.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
