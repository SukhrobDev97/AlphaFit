import mongoose, {Schema} from "mongoose";

const orderItemSchema  = new Schema({
    itemQuantity: {
        type: Number,
        required: true
    },

    itemPrice: {
        type: Number,
        required: true,
    },
    
    orderId: {
        type: Schema.Types.ObjectId,
        ref: "Order"
    },

     
    ProductId: {
        type: Schema.Types.ObjectId,
        ref: "Product"
    },
},
{timestamps: true, collection: "orderItems"}
)

export default mongoose.model("OrderItem", orderItemSchema)
