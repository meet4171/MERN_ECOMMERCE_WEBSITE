const { Order } = require("../model/Order");
const { Product } = require("../model/Product");

exports.fetchAllOrders = async (req, res) => {
    const page = parseInt(req.query._page) || 1;
    const limit = parseInt(req.query._limit) || 10;

    try {
        const totalOrderCount = await Order.countDocuments({});
        const allOrders = await Order.find({})
            .skip(limit * (page - 1))
            .limit(limit)
            .populate('userId')
            .exec();

        res.set('X-Total-Count', totalOrderCount);
        res.status(200).json(allOrders);
    } catch (error) {
        res.status(400).json(error);
    }
};
exports.updateOrderById = async (req, res) => {
    const id = req.params.id

    try {
        const updatedOrder = await Order.findByIdAndUpdate(id, req.body, { new: true })
        res.status(200).json(updatedOrder)

    } catch (error) {
        res.status(400).json(error)
    }

}
exports.updateProductById = async (req, res) => {
    const id = req.params.id
    try {
        const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: 'true' })
        res.status(200).json(updatedProduct)
    } catch (error) {
        res.status(400).json(error)

    }
}
