//Puerto
process.env.PORT = process.env.PORT || 3000;
// Enviroment
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

/**
 * Token config
 *  -seconds, minutes, hours, days
 *
 */
process.env.TOKEN_EXPIRE = 60 * 60 * 24 * 30;

process.env.TOKEN_SEED = process.env.TOKEN_SEED  || 'developer-seed';

// Data base
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb+srv://delamux:eYTq53mw1u2K1LvD@delamux-apps-6ede0.mongodb.net/cafe';
}

process.env.URLDB = urlDB;

