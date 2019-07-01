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

process.env.URLDB = process.env.URLDB || 'mongodb://localhost:27017/cafe';

