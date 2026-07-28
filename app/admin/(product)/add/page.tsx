"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

export default function page() {
  const [title, setTitle] = useState("")
  const [details, setDetails] = useState("")
  const [price, setPrice] = useState("")
  const [category, setCategory] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const router  = useRouter()
  const handlerSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault()
    setLoading(true)
    setMessage("")

      if (!title || !details || !price || !category || !image) return setMessage("All field is required!");
      const formData = new FormData()
      formData.append("title",title)
      formData.append("details",details)
      formData.append("price",price)
      formData.append("category",category)
      formData.append("image",image)
      
      const req = await fetch("/api/product",{
        method:"POST",
        body:formData,
      })
      const res = await req.json()
      console.log(res)
      if(!res.ok){
        setLoading(false)
        setMessage("API error: "+res.message)
        return;
      }

      router.push("/admin")
  }

  return (
    <div className="bg-slate-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl bg-slate-300 rounded-3xl p-8 shadow-xl shadow-slate-200">
        <h1 className="text-2xl font-semibold text-slate-900 mb-6">Add New Product</h1>
        <form onSubmit={handlerSubmit} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-medium text-slate-700">Product Title</label>
            <input
              id="title"
              type="text"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Product Title ..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:bg-white"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="details" className="block text-sm font-medium text-slate-700">Product Details</label>
            <textarea
              id="details"
              name="details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Product Details ..."
              className="w-full min-h-[140] resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:bg-white"
            />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="price" className="block text-sm font-medium text-slate-700">Price</label>
              <input
                id="price"
                type="text"
                name="price"
                value={price}
                onChange={(e) => {
                  const onlyNumbers = e.target.value.replace(/[^0-9]/g, "");
                  setPrice(onlyNumbers);
                }}
                placeholder="Product Price ..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:bg-white"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="category" className="block text-sm font-medium text-slate-700">Category</label>
              <input
                id="category"
                type="text"
                name="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Category"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:bg-white"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="image" className="block text-sm font-medium text-slate-700">Product Image</label>
            <input
              id="image"
              type="file"
              name="image"
              onChange={(e) => setImage(e.target.files?.[0] ?? null)}
              className="w-full rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-700 transition file:mr-4 file:rounded-full file:border-0 file:bg-slate-200 file:px-4 file:py-2 file:text-slate-900 focus:border-sky-400"
            />
          </div>
          {message && (
            <p className="text-sm font-medium text-red-700">{message}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {loading ? "Adding..." : "Add Product"}
          </button>
        </form>
      </div>
    </div>
  )
}
