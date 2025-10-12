import { Request, Response } from 'express';
import Errors, { HttpCode, Message } from '../libs/Errors';
import { T } from "../libs/types/common";
import MemberService from '../models/Member.service';
import ProductService from '../models/Product.service';
import { ProductInput, ProductInquiry } from '../libs/types/product';
import { AdminRequest, ExtentedRequest } from '../libs/types/member';
import { ProductCollection } from '../libs/enums/product.enum';

const  productService = new ProductService();
const productController: T = {};



// SPA

productController.getProducts = async (req: Request, res: Response) => {
    try {
        console.log("getProducts");
        const {page, limit, order, productCollection,search} = req.query;
        const inquiry: ProductInquiry = {
            order: String(order),
            page: Number(page),
            limit: Number(limit)
        };
        if(productCollection) {inquiry.productCollection = productCollection as ProductCollection};
        if(search) inquiry.search = String(search);
        
        const result = await productService.getProducts(inquiry);
        
        res.status(HttpCode.OK).json({result})
    }
    catch (err) {
        console.log('Error, getProducts', err);
        if(err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standard.code).json(Errors.standard)
    }
}

productController.getProduct = async (req: ExtentedRequest, res: Response) => {
    try {
        console.log("getProduct");
        const {id} = req.params;
        const memberId = req.member?._id ?? null;
        const result = await productService.getProduct(memberId, id)
        res.status(HttpCode.OK).json({result})
    }
    catch (err) {
        console.log('Error, getProduct', err);
        if(err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standard.code).json(Errors.standard)
    }
}


//BSSR

productController.getAllProducts = async (req: Request, res: Response) => {
    try {
        console.log("getAllProducts");
        const data = await productService.getAllProducts();

        res.render("products", {products: data})
    }
    catch (err) {
        console.log('Error, getAllProducts', err);
        if(err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standard.code).json(Errors.standard)
    }
}


productController.createNewProduct = async (req: AdminRequest, res: Response) => {
    try {
        console.log("createNewProduct");
      if(!req.files?.length)
        throw new Errors(HttpCode.INTERNAL_SERVICE_ERROR,Message.CREATE_FAILED)

      const data : ProductInput = req.body;
      data.productImages = req.files?.map((ele) =>{
        return ele.path.replace(/\\/g,"/")
      })
      await productService.createNewProduct(data)
      res.send(`<script>alert("Created successfully");window.location.replace("/admin/product/all")</script>`)
    }
    catch (err) {
        console.log('Error, createNewProduct', err);
        const message = err instanceof Errors ? err.message: Message.SOMETHING_WENT_WRONG;
        res.send(`<script>alert('${message}');window.location.replace("/admin/product/all")</script>`)

    }
}




productController.updateChosenProduct = async (req: Request, res: Response) => {
    try {
        console.log("updateChosenProduct");
        const id = req.params.id;
        console.log(id)

        const result = await productService.updateChosenProduct(id,req.body);
        res.status(HttpCode.OK).json({data: result})
    }
    catch (err) {
        console.log('Error, updateNewProduct', err);
        if(err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standard.code).json(Errors.standard)
    }
}



export default productController