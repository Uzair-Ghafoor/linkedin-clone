import { User } from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendWelcomeEmail } from '../emails/emailHandlers.js';
export const signupController = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;
    // all fields check
    if (!name || !username || !email || !password) {
      return res.status(400).json({
        message: 'All fields are required to continue.',
      });
    }
    const emailregex = /^[^\s@]+@[^@]+\.[^@]+$/;
    if (!emailregex.test(email)) {
      return res.status(400).json({ error: 'invalid email format' });
    }
    // email

    const existingEmail = await User.findOne({ email });

    if (existingEmail) {
      return res.status(400).json({ message: 'Email is already taken.' });
    }
    // username

    const existedUsername = await User.findOne({ username });
    if (existedUsername) {
      return res.status(400).json({ message: 'Username is already taken.' });
    }
    // password

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: 'Password must be atleast 6 characters long' });
    }
    const hashedPassword = await bcryptjs.hashSync(password, 10);
    const user = await User.create({
      name,
      email,
      username,
      password: hashedPassword,
    });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '3d',
    });
    res.cookie('jwt_secret', token, {
      httpOnly: true,
      maxAge: 3 * 60 * 60 * 1000,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });
    res.status(201).json({ message: 'User registered successfully.' });
    const profileUrl = `${process.env.CLIENT_URL}/profile/${user.username}`;
    try {
      await sendWelcomeEmail(user.email, user.name, profileUrl);
    } catch (error) {
      console.log(error.message);
    }
  } catch (error) {
    console.log('error in signup', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};
export const loginController = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcryptjs.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create and send token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '3d',
    });
    await res.cookie('jwt_secret', token, {
      httpOnly: true,
      maxAge: 3 * 24 * 60 * 60 * 1000,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });

    res.json({ message: 'Logged in successfully' });
  } catch (error) {
    console.error('Error in login controller:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
export const logoutController = async (req, res) => {
  try {
    res
      .cookie('jwt_secret', '', { maxAge: 0 })
      .status(200)
      .json('user logged out');
  } catch (error) {
    console.log(error.message);
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'No user found.' });
    }
    const { password, ...others } = user._doc;
    res.status(201).json(others);
  } catch (error) {
    console.log(error);
  }
};
