const express = require('express');
const { verifyToken, verifyAdmin } = require('../middlewares/authentication');
const app = express();
const Product = require('../model/product').Product;

/**
 * All products method
 */
app.get('/products', verifyToken, (req, resp) => {
    let from = Number(req.query.from) || 0;
    let limit = Number(req.query.limit) || 5;
    let orderBy = req.query.orderBy || 'name';

    Product.find()
        .sort(orderBy)
        .skip(from)
        .limit(limit)
        .populate('user', 'name email')
        .populate('category', 'name email')
        .exec((error, products) => {
            if (error) {
                return res.status(400).json({
                    ok: false,
                    error
                });
            }
            Category.countDocuments((error, count) => {
                res.json({
                    ok: true,
                    products,
                    total_categories: count
                })
            });
        });
});

/**
 * Get product by Id
 */
app.get('/product/:id', verifyToken, (req, resp) => {

});

/**
 * Update product by Id
 */
app.put('/product/:id', verifyToken, (req, resp) => {

});

/**
 * Add a new product
 */
app.post('/products', verifyToken, (req, resp) => {

});

/**
 * Delete product by Id
 */
app.delete('/product/:id', verifyToken, (req, resp) => {

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
