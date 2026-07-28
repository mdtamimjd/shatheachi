"use client"
import { IProduct } from '@/app/admin/page'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'
import { FaEdit } from 'react-icons/fa'
import { FaDeleteLeft } from 'react-icons/fa6'

export default function AdminProductItem({ product }: { product: IProduct }) {
    const router = useRouter()
    const handlerDelete = async ()=>{
        const req = await fetch(`/api/product/${product._id}`,{
            method:"DELETE"
        })
        const res = await req.json()
        if(res.ok){
            router.refresh()
        }else {
            alert(res.message)
        }
    }
    return (
        <div className='flex justify-between p-5 border rounded-xl hover:shadow-xl hover:shadow-slate-500 hover:scale-y-90 transition-all duration-300 ease-in'>
            <div className='flex flex-col justify-between'>
                <h1 className='text-2xl font-semibold'>{product.title}</h1>
                <p>{product.details}</p>
                <div className='flex items-center gap-5'>
                    <p className='text-slate-500 font-bold py-2 px-5 rounded-md bg-slate-200'>{product.category}</p>
                    <span>||</span>
                    <p>Price: {product.price}$</p>
                </div>
                <div className='flex items-center gap-5'>
                    <span className='flex active:bg-slate-800 select-none items-center gap-2 bg-blue-500 py-2 px-5 rounded-md text-white'><FaEdit />
                        Edit</span>
                    <span onClick={handlerDelete} className='flex active:bg-slate-800 select-none items-center gap-2 bg-red-500 py-2 px-5 rounded-md text-white'><FaDeleteLeft />
                        Delete</span>
                </div>
            </div>
            <div className='w-[500] h-[350] relative'>
                <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    sizes='100'
                    loading='eager'
                />
            </div>
        </div>
    )
}
