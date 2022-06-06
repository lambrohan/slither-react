import React, { useEffect, useState } from 'react'
import {Dashboard} from "../Components/ModalContent/Dashboard"
import SlitherImage from "../assets/images/SlitherImage.svg"

interface DashboardPageProps {}

export const DashboardPage: React.FC<DashboardPageProps> = ({}) => {

	return (
	<>
  <div className="mt-6 flex items-center flex-col justify-center" >
    {/* <img className="mx-auto mb-1" src={SlitherImage} alt="SlitherImage"/> */}
    <Dashboard />
    </div>
  </>
	)
}
