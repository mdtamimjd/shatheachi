"use client"
import { useCartStore } from '@/store/useCartStore'
import { TDistricts, TDivisions } from '@/types/typeFile'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { RiCloseLargeLine } from 'react-icons/ri'


export default function page() {
    const [divisions, setDivisions] = useState<TDivisions[]>([])
    const [districts, setDistricts] = useState<TDistricts[]>([])
    const [upazilas, setUpazilas] = useState<TDivisions[]>([])
    const [unions, setUnions] = useState<TDivisions[]>([])
    const [fullname, setFullname] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [selectedDivision, setSelectedDivision] = useState('')
    const [selectedDistrict, setSelectedDistrict] = useState('')
    const [selectUpazila, setSelectUpazila] = useState('')
    const [selectUnion, setSelectUnion] = useState('')
    const [address, setAddress] = useState("")
    const [message, setMessage] = useState("")
    const [loding, setLoding] = useState<boolean>(false);

    useEffect(() => {
        if (!selectedDivision) return;

        const getDid = divisions.find((d) => d.name === selectedDivision)
        if (!getDid) return;

        const r = async () => {
            const req = await fetch("api/districts", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ divisions_id: getDid.id })
            });
            const res = await req.json()
            if (res.success) setDistricts(res.data);
        }
        r()
    }, [selectedDivision, divisions])

    useEffect(() => {
        if (!selectedDistrict) return;

        const getDid = districts.find((d) => d.name === selectedDistrict)
        if (!getDid) return;

        const r = async () => {
            const req = await fetch("api/upazilas", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ district_id: getDid.id })
            });
            const res = await req.json()
            if (res.success) setUpazilas(res.data);
        }
        r()
    }, [selectedDistrict, districts])

    useEffect(() => {
        if (!selectUpazila) return;

        const getDid = upazilas.find((d) => d.name === selectUpazila)
        if (!getDid) return;

        const r = async () => {
            const req = await fetch("api/unions", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ upazila_id: getDid.id })
            });
            const res = await req.json()
            if (res.success) setUnions(res.data);
        }
        r()
    }, [selectUpazila, upazilas])

    const { products, removeFromCart, updateQuantity, getTotalPrice,clearCart } = useCartStore();
    useEffect(() => {
        const r = async () => {
            const req = await fetch("api/divisions");
            const res = await req.json()
            console.log(res)
            if (res.success) setDivisions(res.data);
        }
        r()
    }, [])
    const totalQuantity = products.reduce((total: number, item) => total + item.quantity, 0);
    const dalivaryCharge = totalQuantity === 1 ? 120 : (totalQuantity - 1) * 30 + 120; 
    const totalPrice = dalivaryCharge + getTotalPrice();


    const handlerOrderSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setMessage("")
        setLoding(true)

        const selectAddress = {division:selectedDivision,district: selectedDistrict, upazila: selectUpazila, union: selectUnion}
        if (!fullname || !phoneNumber || !address) {
            setMessage("Name,Number and address required!")
            setLoding(false)
            return;
        }
        try {
            const items = products.map((item) => {
                return { _id: item._id, quantity: item.quantity }
            })
            const OrderData = {
                customer_info: {
                    fullName:fullname,
                    phoneNumber,
                    address,
                    selectAddress,
                },
                items
            }
            const ok = confirm("Are you suro! Confirm order.")
            if (!ok) {
                setMessage("Please Order Confirm 'ok' press.")
                setLoding(false)
                return;
            }

            const req = await fetch("/api/order",{
                method:"POST",
                body:JSON.stringify(OrderData)
            })
            const res = await req.json()
            if(!res.ok){
                setMessage(res.message)
                return;
            }
            clearCart()
            alert("Order Done. We contract you.")
        } catch (error: any) {
            setMessage(error.message)
        } finally {
            setLoding(false)
        }

    }
    return (
        <div className='xl:max-w-7xl w-full mx-auto relative'>
            {
                products.length > 0
                    ?
                    <div className='grid md:grid-cols-2 gap-5'>
                        <section className='w-full '>
                            {
                                products.map((item, i: number) => {
                                    return (
                                        <div key={i} className='h-[150] w-full grid grid-cols-4 my-2 gap-2 bg-slate-300 p-3 rounded-md'>
                                            <div className='relative w-full h-full col-span-1'>
                                                <Image
                                                    src={item.image}
                                                    alt={item.title}
                                                    fill
                                                    sizes='100'
                                                    loading='eager'
                                                />
                                            </div>
                                            <div className='col-span-2 flex flex-col justify-between'>
                                                <h3 className='text-lg'>{item.title}</h3>
                                                <p>{item.price}tk * {item.quantity} = {item.price * item.quantity}tk</p>
                                                <div className='space-x-2'>
                                                    <button onClick={() => {
                                                        const quantity = item.quantity + 1;
                                                        updateQuantity(item._id, quantity)
                                                    }} className='font-bold text-3xl py-0.5 px-2 rounded-md bg-gray-50'>+</button>
                                                    <span className='text-2xl'>{item.quantity}</span>
                                                    <button onClick={() => {
                                                        const quantity = item.quantity - 1;
                                                        updateQuantity(item._id, quantity)
                                                    }} className='font-bold text-3xl py-0.5 px-2 rounded-md bg-gray-50'>-</button>
                                                </div>
                                            </div>
                                            <div className='flex justify-center items-center'>
                                                <button onClick={() => removeFromCart(item._id)} className='p-3 rounded-md hover:bg-red-500 hover:text-white transition-all duration-75'><RiCloseLargeLine /></button>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </section>
                        <section>
                            <form onSubmit={handlerOrderSubmit} className='flex flex-col gap-3'>
                                <label htmlFor="fullname"><span className='text-red-500'>*</span>Full Name:</label>
                                <input
                                    type="text"
                                    placeholder='Enter full name...'
                                    name='fullname'
                                    value={fullname}
                                    onChange={(e) => setFullname(e.target.value)}
                                    className='p-2 rounded-md outline focus:outline-green-500'
                                />
                                <label htmlFor="Phone Number"><span className='text-red-500'>*</span>Phone Number:</label>
                                <input
                                    type="text"
                                    placeholder='Enter phone number...'
                                    name='number'
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    className='p-2 rounded-md outline focus:outline-green-500'
                                />
                                <div className='flex justify-between items-center gap-5'>
                                    <div>
                                        <label htmlFor="divisions">Divisions:</label>
                                        <select
                                            className="outline py-2 rounded-md ml-2"
                                            name="divisions"
                                            id=""
                                            value={selectedDivision}
                                            onChange={(e) => setSelectedDivision(e.target.value)}
                                        >
                                            <option value="">Select Divisions</option>
                                            {
                                                divisions.map((d: TDivisions) => <option key={d.id} value={d.name}>{d.name}</option>)
                                            }
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="districts">Districts:</label>
                                        {
                                            selectedDivision ?
                                                <select
                                                    className="outline py-2 rounded-md ml-2"
                                                    name="districts"
                                                    id=""
                                                    value={selectedDistrict}
                                                    onChange={(e) => setSelectedDistrict(e.target.value)}
                                                >
                                                    <option value="">Select Districts</option>
                                                    {
                                                        districts.map((d: TDistricts) => <option key={d.id} value={d.name}>{d.name}</option>)
                                                    }
                                                </select>
                                                : ""
                                        }
                                    </div>
                                </div>

                                <div className='flex justify-between items-center gap-5'>
                                    <div>
                                        <label htmlFor="upazilas">Upazilas:</label>
                                        {
                                            selectedDistrict ?
                                                <select
                                                    className="outline py-2 rounded-md ml-2"
                                                    name="upazilas"
                                                    id=""
                                                    value={selectUpazila}
                                                    onChange={(e) => setSelectUpazila(e.target.value)}
                                                >
                                                    <option value="">Select Upazilas</option>
                                                    {
                                                        upazilas.map((d: TDivisions) => <option key={d.id} value={d.name}>{d.name}</option>)
                                                    }
                                                </select>
                                                : ""
                                        }
                                    </div>
                                    <div>
                                        <label htmlFor="unions">Unions:</label>
                                        {
                                            selectUpazila ?
                                                <select
                                                    className="outline py-2 rounded-md ml-2"
                                                    name="unions"
                                                    id=""
                                                    value={selectUnion}
                                                    onChange={(e) => setSelectUnion(e.target.value)}
                                                >
                                                    <option value="">Select Union</option>
                                                    {
                                                        unions.map((d: TDivisions) => <option key={d.id} value={d.name}>{d.name}</option>)
                                                    }
                                                </select>
                                                : ""
                                        }
                                    </div>
                                </div>
                                <label htmlFor="address"><span className='text-red-500'>*</span>Manual Delivary full Address:</label>
                                <textarea onChange={(e) => setAddress(e.target.value)} value={address} name="address" placeholder='Enter full address' id="" className='p-2 rounded-md outline focus:outline-green-500 resize-none'></textarea>
                                <div>
                                    <p>Products Price: <strong className='text-green-500'>{getTotalPrice()} tk</strong></p>
                                    <p>Dalivary charge: <strong className='text-orange-500'>{dalivaryCharge} tk</strong></p>
                                    <p>Total Price = <strong className="text-blue-500">{totalPrice} tk</strong></p>
                                </div>
                                <p className='text-red-500'>{message}</p>
                                <button type='submit' className='text-white bg-blue-500 rounded-md py-2 cursor-pointer hover:bg-blue-600 transition-all duration-75'>{loding?"...":"Confirm to Order"}</button>
                            </form>
                        </section>
                    </div>
                    :
                    <p className='text-2xl text-red-500'>Not yet cart</p>
            }
        </div>
    )
}
