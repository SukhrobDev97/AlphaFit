import { ProductCollection, ProductSize, ProductStatus } from "../enums/product.enum";
import {ObjectId} from 'mongoose';


export interface Product{
    _id: ObjectId;
    productStatus:ProductStatus;
    productCollection: ProductCollection;
    productName: string;
    productPrice: number;
    productLeftCount: number;
    productSize:ProductSize;
    productVolume: number;
    productDesc?: string;
    productImages:string[];
    productViews:number;

}

export interface ProductInput{
    productStatus?:ProductStatus;
    productCollection: ProductCollection;
    productName: string;
    productPrice: number;
    productLeftCount: number;
    productSize?:ProductSize;
    productVolume?: number;
    productDesc?: string;
    productImages?:string[];
    productViews?:number;

}


export interface ProductUpdateInput{
    _id: ObjectId;
    productStatus?:ProductStatus;
    productCollection?: ProductCollection;
    productName?: string;
    productPrice?: number;
    productLeftCount?: number;
    productSize?:ProductSize;
    productVolume?: number;
    productDesc?: string;
    productImages?:string[];
    productViews?:number;

};
