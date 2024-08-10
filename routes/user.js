const express = require('express');
const { User } = require('../models');
const jwt = require('jsonwebtoken');
const router = express.Router();

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Unauthenticated' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Forbidden' });
        req.user = user;
        next();
    });
};

// Update profile information
router.put('/profile', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { first_name, last_name, address } = req.body;

        // Find the user by ID
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update the user's profile information
        user.first_name = first_name || user.first_name;
        user.last_name = last_name || user.last_name;
        user.address = address || user.address;

        await user.save();

        res.status(200).json({
            status: 'SUCCESS',
            result: {
                user_id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                address: user.address,
                updated_date: user.updatedAt
            }
        });

    } catch (error) {
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

module.exports = router;
