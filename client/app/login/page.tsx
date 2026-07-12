import LoginPage from '@/components/Auth/Login'
import AuthRoute from '@/components/Auth/AuthRoute'
import React from 'react'

function page() {
  return (
    <AuthRoute>
      <LoginPage />
    </AuthRoute>
  )
}

export default page