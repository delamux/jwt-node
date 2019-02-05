const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../model/user');
const app = express();


app.post('/login', (req, res) => {
    let body = req.body;

    User.findOne({email: body.email}, (error, userDb) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                error
            });
        }

        if ( !userDb ) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: "(User) or password incorrect"
                }
            });
        }

        if ( !bcrypt.compareSync(body.password, userDb.password) ) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: "User or (Password) incorrect"
                }
            });
        }

        res.json({
            ok: true,
            user: userDb,
            token: "123"
        })


    });
});





module.exports = app;