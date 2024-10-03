import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
export const protectedRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt_secret;
    if (!token) {
      return res.status(401).json({ message: 'unauthorized' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(403).json({ message: 'forbidden' });
    }
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'Unauthorized: User Not Found' });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log(error.message);
  }
};
