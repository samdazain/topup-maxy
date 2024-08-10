const { User, Transaction } = require('../models');

const queueTask = async (senderId, recipientId, amount) => {
    setTimeout(async () => {
        const sender = await User.findByPk(senderId);
        const recipient = await User.findByPk(recipientId);

        if (sender.balance >= amount) {
            sender.balance -= amount;
            recipient.balance += amount;
            await sender.save();
            await recipient.save();
            await Transaction.create({ userId: sender.id, type: 'transfer', amount, status: 'completed' });
            await Transaction.create({ userId: recipient.id, type: 'receive', amount, status: 'completed' });
        } else {
            await Transaction.create({ userId: sender.id, type: 'transfer', amount, status: 'failed' });
        }
    }, 5000); // Simulating delay
};

module.exports = { queueTask };
