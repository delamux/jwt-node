require('./config/config');
const express = require('express');
const mongoose = require('mongoose');
const colors = require('colors');
const app = express();
const bodyParser = require('body-parser');
// create application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({ extended: false }));
// create application/json parser
app.use(bodyParser.json());

// Rutas de la App
app.use(require('./routes/index'));

mongoose.connect(
    'mongodb://localhost:27017/cafe',
    {useNewUrlParser: true, useCreateIndex: true},
    (err) => {
        if (err) throw err;
        console.log('Base de datos ' + 'Online'.green)
    }
);

app.listen(process.env.PORT, () => {
    let port = (process.env.PORT).toString().yellow;
    console.log(`El servidor está corriendo en el puerto ${ port }`)
});
