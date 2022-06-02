import React from "react";
import borderLine from "../../assets/images/borderLine.png";
import Ice from "../../assets/images/Ice.png";
import Fire from "../../assets/images/Fire.png";
import "./ModalContent.scss"
import LeftSolid from "../../assets/images/leftSolid.svg"
import RightSolid from "../../assets/images/rightSolid.svg"

interface EnterGameProps {}

export const EnterGame: React.FC<EnterGameProps> = ({}) => {
    return (
        <>
            <div className="w-100">
                <p className="text-white font-medium my-5 text-center">
                    ENTER THE GAME
                </p>

                <img src={borderLine} alt="border-line" />

                <div className="flex justify-around items-center  my-4">
                    <img className="h-[32px] cursor-pointer" src={LeftSolid} alt="LeftSolid"/>
                    <img
                        src={Ice}
                        alt=""
                        className="hoverGameImage mr-4 hover:outline-offset-4"
                    />
                    <img src={Fire} alt="" className="hoverGameImage hover:outline-offset-4" />
                    <img className=" h-[32px] cursor-pointer" src={RightSolid} />
                </div>

                <img  src={borderLine} alt="border-line" />

                <div className="flex flex-col mx-7">
                    <p className="text-white font-bold mt-[22px] mb-[12px]">
                        YOUR AMOUNT
                    </p>
                    <div className="relative h-[57px]">
                        <button
                            id="dropdownDefault"
                            data-dropdown-toggle="dropdown"
                            className="text-black h-full absolute z-30 bg-white font-medium rounded-lg text-sm px-8 py-2.5 text-center inline-flex items-center"
                            type="button"
                        >
                            USD{" "}
                            <svg
                                className="w-4 h-4 ml-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M19 9l-7 7-7-7"
                                ></path>
                            </svg>
                        </button>
                        <input
                            type="text"
                            className="indent-32 absolute z-10 text-white font-bold text-2xl h-full w-full backdrop-blur-md p-2 bg-black/50 rounded-lg focus:outline-none"
                        />
                        <button className="absolute z-30  right-[6px] top-[10px] text-white bg-[#46125D] text-[8px] py-2.5 px-10 rounded-full ">
                            SAVE
                        </button>
                    </div>
                </div>

                <div className="flex flex-col justify-start mt-4 mx-7">
                    <p className="text-white font-medium">USERNAME</p>
                    <input
                        type="number"
                        placeholder="GUSOBRAL"
                        className="indent-6 h-[57px] w-full backdrop-blur-md p-2 bg-black/50 text-white font-bold text-2xl rounded-lg focus:outline-none"
                    />
                </div>
                <div className="flex justify-center my-6">
                    <button className="bg-white rounded-full px-[54px] py-[13px] font-bold">
                        PLAY NOW
                    </button>
                </div>
            </div>
        </>
    );
};
