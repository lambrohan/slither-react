import React, { useEffect, useState } from 'react'
import {GameOver} from "../Components/ModalContent/GameOver"
import SlitherImage from "../assets/images/SlitherImage.svg"

interface GameOverPageProps {}

export const GameOverPage: React.FC<GameOverPageProps> = ({}) => {

	return (
	<>
  <div className="mt-6 flex items-center flex-col justify-center" >
  <img className="mx-auto mb-1" src={SlitherImage} alt="SlitherImage"/>
    <GameOver />
    </div>
  </>
	)
}
