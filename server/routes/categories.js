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

});

/**
 * Update category
 */
app.put('/category/:id', verifyToken, (req, res) => {

});

/**
 * Delete category
 */
app.put('/category/:id', [verifyToken, verifyAdmin], (req, res) => {

});

module.exports = app;
