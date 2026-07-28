"use client"
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'
import { IoMdArrowRoundBack } from 'react-icons/io'

export default function AdminNav() {
    const router = useRouter()
    return (
        <nav className='flex justify-around items-center gap-5 '>
            <button onClick={()=>{
                router.back()
            }} className='flex items-center gap-3 py-2 px-6 hover:bg-gray-500 rounded-md bg-gray-400 transition-all duration-300 ease-in hover:text-white'><IoMdArrowRoundBack size={32} /> Back
            </button>
            <ul className='flex items-center gap-5'>
                <Link href={"/admin/order"} className='text-white bg-blue-500  p-2 px-6 rounded-md'>Orders</Link>
                <Link href={"/admin/add"} className='text-white bg-green-500  p-2 px-6 rounded-md'>Add Product</Link>
                <button onClick={() => signOut()} className='text-white bg-red-500 p-2 px-6 rounded-md'>Logout</button>
            </ul>
        </nav>
    )
}
