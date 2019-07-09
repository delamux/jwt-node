const express = require('express');
const { verifyToken, verifyAdmin } = require('../middlewares/authentication');
const app = express();
const Product = require('../model/product');

/**
 * All products method
 */
app.get('/products', verifyToken, (req, resp) => {

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

module.exports = app;
