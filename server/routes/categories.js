const express = require('express');
const { verifyToken, verifyAdmin } = require('../middlewares/authentication');
const app = express();
const Category = require('../model/category');

/**
 * Show all categories
 */
app.get('/categories', (req, res) => {

});

/**
 * Show a category
 */
app.get('category/:id', (req, res) => {
    Category.findByid();
});

/**
 * Create category
 */
app.post('/category', verifyToken, (req, res) => {
    let body = req.body;
    let category = new Category({
        name: body.name,
        description: body.description,
        user_id: req.user._id
    });

    category.save((error, categoryDB) => {
        errorResponse(error, res, 500);
        if (!categoryDB) {
            errorResponse(error, res, 400);
        }
        res.json({
            ok: true,
            category: categoryDB
        })
    })
});

/**
 * Update category
 */
app.put('/category/:id', verifyToken, (req, res) => {
    let id = req.params.id;
    Category.findByIdAndUpdate(
        id,
        req.body,
        {new: true, runValidators: true},
        (error, categoryUpdated) => {
            errorResponse(error, res, 400);
            res.json({
                ok: true,
                category: categoryUpdated
            })
    })
});

/**
 * Delete category
 */
app.delete('/category/:id', [verifyToken, verifyAdmin], (req, res) => {
    let id = req.params.id;
    Category.findByIdAndRemove(
        id,
        {new: true, runValidators: true},
        (error, categoryDeleted) => {
            errorResponse(error, res, 400);
            res.json({
                ok: true,
                category: categoryDeleted
            })
        })
});

/**
 *
 * @param error
 * @param res response
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
