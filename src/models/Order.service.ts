import OrderModel from "../schema/Order.model";
import { Member } from "../libs/types/member";
import { Order, OrderInquiry, OrderItemInput } from "../libs/types/order";
import { shapeIntoMongooseObjectId } from "../libs/config";
import { HttpCode } from "../libs/Errors";
import { Message } from "../libs/Errors";
import Errors from "../libs/Errors";
import {ObjectId} from "mongoose";
import OrderItemModel from "../schema/OrderItem.model";


class OrderService {
    private readonly orderModel;
    private readonly orderItemModel;

    constructor() {
        this.orderModel = OrderModel;
        this.orderItemModel = OrderItemModel;
    }

    public async createOrder(
        member: Member,
        input: OrderItemInput[]
    ): Promise<Order> {
        const memberId = shapeIntoMongooseObjectId(member._id)
        const amount = input.reduce((accumulator: number, item: OrderItemInput) =>{
            return accumulator + item.itemPrice * item.itemQuantity
        },0 )   
        const delivery = amount < 100 ? 5 : 0;   
        
        try{
            const newOrder: Order = await this.orderModel.create({
                orderTotal: amount + delivery,
                orderDelivery : delivery,
                memberId: memberId
            });
            const orderId = newOrder._id
            console.log("orderId:",orderId);
            await this.recordOrderItem(orderId, input)
            return newOrder
        }
        catch(err){
            console.log("Error, model: CreateOrder:", err);
            throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED)
        }
    }

    private async recordOrderItem(
        orderId: ObjectId,
        input: OrderItemInput[]
    ): Promise<void> {
        const promisedList = input.map(async (item: OrderItemInput) => {
            item.orderId = orderId;
            item.productId = shapeIntoMongooseObjectId(item.productId);
            await this.orderItemModel.create(item);
            return "INSERTED";
        });
    
        console.log("promisedList:", promisedList);
        const orderItemsState = await Promise.all(promisedList);
        console.log("orderItemsState:", orderItemsState);
    }

    public async getMyOrders(
        member: Member,
        inquiry: OrderInquiry
    ): Promise<Order[]> {
        const memberId = shapeIntoMongooseObjectId(member._id);
        const matches = { memberId: memberId, orderStatus: inquiry.orderStatus };
    
        const result = await this.orderModel
            .aggregate([
                { $match: matches },
                { $sort: { updateAt: -1 } },
                { $skip: (inquiry.page - 1) * inquiry.limit },
                { $limit: inquiry.limit },
                {
                    $lookup: {
                        from: "orderItems",
                        localField: "_id",
                        foreignField: "orderId",
                        as: "orderItems",
                    },
                },
                {
                    $lookup: {
                        from: "products",
                        localField: "orderItems.productId",
                        foreignField: "_id",
                        as: "productId",
                    },
                }
            ])
            .exec();
    
        if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
    
        return result;
    }
    

}


export default OrderService;

