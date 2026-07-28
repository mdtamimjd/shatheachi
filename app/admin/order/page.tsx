import OrderItem from "@/components/OrderItem";
import dbConnect from "@/config/db";
import orderModel from "@/models/Order";

interface TItems { product: any; quantity: number; }
export interface TOrder { customer_info: { fullName: string; phoneNumber: string; address: string; selectAddress: { division?: string; district?: string; upazila?: string; union?: string; } }, items: TItems[], amount: { itemsPrice: number, deliveryCharge: number, totalAmount: number, }, status: string, createdAt: string, updatedAt: string, _id: string, __v?: number }

export default async function Page() {
    await dbConnect();

    const data = await orderModel
        .find()
        .populate("items.product")
        .lean();

    return (
        <div className="p-5 space-y-3 xl:max-w-7xl mx-auto">
            <section className="space-y-5">
                {data.map((d: any) => (
                    <OrderItem
                        key={d._id.toString()}
                        data={JSON.parse(JSON.stringify(d))}
                    />
                ))}
            </section>
        </div>
    );
}