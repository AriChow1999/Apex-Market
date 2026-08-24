const User = require('../schemas/UserSchema');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');



// 1. Register / Create User (Signup)
const signup = async (req, res) => {
    try {
        // Extract and trim whitespace from fields
        const username = req.body.username?.trim();
        const email = req.body.email?.trim();
        const password = req.body.password?.trim();

        // Optional: Validate that fields aren't empty after trimming
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required and cannot be empty spaces.' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists.' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const isAdminUser = email === process.env.ADMIN_EMAIL;

        // Create new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            isAdmin: isAdminUser
        });

        await newUser.save();



        res.status(201).json({
            message: 'User created successfully',
            user: { id: newUser._id, username: newUser.username, email: newUser.email, isAdmin: newUser.isAdmin }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error during signup', error: error.message });
    }
};

// 2. Login User
const login = async (req, res) => {
    try {
        // Extract and trim whitespace from email and password
        const email = req.body.email?.trim();
        const password = req.body.password?.trim();

        // Validate that fields aren't empty after trimming
        if (!email || !password) {
            return res.status(400).json({ message: 'All fields are required and cannot be empty spaces.' });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        // Validate password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(200).json({
            message: 'Logged in successfully',
            token,
            user: { id: user._id, username: user.username, email: user.email, isAdmin: user.isAdmin }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error during login', error: error.message });
    }
};



const updateUsername = async (req, res) => {
    try {
        const username = req.body.username?.trim();

        if (!username) {
            return res.status(400).json({ message: 'Username cannot be empty.' });
        }

        // Use req.user.id to match { id: user._id } from jwt.sign
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { username },
            { new: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json({
            message: 'Username updated successfully',
            user: { id: updatedUser._id, username: updatedUser.username, email: updatedUser.email, isAdmin: updatedUser.isAdmin }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error during username update', error: error.message });
    }
};

const updatePassword = async (req, res) => {
    try {
        const newPassword = req.body.newPassword?.trim();

        if (!newPassword) {
            return res.status(400).json({ message: 'New password cannot be empty.' });
        }

        // Use req.user.id here as well
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error during password update', error: error.message });
    }
};

module.exports = { signup, login, updateUsername, updatePassword };
