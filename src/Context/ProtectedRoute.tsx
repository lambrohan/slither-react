import { Navigate, Outlet } from 'react-router-dom'
import React from 'react'

interface ProtectedRouteProps extends React.PropsWithChildren<any> {
	isAllowed: boolean
	redirectPath?: string
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
	isAllowed,
	redirectPath = '/',
	children,
}) => {
	if (!isAllowed) {
		return <Navigate to={redirectPath} replace />
	}
	return children ? children : <Outlet />
}
