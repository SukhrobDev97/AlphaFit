import express from 'express';
const routerAdmin = express.Router();
import restaurantController from './controllers/restaurant.controller';

routerAdmin.get('/', restaurantController.goHome);

routerAdmin.get('/login', restaurantController.getLogin)

routerAdmin.get('/signup', restaurantController.getSignup)

export default routerAdmin