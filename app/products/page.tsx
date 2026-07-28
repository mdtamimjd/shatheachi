import React from 'react'
import { IProduct } from '../admin/page';
import UserProductItem from '@/components/UserProductItem';

export default async function page() {
    const req = await fetch(`${process.env.API_URL}/api/product`,{
        next: {revalidate: 60}
    });
    const res = await req.json()
    if(!res.ok){
        return (
            <div>
                <h1>Products not found. Server Error.</h1>
            </div>
        )
    }
    const products = res.products;
  return (
    <div className='bg-slate-300 py-20'>
        {
            products.length > 0 
                      ?
                        <section className='grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 p-5 gap-5 xl:max-w-7xl mx-auto'>
                            {
                                products.map((p:IProduct,i:number)=> <UserProductItem product={p} key={i} />)
                            }
                        </section>
                      :
                      <p>Write now product not available</p>
        }
    </div>
  )
}
