import React, { useEffect, useState } from 'react'
import {Congratulation} from "../Components/ModalContent/Congratulation"
interface CongratulationPageProps {}

export const CongratulationPage: React.FC<CongratulationPageProps> = ({}) => {

	return (
	<>
  <div className="mt-6 flex items-center justify-center" >
    <Congratulation />
    </div>
  </>
	)
}
