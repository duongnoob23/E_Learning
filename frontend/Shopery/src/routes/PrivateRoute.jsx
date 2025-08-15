// Private Route Component - Bảo vệ route cần authentication
import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const PrivateRoute = ({ 
  children, 
  requiredRole = null,
  requiredPermissions = [],
  fallbackPath = '/login' 
}) => {
  const { isAuthenticated, isLoading, user, isAdmin, isClient, hasPermission } = useAuth()
  const location = useLocation()

  // Đang loading
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Đang xác thực...</p>
      </div>
    )
  }

  // Chưa đăng nhập
  if (!isAuthenticated) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />
  }

  // Kiểm tra role nếu được yêu cầu
  if (requiredRole) {
    let hasRequiredRole = false
    
    switch (requiredRole) {
      case 'admin':
        hasRequiredRole = isAdmin()
        break
      case 'client':
        hasRequiredRole = isClient()
        break
      default:
        hasRequiredRole = user?.role === requiredRole
    }

    if (!hasRequiredRole) {
      return <Navigate to="/unauthorized" replace />
    }
  }

  // Kiểm tra permissions nếu được yêu cầu
  if (requiredPermissions.length > 0) {
    const hasAllPermissions = requiredPermissions.every(permission => 
      hasPermission(permission)
    )

    if (!hasAllPermissions) {
      return <Navigate to="/unauthorized" replace />
    }
  }

  return children
}

export default PrivateRoute
