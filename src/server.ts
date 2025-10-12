import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import app from './app';

 mongoose.connect(process.env.MONGO_URL as string, {})
    .then((data) => {
        console.log('MONGODB connected successfully');
        const PORT = process.env.PORT ?? 3001;
        app.listen(PORT, function () {
            console.info(`The server is running on port: ${PORT}`);
            console.info(`Admin project on http://localhost:${PORT}/admin \n`)
        })
    })
    .catch((err) => {
        console.log("Error on connection MongoDB ", err)

    })