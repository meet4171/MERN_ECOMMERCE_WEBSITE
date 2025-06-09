const { Brands } = require('../model/Brands')
exports.createBrand = async (req, res) => {
    const newBrand = new Brands(req.body)
    try {
        const response = await newBrand.save()
        res.status(201).json(response)

    } catch (error) {
        res.status(400).json(error)
    }
}

exports.fetchAllBrands = async (req, res) => {
    try {
        const allBrands = await Brands.find({})
        res.status(200).json(allBrands)
    } catch (error) {
        res.status(400).json(error)

    }
}