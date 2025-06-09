const {mongoose} = require('../services/mongoose_connection')
const { Schema, model } = mongoose

const categorySchema = new Schema({
    value: { type: String, required: true, unique: true },
    label: { type: String, required: true, unique: true },
    checked: { type: Boolean, default: false }
},{timestamps:true})
categorySchema.virtual('id').get(function () {
    return this._id.toHexString();
});
categorySchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.__v;
    }
});

exports.Category = model('Category', categorySchema,'categories')