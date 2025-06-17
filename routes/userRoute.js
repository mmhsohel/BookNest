import express from "express";
import mongoose from "mongoose";
import User from "../models/User.js";
import jwt from 'jsonwebtoken';
import { auth, authorize } from "../middleware/auth.js";
const router = express.Router();



router.post('/register', async (req, res) => {
  try {
   const jjjj=  await User.collection.getIndexes();
   console.log(jjjj)

    const { name, phone, password } = req.body;

    console.log("reqBody", req.body)
    // Check if user already exists
    const existingUser = await User.findOne({ phone : phone });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Create new user
    const user = new User({ name, phone, password});
    await user.save();

    // Respond with success message only
    res.status(201).json({ message: 'User created successfully' });

  } catch (err) {
    console.error('Register Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});



router.post('/login', async (req, res) => {
  const { phone, password } = req.body;
  console.log(req.body)
  if (!phone || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }
  const user = await User.findOne({ phone });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const valid = await user.comparePassword(password);
  if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ id: user._id, phone, name: user.name, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { name: user.name, role: user.role } });
});

router.get('/admin', auth, authorize(['admin']), async (req, res) => {
  try {
    const allUser = await User.find({});
    console.log("users", allUser);
    res.json({ success: true, users: allUser });
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({ success: false, message: "Failed to fetch users", error: error.message });
  }
});


router.patch('/admin/:userId', auth, authorize(['admin']), async (req, res) => {
  const userId = req.params.userId;
  const updates = { ...req.body };

  // Prevent phone number from being changed
  if ('phone' in updates) {
    delete updates.phone;
  }

  console.log('userId:', userId, 'updates (without phone):', updates);

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, message: 'User updated', user: updatedUser });
  } catch (error) {
    console.error('Update error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to update user', error: error.message });
  }
});


router.get('/editor', auth, authorize(['admin','editor']), (req, res) => res.json({ msg: 'Editor access granted' }));
router.get('/profile', auth, (req, res) => res.json({ name: req.user.name, role: req.user.role }));


export default router;
