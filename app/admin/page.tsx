
import AdminProductItem from '@/components/adminProductItem';
import React from 'react'
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
export default async function page() {
  const req = await fetch(`${process.env.API_URL}/api/product`);
  const res = await req.json()
  const data = res.products;
  return (
    <div>
      <section className='w-full p-5 gap-5 xl:max-w-7xl mx-auto flex flex-col'>
                {
          data.length > 0 
          ?
            data.map((p:IProduct,i:number)=> <AdminProductItem product={p} key={i} />)
          :
          <p>Write now product not available</p>
        }
      </section>
    </div>
  )
}
