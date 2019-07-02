const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let CategorySchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: [true, 'The name is required']
    },
    user_id: {
        type: Schema.Types.ObjectId, ref: 'User'
    }
});

module.exports = mongoose.model('Category', CategorySchema);
