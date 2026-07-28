import cloudinary from "@/config/cloudinary";
import dbConnect from "@/config/db";
import productModel from "@/models/Product";
import mongo from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        try {
            await dbConnect();
        } catch (error: any) {
            await dbConnect()
        }
        const id = (await params).id;
        if (!mongo.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ ok: false, message: "Product is not valid" }, { status: 400 });
        }
        const deleteProduct = await productModel.findOneAndDelete({ _id: id });
        if (!deleteProduct) {
            return NextResponse.json({ ok: false, message: "Product Not found!" }, { status: 400 });
        }

        // image delete;
        const imageDelete = await cloudinary.uploader.destroy(deleteProduct.image_id);
        if (imageDelete.result !== "ok") {
            return NextResponse.json({ ok: false, message: "Product deleted but image not delete!" }, { status: 404 });
        }
        return NextResponse.json({ ok: true })
    } catch (error: any) {
        return NextResponse.json({ ok: false, message: error.message }, { status: 500 })

    }
}

// one data fetch
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        try {
            await dbConnect();
        } catch (error: any) {
            await dbConnect()
        }
        const id = (await params).id;
        if (!mongo.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ ok: false, message: "Product is not valid" }, { status: 400 });
        }
        const findProduct = await productModel.findOne({_id:id}).lean()
        return NextResponse.json({ ok: true ,product:findProduct})
    } catch (error: any) {
        return NextResponse.json({ ok: false, message: error.message }, { status: 500 })

    }
}