const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../model/user');
const app = express();
const jwt = require('jsonwebtoken');


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
        //Creamos el token aqui
        let token = jwt.sign({
            usuario: userDb
        }, 'developer-seed', { expiresIn: 60 * 60 * 24 * 30});

        res.json({
            ok: true,
            user: userDb,
            token
        })


    });
});





module.exports = app;