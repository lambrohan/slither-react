import React from "react"
import DogeSnake from "../assets/images/dogeSnake.svg"
import Telegram from "../assets/images/telegram.svg"
import Twitter from "../assets/images/twitter.svg"
import Reddit from "../assets/images/reddit.svg"
import Discord from "../assets/images/discord.svg"
import Instagram from "../assets/images/instagram.svg"
import Facebook from "../assets/images/facebook.svg"
import "./FollowUs.scss"
interface FollowUsProps {}

export const FollowUs: React.FC<FollowUsProps> = ({}) => {
    return (
        <>
            <div className="flex flex-col items-center justify-center follow-us-page">
              <p className="font-bold text-4xl text-white mb-6">FOLLOW US.</p>
              <img src={DogeSnake} alt="DogeSnake" />
              <div className="flex flex-row items-end justify-center">
                <div className="flex flex-col mx-6 items-center justify-center">
                  <img src={Telegram} alt="Telegram" />
                </div>
                <div className="flex flex-col mx-6 items-center justify-center">
                  <img src={Twitter} alt="Twitter" />
                </div>
                <div className="flex flex-col mx-6 items-center justify-center">
                  <img src={Reddit} alt="Reddit" />
                </div>
                <div className="flex flex-col mx-6 items-center justify-center">
                  <img src={Discord} alt="Discord" />
                </div>
                <div className="flex flex-col mx-6 items-center justify-center">
                  <img src={Instagram} alt="Instagram" />
                </div>
                <div className="flex flex-col mx-6 items-center justify-center">
                  <img src={Facebook} alt="Facebook" />
                </div>
              </div>
            </div>
        </>
    );
};
