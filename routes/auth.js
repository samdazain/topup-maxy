const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

router.post('/register', async (req, res) => {
    try {
        const { first_name, last_name, phone_number, address, pin } = req.body;

        // Check if the phone number is already registered
        const existingUser = await User.findOne({ where: { phone_number } });
        if (existingUser) {
            return res.status(400).json({ message: 'Phone Number already registered' });
        }

        // Hash the pin before saving
        const hashedPin = await bcrypt.hash(pin, 10);

        // Create a new user
        const newUser = await User.create({
            id: uuidv4(), // Generate a UUID as the user ID
            first_name,
            last_name,
            phone_number,
            address,
            pin: hashedPin
        });

        res.status(201).json({
            status: 'SUCCESS',
            result: {
                user_id: newUser.id,
                first_name: newUser.first_name,
                last_name: newUser.last_name,
                phone_number: newUser.phone_number,
                address: newUser.address,
                created_date: newUser.createdAt
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to register user' });
    }
});


router.post('/login', async (req, res) => {
    try {
        const { phone_number, pin } = req.body;

        // Check if the user exists
        const user = await User.findOne({ where: { phone_number } });
        if (!user) {
            return res.status(400).json({ message: 'Phone number and pin doesn’t match.' });
        }

        // Check if the PIN is correct
        const isPinValid = await bcrypt.compare(pin, user.pin);
        if (!isPinValid) {
            return res.status(400).json({ message: 'Phone number and pin doesn’t match.' });
        }

        // Generate JWT tokens
        const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

        res.json({
            status: 'SUCCESS',
            result: {
                access_token: accessToken,
                refresh_token: refreshToken
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to login' });
    }
});

module.exports = router;
