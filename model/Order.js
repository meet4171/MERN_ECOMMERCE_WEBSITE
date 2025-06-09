const { mongoose } = require('../services/mongoose_connection')

const { Schema, model } = mongoose

const validPaymentMethods = {
    values: ['cod', 'card'],
    message: "Not a valid value choose either cod or card"
}
const orderSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    cartItems: [{ type: Schema.Types.Mixed, required: true }],
    totalQunatity: { type: Number, required: true },
    subTotal: { type: Number, required: true },
    subTotalWithDiscount: { type: Number, required: true },
    selectedAddress: { type: Schema.Types.Mixed },
    selectedPaymentMethod: { type: String, required: true, enum: validPaymentMethods },
    status: { type: String, default: 'Pending' },
}, { timestamps: true })

orderSchema.virtual('id').get(function () {
    return this._id.toHexString();
});
orderSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.__v;
    }
});

exports.Order = model('Order', orderSchema, 'orders')