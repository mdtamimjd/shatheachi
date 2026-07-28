import OrderItem from "@/components/OrderItem";
import dbConnect from "@/config/db";
import orderModel from "@/models/Order";

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