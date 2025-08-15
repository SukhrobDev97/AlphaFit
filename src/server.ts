import dotenv from 'dotenv';
dotenv.config();
console.log('PORT', process.env.PORT);
console.log('URL:', process.env.MONGO_URL)


import mongoose from 'mongoose';

mongoose.connect(process.env.MONGO_URL as string, {})
    .then((data) => {
        console.log('MONGODB connected successfully');
        const PORT = process.env.PORT ?? 3001;
    })
    .catch((err) => {
        console.log("Error on connection MongoDB ", err)
    })