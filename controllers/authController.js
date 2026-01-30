
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role  
    },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '7d' }
  );
};


exports.register = async (req, res) => {
  try {
    const { name, email, password, role = 'client' } = req.body;

    console.log('📝 Registration attempt:', { name, email, role });

  
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

  
    const hashedPassword = await bcrypt.hash(password, 12);

   
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });

 
    const token = generateToken(user);

    console.log('✅ User created with role:', user.role);
    console.log('🔐 Token payload includes role:', { id: user.id, role: user.role });

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    
    const token = generateToken(user);

    console.log('🔑 Login successful, role:', user.role);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


exports.getMe = async (req, res) => {
  try {
   
    const user = req.user;

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('❌ GetMe error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


exports.logout = (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
};