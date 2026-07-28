import AdminProductItem from "@/components/adminProductItem";
import dbConnect from "@/config/db";
import productModel from "@/models/Product";
export interface IProduct {
  _id: string;
  title: string;
  details: string;
  price: number;
  category: string;
  image: string;
  image_id: string;
  createdAt: string; // Or Date, if you parse timestamps into Date objects
  updatedAt: string; // Or Date
  __v: number;
}

export default async function Page() {
  await dbConnect();

  const data = await productModel.find().lean();

  return (
    <section className="w-full p-5 gap-5 xl:max-w-7xl mx-auto flex flex-col">
      {data.length > 0 ? (
        data.map((p: IProduct) => (
          <AdminProductItem
            key={p._id.toString()}
            product={JSON.parse(JSON.stringify(p))}
          />
        ))
      ) : (
        <p>Right now product not available</p>
      )}
    </section>
  );
}