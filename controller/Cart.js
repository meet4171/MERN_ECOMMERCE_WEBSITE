const { Cart } = require("../model/Cart")

exports.addToCart = async (req, res) => {
    const { id } = req.user
    const cartItem = new Cart({ ...req.body, user: id })
    try {
        const populatedRes = await cartItem.populate('product')
        const response = await populatedRes.save()
        res.status(201).json(response)

    } catch (error) {
        res.status(400).json(error)
    }
}
exports.fetchCartByUser = async (req, res) => {

    const { id } = req.user
    try {
        const cartByUser = await Cart.find({ user: id }).populate('product').populate('user')
                res.status(200).json(cartByUser)

    } catch (error) {
        res.status(400).json(error)
    }

}
exports.udpateCartItem = async (req, res) => {

    const itemId = req.params.id

    try {
        const cartItem = await Cart.findByIdAndUpdate(itemId, req.body, { new: true }).populate('product').populate('user')
        res.status(200).json(cartItem)

    } catch (error) {
        res.status(400).json(error)
    }

}
exports.deleteCartItem = async (req, res) => {

    const itemId = req.params.id

    try {
        const response = await Cart.findByIdAndDelete(itemId)
        res.status(204).json({ message: "Deleted Successfully" })

    } catch (error) {
        res.status(400).json(error)
    }

}
