

import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const auth = (req, res, next) => {
  console.log(req.headers)
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Invalid token' });
    req.user = decoded.user;
    next();
  });
};

const authorize = (roles) => (req, res, next) => {
  console.log("reqUser", req.user, "requestUserRole", req.user.role)
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Insufficient permissions' });
  }
  next();
};

export { auth, authorize };

