import React, { useEffect, useState } from 'react'
import {Congratulation} from "../Components/ModalContent/Congratulation"
import SlitherImage from "../assets/images/SlitherImage.svg"

interface CongratulationPageProps {}

export const CongratulationPage: React.FC<CongratulationPageProps> = ({}) => {

	return (
	<>
  <div className=" lg:h-full my-6 flex items-center flex-col justify-center overflow-y-auto" >
    <img className="mx-auto mb-1" src={SlitherImage} alt="SlitherImage"/>
    <Congratulation />
    </div>
  </>
	)
}
