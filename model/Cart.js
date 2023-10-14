// const mongoose = require('mongoose')
const {mongoose} = require('../services/mongoose_connection')

const { Schema, model } = mongoose


const cartSchema = new Schema({
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    quantity: { type: Number, required: true }

},{timestamps:true})
cartSchema.virtual('id').get(function () {
    return this._id.toHexString();
});
cartSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.__v;
    }
});

exports.Cart = model('Cart', cartSchema,'carts')