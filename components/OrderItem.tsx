import { statusUpdate } from '@/action/statusUpdate';
import { TOrder } from '@/app/admin/order/page'
import { IProduct } from '@/app/admin/page'
import Image from 'next/image'

interface TProductItem {
  product: IProduct;
  quantity: number;
  _id: string;
}
export default function OrderItem({ data }: { data: TOrder }) {
  return (
    <div className='p-2 rounded-md shadow hover:shadow-2xl hover:shadow-green-500 bg-orange-400'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl'>Customer Info:</h1>
        <span>Status: <strong className='bg-yellow-300 p-0.5'>{data.status}</strong></span>
      </div>
      <div>
        <p>Name: <strong>{data.customer_info.fullName}</strong> </p>
        <p>Phone Number: <strong>{data.customer_info.phoneNumber}</strong></p>
        <p>Adress: <strong>{data.customer_info.address}</strong></p>
        <table className='w-full border'>
          <thead className='border'>
            <tr>
              <th className='border bg-blue-300  py-2'>Division</th>
              <th className='border bg-blue-300  py-2'>District</th>
              <th className='border bg-blue-300  py-2'>Upazila</th>
              <th className='border bg-blue-300  py-2'>Union</th>
            </tr>
          </thead>
          <tbody className='border'>
            <tr>
              <td className='border p-1.5 bg-blue-100 hover:bg-blue-200'>{data.customer_info?.selectAddress?.division}</td>
              <td className='border p-1.5 bg-blue-100 hover:bg-blue-200'>{data.customer_info?.selectAddress?.district}</td>
              <td className='border p-1.5 bg-blue-100 hover:bg-blue-200'>{data.customer_info?.selectAddress?.upazila}</td>
              <td className='border p-1.5 bg-blue-100 hover:bg-blue-200'>{data.customer_info?.selectAddress?.union}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="my-3">
        {
          data.items.length === 0 ?
            ""
            :
            data.items.map((v, index) => {
              return <div key={index} className='py-2 flex gap-10 bg-sky-400 border-y'>
                <div className='w-30 h-40 relative'>
                  <Image
                    src={v.product.image}
                    alt={v.product.title}
                    fill
                    loading='eager'
                    sizes='1'
                  />
                </div>
                <div>
                  <h1 className='text-2xl font-semibold'>{v.product.title}</h1>
                  <p>Price: <strong>{v.product.price} tk</strong></p>
                  <p>Quantity: <strong>{v.quantity}</strong></p>
                  <p>Total price: {v.product.price} * {v.quantity} = <strong>{v.product.price * v.quantity} tk</strong></p>
                </div>
              </div>
            })
        }
      </div>
      <div className="flex justify-between items-center gap-5">
        <p className='bg-red-300 p-0.5'>Product Total Price: <strong>{data.amount.itemsPrice}</strong></p>
        <p className='bg-green-300 p-0.5'>Delivery Charge: <strong>{data.amount.deliveryCharge}</strong></p>
        <p className='bg-orange-300 p-0.5'>Total Amount: <strong>{data.amount.totalAmount}</strong></p>
      </div>
      <div className='flex my-3 justify-between items-center gap-5 select-none'>
        <button className='text-white bg-red-500 hover:bg-red-600 py-2 px-6 rounded-md shadow'>Delete</button>
        <form action={statusUpdate} className='border rounded-md'>
          <input type="hidden" name='id' value={data._id.toString() || ""} />
          <select name="status" id="status" className='py-2 w-30 focus:outline-none'>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancel">Cancel</option>
          </select>
          <button type='submit' className='text-white bg-green-500 hover:bg-green-600 py-2 px-6 rounded-r-md shadow'>Save</button>
        </form>
      </div>
    </div>
  )
}
