import express from 'express';
const routerAdmin = express.Router();
import storeController from './controllers/store.controller';
import productController from './controllers/product.controller';
import makeUploader from './libs/utils/uploader';



// STORE
routerAdmin.get('/', storeController.goHome);

routerAdmin
.get('/login', storeController.getLogin)
.post('/login', storeController.processLogin);

routerAdmin
.get('/signup', storeController.getSignup)
.post('/signup',makeUploader("members").single("memberImage"), storeController.processSignup)
.post('/signup', storeController.processSignup);

routerAdmin.get("/logout", storeController.logout);
routerAdmin.get("/check-me", storeController.checkAuthSession);

// product

routerAdmin.get("/product/all", 
    storeController.verifyStore,
    productController.getAllProducts);
routerAdmin.post("/product/create", 
    storeController.verifyStore,
    makeUploader("products").array("productImages", 2),
    productController.createNewProduct);
routerAdmin.post("/product/:id",storeController.verifyStore, productController.updateNewProduct);
routerAdmin.get('/user/all', storeController.verifyRestaurant, storeController.getUsers)


routerAdmin.post(
    "/user/edit",
    storeController.verifyStore,
    storeController.updateChosenUser
)

export default routerAdmin