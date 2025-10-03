import mongoose, { Schema } from "mongoose";
import { OrderStatus } from "../libs/enums/order.enum";


const orderSchema = new Schema(
  {
    orderUser: {
      type: Schema.Types.ObjectId,
      ref: "Member",
      required: true,
    },
    orderTotalPrice: {
      type: Number,
      required: true,
    },
    orderStatus: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.PENDING,
    },
    orderNote: {
      type: String,
    },
  },
  { timestamps: true }
);

export const OrderModel = mongoose.model("Order", orderSchema);
