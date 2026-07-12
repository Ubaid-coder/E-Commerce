import ProtectedRoute from '@/components/Auth/ProtectedRoute'
import RegisterPage from '@/components/Auth/Register'


function page() {
  return (
    <>
      <ProtectedRoute>
        <RegisterPage />
      </ProtectedRoute>
    </>
  )
}

export default page