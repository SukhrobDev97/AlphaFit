// order.controller.ts
import { T } from "../libs/types/common";
import { Response } from "express";
import Errors, { HttpCode } from "../libs/Errors";
import { ExtentedRequest } from "../libs/types/member";
import OrderService from "../models/Order.service";
import { OrderStatus } from "../libs/enums/order.enum";
import { OrderInquiry } from "../libs/types/order";

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

export default orderController;
