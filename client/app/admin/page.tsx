import AdminSidebar from '@/components/admin/Sidebar';
import AdminOnly from '@/components/Auth/AdminOnly';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import React from 'react'

const page = () => {
  return (
    <>
      <AdminOnly>

        <AdminSidebar />

      </AdminOnly>

    </>
  )
}

export default page