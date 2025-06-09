const { error } = require("console");
const { Order } = require("../model/Order");
const { User } = require("../model/User");


exports.fetchUserById = async (req, res) => {
    const { id } = req.user;
    try {
        const loggedInUser = await User.findById(id, 'username addresses email id role').exec();
        if (!loggedInUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(loggedInUser);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

exports.updateUser = async (req, res) => {
    const { id } = req.user;
    try {
        const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

exports.fetchOrdersByUser = async (req, res) => {
    const { id } = req.user;
    try {
        const ordersByUser = await Order.find({ userId: id }).exec();

        if (!ordersByUser || ordersByUser.length === 0) {
            return res.status(404).json([]);
        }
        res.status(200).json(ordersByUser);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

