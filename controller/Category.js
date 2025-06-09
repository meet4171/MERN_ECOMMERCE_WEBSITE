const { Category } = require("../model/Category")


exports.createCategory = async (req, res) => {
    const newCategory = new Category(req.body)
    try {
        const response = await newCategory.save()
        res.status(201).json(response)

    } catch (error) {
        res.status(400).json(error)
    }
}



exports.fetchAllCategory = async (req, res) => {
    try {
        const categories = await Category.find({})
        res.status(200).json(categories)
    } catch (error) {
        res.status(400).json(error)
    }
}