import { model, models, Schema } from "mongoose";

const productSchmea = new Schema({
    title:String,
    details:String,
    price:Number,
    category:String,
    image:String,
    image_id:String
},{
    timestamps:true
})
const productModel = models?.products || model("products",productSchmea);
export default productModel;