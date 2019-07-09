const express = require('express');
const { verifyToken, verifyAdmin } = require('../middlewares/authentication');
const app = express();
const Category = require('../model/category').Category;

/**
 * Show all categories
 */
app.get('/categories', verifyToken, (req, res) => {
    let from = Number(req.query.from) || 0;
    let limit = Number(req.query.limit) || 5;
    let orderBy = req.query.orderBy || 'name';

    Category.find()
        .sort(orderBy)
        .skip(from)
        .limit(limit)
        .populate('user', 'name email')
        .exec((error, categories) => {
            if (error) {
                return res.status(400).json({
                    ok: false,
                    error
                });
            }
            Category.countDocuments((error, count) => {
                res.json({
                    ok: true,
                    categories,
                    total_categories: count
                })
            });
        });
});

/**
 * Show a category
 */
app.get('/category/:id', verifyToken, (req, res) => {
    let id = req.params.id;

    Category.findById(id, (error, categoryDB) => {
        errorResponse(error, res, 500);
        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: `el id: ${id} no es válido.`
                }
            });
        }
        res.json({
            ok: true,
            category: categoryDB
        })
    });
});

/**
 * Create category
 */
app.post('/category', verifyToken, (req, res) => {
    let body = req.body;
    let category = new Category({
        name: body.name,
        description: body.description,
        user: req.user._id
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
    Category.findOneAndRemove(id, (error, categoryDeleted) => {
            errorResponse(error, res, 500);
            if (!categoryDeleted) {
                return res.status(400).json({
                    ok: false,
                    error: {
                        message: `el id: ${id} no es válido.`
                    }
                });
            }
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
