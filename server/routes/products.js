const express = require('express');
const { verifyToken, verifyAdmin } = require('../middlewares/authentication');
const app = express();
const Product = require('../model/product');
/**
 * All products method
 */
app.get('/products', verifyToken, (req, res) => {
    const from = Number(req.query.from) || 0;
    const limit = Number(req.query.limit) || 5;
    const orderBy = req.query.orderBy || 'name';

    Product.find()
        .sort(orderBy)
        .skip(from)
        .limit(limit)
        .populate('user', 'name email')
        .populate('category', 'name')
        .exec((error, products) => {
            errorResponse(error, res, 400);
            Product.countDocuments((error, count) => {
                res.json({
                    ok: true,
                    products,
                    total_products: count
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
app.post('/product', verifyToken, (req, res) => {
    const body = req.body;
    const product = new Product({
        name: body.name,
        description: body.description,
        unitPrice: body.unitPrice,
        available: body.available,
        category: body.category,
        user: req.user._id
    });
    product.save((error, productDB) => {
        errorResponse(error, res, 500);
        if (!productDB) {
            errorResponse(error, res, 400);
        }
        res.json({
            ok: true,
            product: productDB
        })
    })
});

/**
 * Delete product by Id
 */
app.delete('/product/:id', [verifyToken, verifyAdmin], (req, resp) => {

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
