import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const demoUsers = [
  {
    name: 'Alex Admin',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'Admin',
  },
  {
    name: 'Jordan Smith',
    email: 'user@example.com',
    password: 'user123',
    role: 'User',
  },
  {
    name: 'Sam Taylor',
    email: 'sam@example.com',
    password: 'sam123',
    role: 'User',
  },
];

const generateToken = (user) =>
  jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });

const buildUserResponse = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
});

export const ensureDemoUsers = async () => {
  for (const demoUser of demoUsers) {
    const existingUser = await User.findOne({ email: demoUser.email });
    if (!existingUser) {
      const user = new User(demoUser);
      await user.save();
    }
  }
};

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    const user = new User({ name, email, password, role: 'User' });
    await user.save();

    const token = generateToken(user);
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      token,
      user: buildUserResponse(user),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Signup failed', error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(user);
    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: buildUserResponse(user),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Login failed', error: error.message });
  }
};
