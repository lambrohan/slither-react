import React, { useState } from "react"
import "./ModalContent.scss"
import BorderLine from "../../assets/images/borderLine.png"
import Copy from "../../assets/images/copy.svg"
import ProfileImage from "../../assets/images/profileImage.svg"
import {StarSvg} from "../../assets/Star"
import {PieChartDraw} from "../PieChart/PieChart"

interface DashboardProps {}

export const Dashboard: React.FC<DashboardProps> = ({}) => {
    const [dashboardData, setDashboardData] = useState(true);
    return (
        <>
            <div className="">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                    <div className="blur-background lg:w-[412px] rounded-3xl py-3 px-3">
                        <h2 className="font-bold text-lg text-white uppercase">
                            Token Balance
                        </h2>
                        <img src={BorderLine} alt="BorderLine" />
                        <div className="flex items-center justify-center flex-col py-5">
                            <p className="text-4xl mb-[20px] font-bold text-[#FFCE01]">
                                $ 133,42
                            </p>
                            <div>
                                <button className="text-white text-xs font-medium uppercase py-2.5 px-5 rounded-full bg-[#46125D]">
                                    + Add Funds
                                </button>
                                <button className="border--white  text-white text-xs font-medium uppercase py-2 px-5 rounded-full">
                                    Remove Funds
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="blur-background lg:w-[412px] rounded-3xl py-3 px-3">
                        <h2 className="font-bold text-lg text-white uppercase">
                            Game Balance
                        </h2>
                        <img src={BorderLine} alt="BorderLine" />
                        <div className="flex items-center flex-col justify-center py-5">
                            <p className="text-4xl mb-[20px] font-bold text-[#FFCE01]">
                                $ 133,42
                            </p>
                            <div>
                                <button className="text-white text-xs font-medium uppercase py-2.5 px-5 rounded-full bg-[#46125D]">
                                    + Add Funds
                                </button>
                                <button className="border--white  text-white text-xs font-medium uppercase py-2 px-5 rounded-full">
                                    Remove Funds
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="blur-background lg:col-span-2 rounded-3xl py-3 px-3">
                        <h2 className="font-bold text-lg flex justify-between items-center text-white uppercase">
                            Dashboard
                            <span className="font-normal text-[9px] flex cursor-pointer">
                                402mfje82h2… x83
                                <img className="ml-2" src={Copy} alt="" />
                            </span>
                        </h2>
                        <img src={BorderLine} alt="BorderLine" />
                        {/* No data */}
                        {!dashboardData && (
                            <div className="flex items-center justify-center py-5">
                                <p className="text-2xl font-bold text-white">
                                    No Data Yet
                                </p>
                            </div>
                        )}

                        {/* if data */}
                        {dashboardData && (
                            <div className="flex flex-row ">
                                <div className="w-1/2 dash-border-right">
                                    <div className="flex flex-row items-center p-5">
                                        <img
                                            className="h-[56px] mr-2"
                                            src={ProfileImage}
                                            alt="altImage"
                                        />
                                        <p className="text-lg font-bold text-white">
                                            UserA1213
                                        </p>
                                    </div>
                                    <div className="h-[180px]">
                                        <PieChartDraw/>
                                    </div>
                                </div>
                                <div className="w-1/4 dash-border-right p-6 flex flex-col">
                                    <div className="flex flex-row items-center justify-between mb-10">
                                         <div>
                                            <p className="font-bold text-xs text-[#FFCE01]">
                                                Win
                                            </p>
                                            <span className="font-bold text-[21px] text-white">
                                                14
                                            </span>
                                        </div>
                                        <div>
                                            <p className="font-bold text-xs text-[#FFCE01]">
                                                Lose
                                            </p>
                                            <span className="font-bold text-[21px] text-white">
                                                14
                                            </span>
                                        </div>
                                        <div>
                                            <p className="font-bold text-xs text-[#FFCE01]">
                                                Walkover
                                            </p>
                                            <span className="font-bold text-[21px] text-white">
                                                14
                                            </span>
                                        </div>
                                    </div>
                                    <div className="mb-2">
                                        <p className="font-bold text-xs text-[#FFCE01]">
                                            Best Career High
                                        </p>
                                        <span className="font-bold text-[21px] text-white">
                                            14
                                        </span>
                                    </div>
                                    <div className="mb-2">
                                        <p className="font-bold text-xs text-[#FFCE01]">
                                            Earnings
                                        </p>
                                        <span className="font-bold text-[21px] text-white">
                                            $248,23
                                        </span>
                                    </div>
                                    <div className="mb-2">
                                        <p className="font-bold text-xs text-[#FFCE01]">
                                            Losses
                                        </p>
                                        <span className="font-bold text-[21px] text-white">
                                            $248,23
                                        </span>
                                    </div>
                                </div>
                                <div className="w-1/4">
                                    <div className="dash-border-bottom h-1/2 flex flex-col items-center justify-center">
                                        <span className="uppercase text-white text-sm font-medium">Rank</span>
                                        <span className="uppercase text-white text-[73px] font-bold leading-[50px]">24</span>

                                    </div>
                                    <div className="h-1/2 items-center justify-center py-[18px] px-[24px]">
                                        <div className="flex flex-row items-center justify-between h-100">
                                            <span className='text-white text-xs mb-2 font-bold'>Fire Room</span>
                                            <span className="flex flex-row"><StarSvg repeat={2}/></span>
                                        </div>
                                        <div className="flex flex-row items-center justify-between h-100">
                                            <span className='text-white text-xs mb-2 font-bold'>Fire Room</span>
                                            <span className="flex flex-row"><StarSvg repeat={3}/></span>
                                        </div>
                                        <div className="flex flex-row items-center justify-between h-100">
                                            <span className='text-white text-xs mb-2 font-bold'>Fire Room</span>
                                            <span className="flex flex-row"><StarSvg repeat={1}/></span>
                                        </div>
                                        <div className="flex flex-row items-center justify-between h-100">
                                            <span className='text-white text-xs mb-2 font-bold'>Fire Room</span>
                                            <span className="flex flex-row"><StarSvg repeat={2}/></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};
