const express = require('express');
const { User, Transfer, TopUp, Payment } = require('../models');
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

// Transcation Report Feature
// Fetch all transactions for the authenticated user
router.get('/transactions', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;

        // Fetch all transfers, top-ups, and payments for the user
        const transfers = await Transfer.findAll({ where: { sender_id: userId } });
        const topUps = await TopUp.findAll({ where: { user_id: userId } });
        const payments = await Payment.findAll({ where: { user_id: userId } });

        const allTransactions = [];

        transfers.forEach(transfer => {
            allTransactions.push({
                transaction_id: transfer.id,
                status: 'SUCCESS',
                user_id: transfer.sender_id,
                transaction_type: 'DEBIT',
                amount: transfer.amount,
                remarks: transfer.remarks,
                balance_before: transfer.balance_before,
                balance_after: transfer.balance_after,
                created_date: transfer.createdAt
            });
        });

        topUps.forEach(topUp => {
            allTransactions.push({
                transaction_id: topUp.id,
                status: 'SUCCESS',
                user_id: topUp.user_id,
                transaction_type: 'CREDIT',
                amount: topUp.amount,
                remarks: '',
                balance_before: topUp.balance_before,
                balance_after: topUp.balance_after,
                created_date: topUp.createdAt
            });
        });

        payments.forEach(payment => {
            allTransactions.push({
                transaction_id: payment.id,
                status: 'SUCCESS',
                user_id: payment.user_id,
                transaction_type: 'DEBIT',
                amount: payment.amount,
                remarks: payment.remarks,
                balance_before: payment.balance_before,
                balance_after: payment.balance_after,
                created_date: payment.createdAt
            });
        });

        // Sort all transactions by created_date in descending order
        allTransactions.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));

        res.status(200).json({
            status: 'SUCCESS',
            result: allTransactions
        });

    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve transactions' });
    }
});

module.exports = router;
