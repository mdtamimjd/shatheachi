import cloudinary from "@/config/cloudinary";
import dbConnect from "@/config/db";
import productModel from "@/models/Product";
import { UploadApiResponse } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";

async function ensureDbConnected(retries = 1) {
    try {
        await dbConnect();
    } catch (error: any) {
        if (retries > 0) {
            return ensureDbConnected(retries - 1);
        }
        throw error;
    }
}

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const titleRaw = formData.get("title");
        const detailsRaw = formData.get("details");
        const priceRaw = formData.get("price");
        const categoryRaw = formData.get("category");
        const imageField = formData.get("image");

        const title = typeof titleRaw === "string" ? titleRaw.trim() : "";
        const details = typeof detailsRaw === "string" ? detailsRaw.trim() : "";
        const category = typeof categoryRaw === "string" ? categoryRaw.trim() : "";
        const price = typeof priceRaw === "string" ? Number(priceRaw) : Number(priceRaw);
        const image = imageField instanceof File ? imageField : null;
        if (!title || !details || !category || !image || Number.isNaN(price)) {
            return NextResponse.json({ ok: false, message: "All fields are required" }, { status: 400 });
        }
        await ensureDbConnected();

        const buffer = Buffer.from(await image.arrayBuffer());

        // upload cloudinary image ;
        const upload = await new Promise<UploadApiResponse>((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    folder: "shatheachi"
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result as UploadApiResponse)
                }
            ).end(buffer)
        })
        const productAdd = await productModel.create({ title, details, price, category, image: upload.secure_url, image_id: upload.public_id });
        return NextResponse.json({ ok: true, product: productAdd })
    } catch (error: any) {
        return NextResponse.json({ ok: false, message: error.message }, { status: 500 })
    }
}

// get all products
export async function GET() {
    try {
        await ensureDbConnected();
        const products = await productModel.find().lean();
        return NextResponse.json({ ok: true, products })
    } catch (error: any) {
        return NextResponse.json({ ok: false, message: error.message }, { status: 500 })
    }
}