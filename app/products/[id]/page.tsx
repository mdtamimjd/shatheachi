import React from "react";
import Image from "next/image";

export default async function page({ params }: { params: Promise<{ id: string }> }) {
    const id = (await params).id;
    const req = await fetch(`${process.env.API_URL}/api/product/${id}`);
    const res = await req.json()
    if (!res.ok) {
        return (
            <div>
                <h1>Product not found!</h1>
            </div>
        )
    }
    const product = res.product;
    return (
        <div className="grid gap-5 sm:grid-cols-2 p-5 xl:w-7xl mx-auto mt-10 border rounded-md">
            <div className='w-full h-[250] relative'>
                <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    loading='eager'
                    sizes='100'
                />
            </div>
            <div className="border-l pl-2">
                <h1 className="text-2xl font-bold">{product.title}</h1>
                <pre>{product.details}</pre>
                <div className='flex justify-between items-center gap-2'>
                    <p><span className='font-bold text-gray-500'>Category: </span>{product.category}</p>
                    <p><span className='font-bold text-gray-500'>Price: </span>{product.price}tk</p>
                </div>
            </div>
        </div>
    )
}
