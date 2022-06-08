import React, { useEffect, useState } from 'react'
import {EnterGame} from "../Components/ModalContent/EnterGame"
import SlitherImage from "../assets/images/SlitherImage.svg"

interface EnterGamePageProps {}

export const EnterGamePage: React.FC<EnterGamePageProps> = ({}) => {

	return (
	<>
  <div className="mt-6 flex items-center flex-col justify-center" >
  <img className="mx-auto mb-1" src={SlitherImage} alt="SlitherImage"/>
    <EnterGame />
    </div>
  </>
	)
}
