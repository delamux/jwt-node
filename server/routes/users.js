const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const User = require('../model/user');
const { verifyToken, verifyAdmin } = require('../middlewares/authentication');
const app = express();

app.get('/users', verifyToken, function (req, res) {
    let from = Number(req.query.from) || 0;
    let limit = Number(req.query.limit) || 5;

    User.find({status: true})
        .skip(from)
        .limit(limit)
        .exec((error, users) => {
            if (error) {
                return res.status(400).json({
                    ok: false,
                    error
                });
            }
            User.countDocuments({status: true}, (error, count) => {
                res.json({
                    ok: true,
                    users,
                    total_users: count
                })
            });
    });
});
app.post('/user', [verifyToken, verifyAdmin], function (req, res) {
    let body = req.body;
    let user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    user.save((error, userDB) => {
        if (error) {
            return res.status(400).json({
                ok: false,
                error
            });
        }

        res.json({
            ok: true,
            user: userDB
        });
    });
});
app.put('/user/:id', [verifyToken, verifyAdmin], function (req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['name', 'email', 'img', 'role', 'status']);

    User.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (error, userDB) => {
        if (error) {
            return res.status(400).json({
                ok: false,
                error
            });
        }
        res.json({
            ok: true,
            user: userDB
        });
    });

});
app.delete('/user/:id', [verifyToken, verifyAdmin], function (req, res) {
    let id = req.params.id;
    //User.findByIdAndRemove(id, (error, deleteUSer) => {
    User.findByIdAndUpdate(id, {status: false}, {new: true}, (error, deleteUSer) => {
        if (error) {
            return res.status(400).json({
                ok: false,
                error
            });
        }

        res.json({
            ok: true,
            user: deleteUSer
        })
    })

});

module.exports = app;
