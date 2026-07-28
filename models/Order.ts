import mongoose, { model, Schema } from "mongoose";
import { models } from "mongoose";

const orderSchema = new Schema({
    customer_info: {
        fullName: {
            type: String,
            required: true,
            maxlength: [30, "Max length 30"],
            trim:true,
        },
        phoneNumber: {
            type: String,
            required: true,
            maxlength: [15, "Max length 15"],
            minlenght: [10, "Min length 10"],
            trim:true,
        },
        address: {
            type: String,
            required: true,
            trim:true,
        },
        selectAddress: {
            division: String,
            district: String,
            upazila: String,
            union: String,
        }
    },
    items:[
        {
            product: {
                type: Schema.Types.ObjectId,
                ref: "products",
                required:true
            },
            quantity:{
                type:Number,
                required:true,
            }
        }
    ],
    amount:{
        itemsPrice:Number,
        deliveryCharge:Number,
        totalAmount:Number,
    },
    status:{
        type:String,
        enum:["pending","processing","shipped","delivered","cancel"],
        default:"pending"
    }
},{timestamps:true})

const orderModel = models?.Orders || model("Orders",orderSchema);
export default orderModel;