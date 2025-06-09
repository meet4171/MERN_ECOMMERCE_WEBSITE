const { Order } = require("../model/Order")
const { User } = require("../model/User")
const { sendInvoiceMail, updateStock } = require("../services/comman")
const { udpateCartItem } = require("./Cart")

exports.addNewOrder = async (req, res) => {
    const newOrder = new Order(req.body)
    try {
        await updateStock(newOrder.cartItems)
        const response = await newOrder.save()
        const userInfo = await User.findById(newOrder.userId)
        const orderInfo = await Order.findById(newOrder.id).populate('cartItems.product')
        sendInvoiceMail(userInfo, orderInfo)
        res.status(201).json(response)

    } catch (error) {
        res.status(400).json(error)
    }
}

