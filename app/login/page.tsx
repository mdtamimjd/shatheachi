"use client"

import React, { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (res?.error) {
        setError("Invalid email or password.")
      } else {
        // Successful login — redirect to dashboard or home
        router.push('/admin') 
        router.refresh()
      }
    } catch (err) {
      setError("An unexpected error occurred.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='place-content-center place-items-center h-[calc(100vh-100px)]'>
      <form 
        onSubmit={handleSubmit}
        className='flex flex-col min-w-[300] sm:w-9/12 md:w-1/2 lg:w-[500] shadow-2xl shadow-slate-500 p-5 bg-slate-300 rounded-md gap-3'
      >
        <h1 className='text-2xl font-bold md:text-4xl text-center'>Admin Login</h1>

        {error && (
          <div className='p-2 bg-red-100 border border-red-400 text-red-700 text-sm rounded text-center'>
            {error}
          </div>
        )}

        <label htmlFor="email"><span className='text-red-500'>* </span>Enter Admin Email:</label>
        <input 
          required 
          type="email" 
          id="email"
          name='email' 
          placeholder='Enter only admin email...' 
          className='outline p-2 rounded-md text-lg focus:outline-green-500' 
        />

        <label htmlFor="password"><span className='text-red-500'>* </span>Enter Admin Password:</label>
        <input 
          required 
          type="password" 
          id="password"
          name='password' 
          placeholder='Enter only admin password...' 
          className='outline p-2 rounded-md text-lg focus:outline-green-500' 
        />

        <input 
          type="submit" 
          disabled={loading}
          value={loading ? "Logging in..." : "Login"} 
          className='p-2 rounded-md text-lg bg-green-500 text-white hover:bg-green-400 cursor-pointer disabled:bg-gray-400' 
        />
      </form>
    </div>
  )
}