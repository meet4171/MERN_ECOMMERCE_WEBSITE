const {mongoose} = require('../services/mongoose_connection')
const { Schema, model } = mongoose


const brandSchema = new Schema({
    value: { type: String, required: true, unique: true },
    label: { type: String, required: true, unique: true },
    checked: { type: Boolean, default: false },

},{timestamps:true})
brandSchema.virtual('id').get(function () {
    return this._id.toHexString();
});
brandSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.__v;
    }
});

exports.Brands = model('Brands', brandSchema,'brands')