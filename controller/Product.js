const { Product } = require('../model/Product')
exports.createProduct = async (req, res) => {
    const product = new Product(req.body)
    try {
        const response = await product.save()
        res.status(201).json(response)

    } catch (error) {
        res.status(400).json(error)
    }
}
exports.fetchAllProducts = async (req, res) => {

    try {

        let query = Product.find({ deleted: { $ne: true } })
        let totalProductsQuery = Product.find({ deleted: { $ne: true } })
        if (req.query.category) {
            query = query.find({ category: { $in: req.query.category.split(',') } });
            totalProductsQuery = totalProductsQuery.find({
                category: { $in: req.query.category.split(',') },
            });
        }
        if (req.query.brand) {
            query = query.find({ brand: { $in: req.query.brand.split(',') } });
            totalProductsQuery = totalProductsQuery.find({ brand: { $in: req.query.brand.split(',') } });
        }
        if (req.query._sort && req.query._order) {
            query = query.sort({ [req.query._sort]: req.query._order });
        }

        if (req.query._page && req.query._limit) {
            const pageSize = req.query._limit;
            const page = req.query._page;
            query = query.skip(pageSize * (page - 1)).limit(pageSize);
        }
        const totalNumberOfProducts = await totalProductsQuery.countDocuments().exec();
        const data = await query.exec()

        res.set('X-Total-Count', totalNumberOfProducts);
        return res.status(200).json(data)
    } catch (error) {
        return res.status(400).json(error)

    }
}



exports.fetchProductById = async (req, res) => {
    const id = req.params.id
    try {
        const selectedProduct = await Product.findById(id)
        res.status(200).json(selectedProduct)
    } catch (error) {
        res.status(400).json(error)

    }
}
