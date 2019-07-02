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

// Google client id
process.env.GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '368025316974-an7fg9r7bbded6uvv24bij44414cfdfj.apps.googleusercontent.com';
