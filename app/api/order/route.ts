import dbConnect from "@/config/db";
import orderModel from "@/models/Order";
import productModel from "@/models/Product";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const OrderData = await req.json()
        const {fullName,phoneNumber,address} = OrderData.customer_info;
        const {items} = OrderData;
        if(!fullName || !phoneNumber || !address){
            return NextResponse.json({ ok: false, message: "Name,phone,address required" }, { status: 404 })
        }
        if(items.length === 0){
            return NextResponse.json({ ok: false, message: "Product items required" }, { status: 404 })
        }
        console.log(OrderData)
        await dbConnect();

        const products = await Promise.all(items.map(async(d:any)=>{
            const prod = await productModel.findById(d._id).lean()
            if(!prod) return;
            return {prod,quantity:d.quantity};
        }))
        const totalPrice = products.reduce((total,add)=> add.prod.price * add.quantity + total,0);
        const deliveryCharge = items.reduce((total:number,add:any)=> add.quantity === 1? 0: (add.quantity - 1) * 30,0) + 120;
        const totalAmount = totalPrice + deliveryCharge;
        const FindedItems = products.map(d=>{
            const product = d.prod._id;
            const quantity = d.quantity;
            return {product,quantity}
        })
        console.log(totalPrice)
        console.log(deliveryCharge)
        console.log(totalAmount)
        console.log(FindedItems)

        const orderRequest = await orderModel.create({
            customer_info:OrderData.customer_info,
            items: FindedItems,
            amount:{
                itemsPrice: totalPrice,
                deliveryCharge,
                totalAmount
            }
        })
        return NextResponse.json({ ok: true,orderRequest })

    } catch (error: any) {
        return NextResponse.json({ ok: false, message: error.message }, { status: 500 })
    }
}

export async function GET(req:NextRequest) {
    try {
        await dbConnect();
        const find = await orderModel.find().populate("items.product");
        return NextResponse.json({ ok: true,orders:find })
    } catch (error:any) {
        return NextResponse.json({ ok: false, message: error.message }, { status: 500 })
    }
}