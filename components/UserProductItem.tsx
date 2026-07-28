"use client"
import { IProduct } from '@/app/admin/page'
import { ProductType, useCartStore } from '@/store/useCartStore'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function UserProductItem({product}:{product:IProduct}) {
    const {addToCart} = useCartStore()
    const HandlerAddToCart = ()=>{
        const item: ProductType = {
            _id:product._id,
            image:product.image,
            price:product.price,
            title:product.title,
            quantity:1
        }
        addToCart(item)
    }
  return (
    <div className='shadow p-3 rounded-md bg-white space-y-2'>
        <h1 className='text-lg font-bold'>{product.title}</h1>
        <Link href={`/products/${product._id}`}>
        <div className='w-full h-[250] relative'>
            <Image
            src={product.image}
            alt={product.title}
            fill
            loading='eager'
            sizes='100'
            />
        </div>
        </Link>
        <div className='flex justify-between items-center gap-2'>
            <p><span className='font-bold text-gray-500'>Category: </span>{product.category}</p>
            <p><span className='font-bold text-gray-500'>Price: </span>{product.price}tk</p>
        </div>
        <div className='flex justify-between items-center gap-2'>
            <button onClick={HandlerAddToCart} className='py-2 px-5 rounded-md bg-orange-500 hover:bg-orange-600 text-white transition-all duration-200 ease-in-out'>Add Cart</button>
            <button className='py-2 px-5 rounded-md bg-blue-500 hover:bg-blue-600 text-white transition-all duration-200 ease-in-out'>Order</button>
        </div>
    </div>
  )
}
