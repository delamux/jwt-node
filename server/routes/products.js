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
 * Search Product
 */
app.get('/products/search/:term', (req, res) => {
    const term = new RegExp(req.params.term, 'i');

    Product.find({name: term})
        .populate('category', 'name')
        .exec((error, products) => {
            errorResponse(error, res, 500);
            res.json({
                ok: true,
                products
            })

        })
});
/**
 * Get product by Id
 */
app.get('/product/:id', verifyToken, (req, res) => {
    const id = req.params.id;
    Product.findById(id)
        .populate('category', 'name')
        .populate('user', 'name email')
        .exec((error, product) => {
        errorResponse(error, res, 500);
        if (!product) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: `The id: ${id} is not valid`
                }
            });
        }

        return res.json({
            ok: true,
            product
        })
    })
});

/**
 * Update product by Id
 */
app.put('/product/:id', verifyToken, (req, res) => {
    const id = req.params.id;
    Product.findByIdAndUpdate(id,
        req.body,
        {new: true, runValidators: true},
        (error, productUpdated) => {
            errorResponse(error, res, 400);
            res.json({
                ok: true,
                product: productUpdated
            })
        })
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
app.delete('/product/:id', [verifyToken, verifyAdmin], (req, res) => {
    const id = req.params.id;
    Product.findOneAndRemove(id, (error, product) => {
        errorResponse(error, res, 500);
        if (!product) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: `The id: ${id} is invalid`
                }
            });
        }
        res.json({
            ok: true,
            product
        })
    });
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
