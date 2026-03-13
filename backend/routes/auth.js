const express = require('express');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

const sendTokenResponse = (user, statusCode, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
  const options = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    httpOnly: true
  };
  res.status(statusCode)
     .cookie('token', token, options)
     .json({ success: true, token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
};

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    user = await User.create({ name, email, password, role: role || 'user' });
    sendTokenResponse(user, 201, res);
  } catch (err) {
    console.error('Registration Error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      console.log(`Login failed: User not found with email ${email}`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      console.log(`Login failed: Password mismatch for email ${email}`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    sendTokenResponse(user, 200, res);
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.post('/logout', (req, res) => {
  res.cookie('token', 'none', { expires: new Date(Date.now() + 10 * 1000), httpOnly: true });
  res.status(200).json({ success: true, data: {} });
});

router.get('/me', protect, async (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

router.post('/forgot-password', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ message: 'No user with that email' });
    
    // Create random token
    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    await user.save({ validateBeforeSave: false });

    // For demo, return the plain token in response (NOT secure in prod)
    res.status(200).json({ success: true, message: 'Password reset token generated', resetToken });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/reset-password/:resettoken', async (req, res) => {
  try {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.resettoken).digest('hex');
    const user = await User.findOne({ resetPasswordToken });
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid token' });
    }
    
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    await user.save();
    
    sendTokenResponse(user, 200, res);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
