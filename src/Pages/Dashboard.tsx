import React, { useEffect, useState } from 'react'
import {Dashboard} from "../Components/ModalContent/Dashboard"

interface DashboardPageProps {}

export const DashboardPage: React.FC<DashboardPageProps> = ({}) => {

	return (
	<>
  <div className="mt-6 flex items-center flex-col justify-center" >
    <Dashboard />
    </div>
  </>
	)
}
