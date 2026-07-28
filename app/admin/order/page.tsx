import OrderItem from '@/components/OrderItem';
import React from 'react'
interface TItems {
    product: any;
    quantity: number;
}
export interface TOrder {
    customer_info: {
        fullName: string;
        phoneNumber: string;
        address: string;
        selectAddress: {
            division?: string;
            district?: string;
            upazila?: string;
            union?: string;
        }
    },
    items: TItems[],
    amount: {
        itemsPrice: number,
        deliveryCharge: number,
        totalAmount: number,
    },
    status: string,
    createdAt: string,
    updatedAt: string,
    _id: string,
    __v?: number
}

export default async function page() {
    const req = await fetch(`${process.env.API_URL}/api/order`);
    const res = await req.json()
    if (!res.ok) {
        return <div className='text-center text-2xl text-red-500'>Something is wrong! api</div>
    }
    const data = res.orders;
    return (
        <div className='p-5 space-y-3 xl:max-w-7xl mx-auto'>
            <section className='space-y-5'>
                {
                    data.map((d: TOrder, i: number) => <OrderItem key={i} data={d} />)
                }
            </section>
        </div>
    )
}
