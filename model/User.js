const { mongoose } = require('../services/mongoose_connection')
const { Schema, model } = mongoose


const userSchema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    addresses: { type: [Schema.Types.Mixed], default: [] },
    role: { type: String, default: 'user' },
    Order: { type: [Schema.Types.Mixed], default: [] },
    resetPassToken: { type: String, default: '' }
},{timestamps:true})
userSchema.virtual('id').get(function () {
    return this._id.toHexString();
});
userSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.__v;
    }
});

exports.User = model('User', userSchema, 'users')