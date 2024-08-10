const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const router = express.Router();

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
