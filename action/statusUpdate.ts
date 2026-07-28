"use server"

import dbConnect from "@/config/db";
import orderModel from "@/models/Order";
import { revalidatePath } from "next/cache";

export async function statusUpdate(formData: FormData) {
  try {
    const id = formData.get("id") as string;
    const status = formData.get("status") as string;
    await dbConnect()
    const order = await orderModel.findOne({ _id: id });
    if (!order) {
      throw new Error("Order not found");
    }
    order.status = status;
    await order.save();
    revalidatePath("/admin/order")
  } catch (error: any) {
    console.error("Status update error:", error.message);
  }
}