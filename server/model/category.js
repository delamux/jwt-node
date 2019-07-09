const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: [true, 'The name is required']
    },
    description: {
        type: String
    },
    user: {
        type: Schema.Types.ObjectId, ref: 'User'
    }
});

module.exports = mongoose.model('Category', CategorySchema);
