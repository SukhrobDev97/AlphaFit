import express from 'express';
const routerAdmin = express.Router();
import restaurantController from './controllers/restaurant.controller';
import productController from './controllers/product.controller';


// RESTAURANT
routerAdmin.get('/', restaurantController.goHome);

routerAdmin
.get('/login', restaurantController.getLogin)
.post('/login', restaurantController.processLogin);

routerAdmin
.get('/signup', restaurantController.getSignup)
.post('/signup', restaurantController.processSignup);

routerAdmin.get("/logout", restaurantController.logout);
routerAdmin.get("/check-me", restaurantController.checkAuthSession);

// product

routerAdmin.get("/product/all", restaurantController.verifyRestaurant,productController.getAllProducts);
routerAdmin.post("/product/create", productController.createNewProduct);
routerAdmin.post("/product/:id", productController.updateNewProduct);


export default routerAdmin