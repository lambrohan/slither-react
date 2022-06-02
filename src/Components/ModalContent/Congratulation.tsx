import React from 'react'
import BabyDoge from "../../assets/images/babydoge.svg";
import BackgroundFilter from "../../assets/images/background-filter.svg"
import Coin from "../../assets/images/coin.svg"
import Increase from "../../assets/images/increase.svg"
import "./ModalContent.scss"
interface CongratulationProps {}

export const Congratulation: React.FC<CongratulationProps> = ({}) => {
	return (
		<>
			<div className="w-100 px-6 md:px-10 lg:px-[200px]">
        <h1 className="text-3xl lg:text-5xl font-bold text-white">Congratulations!</h1>
        <div className="relative min-h-[400px] flex items-center justify-center">
          <p className="absolute top-[20px] text-[17px] text-white font-bold">No one can stop you!</p>
          <img className="absolute" src={BackgroundFilter} alt="babydoge" />
          <img className="absolute" src={BabyDoge} alt="babydoge-backdrop" />
        </div>
        <div className='flex flex-row justify-between'>
          <div className=''>
            <p className='text-xs font-bold text-white text-center ml-8'>You Won</p>
            <div className='flex flex-row'>
              <div className='flex items-center justify-center'><img className='mr-[9px]' src={Coin} alt="Coin" /></div>
              <div><p className='text-[49px] font-bold text-white flex items-center justify-center'>567</p></div>
            </div>
          </div>
          <div className='flex flex-col'>
            <p className='text-xs font-bold text-white text-center '>Rank</p>
            <div>
              <p className="text-[49px] font-bold text-white flex items-center justify-center">22<sup className="text-xs"><img src={Increase} alt="increase"/></sup></p>
            </div>
          </div>

          
        </div>
        <div className='h-[34px] relative '> 
            <button className='next-btn absolute right-[-10px] lg:right-[-150px] text-white font-bold rounded-full border-white'>Next</button>
          </div>
      </div>
		</>
	)
}