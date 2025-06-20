import express from "express";
import mongoose from "mongoose";
import User from "../models/User.js";
import jwt from 'jsonwebtoken';
import { auth, authorize } from "../middleware/auth.js";
import dotenv from 'dotenv';

dotenv.config();





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
      return res.status(400).json({ message: 'User already exists' });
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


// POST /user/login
router.post('/login', async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ message: 'Phone and password are required' });
    }

    // Find user by phone
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({ message: 'User not found with this phone number' });
    }

    // Check if user is blocked
    if (user.isBlocked) {
      return res.status(403).json({ message: 'Your account is blocked. Contact support.' });
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    // Generate JWT
    const payload = {
      user: {
        id: user._id,
        role: user.role,
        phone: user.phone,
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    // Return token and user
    console.log(token, user)
    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        role: user.role,
        email: user.email || '',
        profilePic: user.profilePic || '',
      },
    });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});





router.get('/admin', auth, authorize(['admin']), async (req, res) => {
  try {
    const allUser = await User.find().select('-password'); // Exclude password field
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
