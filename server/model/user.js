const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
let Schema = mongoose.Schema;


let validRoles = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido'
};
let userSchema = new  Schema( {
    name: {
        type: String,
        required: [true, 'El nombre es necesarios']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El corres es necesarios']
    },
    password: {
        type: String,
        required: [true, 'El password es necesarios']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: validRoles
    },
    status: {
        type: Boolean,
        default: true
    }, //Bool
    google: {
        type: Boolean,
        default: false
    }, //Bool

});
userSchema.methods.toJSON = function () {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
};

userSchema.plugin(uniqueValidator, {message: '{PATH}'});

module.exports = mongoose.model('user', userSchema);