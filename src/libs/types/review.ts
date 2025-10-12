// review.ts (types)
import { ObjectId } from "mongoose";

export interface Review {
  _id: ObjectId;
  orderId: ObjectId;
  orderItemId: ObjectId;
  productId: ObjectId;
  memberId: ObjectId;
  memberNick: string;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}
