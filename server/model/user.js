const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
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
        required: [true, 'El correo es necesario']
    },
    password: {
        type: String,
        required: [true, 'El password es necesario']
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
    //Si no eliminamos el password del objeto se nos devolveria en las peticiones
    delete userObject.password;

    return userObject;
};

userSchema.plugin(uniqueValidator, {message: '{PATH}'});

module.exports = mongoose.model('User', userSchema);
