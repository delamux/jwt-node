const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../model/user');
const app = express();
const jwt = require('jsonwebtoken');
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


app.post('/login', (req, res) => {
    let body = req.body;

    User.findOne({email: body.email}, (error, userDb) => {
        errorResponse(error, res, 500);
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
            user: userDb
        }, process.env.TOKEN_SEED , { expiresIn: process.env.TOKEN_EXPIRE });

        res.json({
            ok: true,
            user: userDb,
            token
        })
    });
});
// Google Login
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    return {
        name: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }

    // If request specified a G Suite domain:
    //const domain = payload['hd'];
}
app.post('/google', async (req, res) => {
    let token = req.body.idtoken;
    let googleUser = await verify(token)
       .catch(e => {
          return res.status(403).json({
              ok: false,
              err: e
          })
       });

    User.findOne({email: googleUser.email}, (error, userDb) => {
        errorResponse(error, res, 500);
        if ( userDb ) {
            if (userDb.google === false) {
                return res.status(400).json({
                    ok: false,
                    error: {
                        message: 'Debe usar su autenticacion normal'
                    }
                });
            } else {
                let token = jwt.sign({
                    user: userDb
                }, process.env.TOKEN_SEED, {
                    expiresIn: process.env.TOKEN_EXPIRE
                });

                return res.json({
                    ok: true,
                    user: userDb,
                    token
                });

            }
        } else {
            //Create user
            let user = new User();
            user.name = googleUser.name;
            user.email = googleUser.email;
            user.img = googleUser.img;
            user.google = true;
            user.password = ':)';
            user.save((error, userDb) => {
                errorResponse(error, res, 500);
                let token = jwt.sign({
                    user: userDb
                }, process.env.TOKEN_SEED, {
                    expiresIn: process.env.TOKEN_EXPIRE
                });

                return res.json({
                    ok: true,
                    user: userDb,
                    token
                });
            });
        }
    });
});
/**
 *
 * @param error
 * @param res
 * @param code
 * @returns {*|Promise<any>}
 */
const errorResponse = (error, res, code) => {
    if (error) {
        return res.status(code).json({
            ok: false,
            error
        });
    }
};

module.exports = app;
