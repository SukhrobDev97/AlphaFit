import { HttpCode, Message } from "../libs/Errors";
import ProductModel from "../schema/Product.model";
import Errors from "../libs/Errors";
import { ProductInput } from "../libs/types/product";
import { Product } from "../libs/types/product";

class ProductService {
    private readonly productModel;
    constructor(){
        this.productModel = ProductModel
    }

    /* SPA */

    /* BSSR */

    public async createNewProduct(input:ProductInput):Promise<Product>{
        try {
            return await this.productModel.create(input)
        } catch (err) {
            console.error('Error,model- createNewProduct:', err)
            throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED)
        }
    }
}

export default ProductService