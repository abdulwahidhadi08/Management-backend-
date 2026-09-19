const User = require('../models/User');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '30d'
  });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const cleanPassword = String(password).trim();

    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(cleanPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    let profile = null;
    if (user.role === 'student' && user.referenceId) {
      profile = await Student.findById(user.referenceId);
    } else if (user.role === 'headmaster' && user.referenceId) {
      profile = await Teacher.findById(user.referenceId);
    }

    res.json({
      token: generateToken(user._id),
      user: {
        _id: user._id,
        email: user.email,
        role: user.role,
        referenceId: user.referenceId
      },
      profile
    });
  } catch (error) {
    console.error('Login controller error:', error);
    res.status(500).json({ message: 'Server error during login. Please try again.' });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    let profile = null;
    if (user.role === 'student' && user.referenceId) {
      profile = await Student.findById(user.referenceId);
    } else if (user.role === 'headmaster' && user.referenceId) {
      profile = await Teacher.findById(user.referenceId);
    }
    res.json({ user, profile });
  } catch (error) {
    console.error('GetMe controller error:', error);
    res.status(500).json({ message: 'Server error fetching user profile' });
  }
};

exports.updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Please enter current and new password' });
    }

    const user = await User.findById(req.user._id);
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect current password' });
    }

    user.password = newPassword;
    await user.save();
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('UpdatePassword controller error:', error);
    res.status(500).json({ message: 'Server error updating password' });
  }
};
