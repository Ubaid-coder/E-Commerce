import AdminSidebar from '@/components/admin/Sidebar';
import AdminOnly from '@/components/Auth/AdminOnly';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import React from 'react'
import AdminDashboardPage from '@/components/admin/Dashboard';

const page = () => {
  return (
    <>
      <AdminOnly>

        <AdminSidebar />
        <AdminDashboardPage />

      </AdminOnly>

    </>
  )
}

export default page