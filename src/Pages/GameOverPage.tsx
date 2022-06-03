import React, { useEffect, useState } from 'react'
import {GameOver} from "../Components/ModalContent/GameOver"
interface GameOverPageProps {}

export const GameOverPage: React.FC<GameOverPageProps> = ({}) => {

	return (
	<>
  <div className="mt-6 flex items-center justify-center" >
    <GameOver />
    </div>
  </>
	)
}
