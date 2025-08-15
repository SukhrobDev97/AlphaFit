import dotenv from 'dotenv';
dotenv.config();
console.log('PORT', process.env.PORT);
console.log('URL:', process.env.MONGO_URL)