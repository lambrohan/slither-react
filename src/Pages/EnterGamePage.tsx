import React, { useEffect, useState } from 'react'
import {EnterGame} from "../Components/ModalContent/EnterGame"
interface EnterGamePageProps {}

export const EnterGamePage: React.FC<EnterGamePageProps> = ({}) => {

	return (
	<>
  <div className="mt-6 flex items-center justify-center" >
    <EnterGame />
    </div>
  </>
	)
}
