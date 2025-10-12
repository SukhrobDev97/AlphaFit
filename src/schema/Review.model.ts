// src/schema/Review.model.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IReview extends Document {
  orderId: mongoose.Types.ObjectId;
  orderItemId: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  memberId: mongoose.Types.ObjectId;
  memberNick: string;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true },
    orderItemId: { type: Schema.Types.ObjectId, ref: "OrderItem", required: true },
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    memberId: { type: Schema.Types.ObjectId, ref: "Member", required: true },
    memberNick: { type: String, required: true },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IReview>("Review", reviewSchema);
