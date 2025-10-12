// order.controller.ts
import { T } from "../libs/types/common";
import { Response } from "express";
import Errors, { HttpCode } from "../libs/Errors";
import { ExtentedRequest } from "../libs/types/member";
import OrderService from "../models/Order.service";
import { OrderStatus } from "../libs/enums/order.enum";
import { OrderInquiry, OrderItemInput, OrderUpdateInput } from "../libs/types/order";
import { shapeIntoMongooseObjectId } from "../libs/config";

const orderService = new OrderService();

const orderController: T = {};
orderController.createOrder = async (req: ExtentedRequest, res: Response) => {
    try {
        console.log("createOrder");
        const result = await orderService.createOrder(req.member, req.body);

        res.status(HttpCode.CREATED).json(result)
    } catch (err) {
        console.log("Error, createOrder", err);
        if (err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standard.code).json(Errors.standard);
    }
};


orderController.getMyOrders = async (req: ExtentedRequest, res: Response) => {
    try {
        console.log("getMyOrders");
        const {page, limit, order,orderStatus} = req.query;
        const inquiry: OrderInquiry = {
            page: Number(page),
            limit: Number(limit),
            orderStatus: orderStatus as OrderStatus
        };
        const result = await orderService.getMyOrders(req.member,inquiry)

        res.status(HttpCode.CREATED).json(result)
    } catch (err) {
        console.log("Error, getMyOrders", err);
        if (err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standard.code).json(Errors.standard);
    }

    
};


// REVIEW
orderController.createReview = async (req: ExtentedRequest, res: Response) => {
    try {
        const { orderId, orderItemId, productId, text } = req.body;
        const memberId = req.member._id;
        const userName = req.member.memberNick;
        console.log("Member:", req.member);
        console.log("Request body:", req.body);
        const review = await orderService.createReview(
            shapeIntoMongooseObjectId(req.member._id),    // userId
            shapeIntoMongooseObjectId(req.body.orderId), // orderId
            shapeIntoMongooseObjectId(req.body.orderItemId), // orderItemId
            shapeIntoMongooseObjectId(req.body.productId),   // productId
            req.member.memberNick,
            req.body.text
          );
        
    
        res.status(HttpCode.CREATED).json(review);
      } catch (err) {
        console.error("Error createReview:", err);
        if (err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standard.code).json(Errors.standard);
      }
}


// orderItem bo‘yicha review’larni olish
orderController.getReviewsByOrderItem = async (req: ExtentedRequest, res: Response) => {
    try {
      const { orderItemId } = req.params;
      const reviews = await orderService.getReviewsByOrderItem(orderItemId);
      res.status(HttpCode.OK).json(reviews);
    } catch (err) {
      console.error("Error getReviewsByOrderItem:", err);
      if (err instanceof Errors) res.status(err.code).json(err);
      else res.status(Errors.standard.code).json(Errors.standard);
    }
  };

orderController.updateOrder = async (req: ExtentedRequest, res: Response) => {
    try {
        console.log("updateOrder");
        const input: OrderUpdateInput = req.body;
        const result = await orderService.updateOrder(req.member, input)
        res.status(HttpCode.CREATED).json(result)
    } catch (err) {
        console.log("Error, updateOrder", err);
        if (err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standard.code).json(Errors.standard);
    }
};


export default orderController;
