import AdminNav from '@/components/AdminNav'
import React from 'react'

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className=''>
      <AdminNav />
      {children}
    </div>
  )
}
