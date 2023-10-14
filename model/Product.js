const { mongoose } = require('../services/mongoose_connection')
const { Schema, model } = mongoose


const productSchema = new Schema({
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: [0, 'minimum value should be 0'], max: [100000, 'maximum value should be 1 lakh'] },
    discountPercentage: { type: Number, required: true, min: [1, 'minimum value should be 1'], max: [99, 'maximum value should be 99'] },
    rating: { type: Number, required: true, min: [0, 'minimum value should be 0'], max: [5, 'maximum value should be 5'], default: 0 },
    stock: { type: Number, required: true, min: [0, 'minimum value should be 0'], default: 0 },
    brand: { type: String, required: true },
    category: { type: String, required: true },
    images: { type: [String], required: true },
    thumbnail: { type: String, required: true },
    deleted: { type: Boolean, default: false }

}, { timestamps: true })

productSchema.virtual('id').get(function () {
    return this._id.toHexString();
});
productSchema.virtual('discountedPrice').get(function () {
    return Math.round((this.price - (this.price * (this.discountPercentage / 100))))
});

productSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.__v;
    }
});





exports.Product = model('Product', productSchema, 'products')