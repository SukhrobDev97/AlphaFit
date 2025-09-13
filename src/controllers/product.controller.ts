import { Request, Response } from 'express';
import Errors from '../libs/Errors';
import { T } from "../libs/types/common";
import MemberService from '../models/Member.service';
import ProductService from '../models/Product.service';

const  productService = new ProductService();
const productController: T = {};


productController.getAllProducts = async (req: Request, res: Response) => {
    try {
        console.log("getAllProducts");
        res.render("products")
    }
    catch (err) {
        console.log('Error, getAllProducts', err);
        if(err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standard.code).json(Errors.standard)
    }
}


productController.createNewProduct = async (req: Request, res: Response) => {
    try {
        console.log("createNewProduct") 
    }
    catch (err) {
        console.log('Error, createNewProduct', err);
        if(err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standard.code).json(Errors.standard)
    }
}

productController.updateNewProduct = async (req: Request, res: Response) => {
    try {
        console.log("updateNewProduct") 
    }
    catch (err) {
        console.log('Error, updateNewProduct', err);
        if(err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standard.code).json(Errors.standard)
    }
}



export default productController