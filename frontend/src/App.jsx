import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Landing from './pages/Landing'
import Login from './pages/Login'
import StudentDashboard from './pages/StudentDashboard'
import AdminDashboard from './pages/AdminDashboard'

function PrivateRoute({ children, adminOnly = false }) {
  const { user, token } = useAuth()
  if (!token) return <Navigate to="/login" />
  if (adminOnly && user?.role !== 'admin') return <Navigate to="/student" />
  return children
}

function AppRoutes() {
  const { token, user } = useAuth()
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={
        token
          ? <Navigate to={user?.role === 'admin' ? '/admin' : '/student'} />
          : <Login />
      } />
      <Route path="/student" element={
        <PrivateRoute>
          <StudentDashboard />
        </PrivateRoute>
      } />
      <Route path="/admin" element={
        <PrivateRoute adminOnly>
          <AdminDashboard />
        </PrivateRoute>
      } />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}