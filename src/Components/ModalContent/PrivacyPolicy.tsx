import React from "react";

import "./ModalContent.scss";
interface PrivacyPolicyProps {}

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({}) => {
    return (
        <>
                <div className="backdrop-blur-md p-2 bg-black/80  mx-auto rounded-lg ">
                    <img src="images/Image 33.png" className="mx-auto" alt="" />{" "}
                    <br />
                    <p className="mx-auto w-56 font-medium text-lg text-white">
                        Babydoge.io PrivacyPolicy
                    </p>
                    <p className="my-20 text-xs text-center sm:text-base text-white w-[320px] sm:w-[448px]">
                        Sed ut perspiciatis unde omnis iste natus error sit
                        voluptatem accusantium doloremque laudantium, totam rem
                        aperiam, eaque ipsa quae ab illo inventore veritatis et
                        quasi architecto beatae vitae dicta sunt explicabo. Nemo
                        enim ipsam voluptatem quia voluptas sit aspernatur aut
                        odit aut fugit, sed quia consequuntur magni dolores eos
                        qui ratione voluptatem sequi nesciunt. Neque porro
                        quisquam est. A qui dolorem ipsum quia dolor sit amet,
                        consectetur, adipisci velit, sed quia non numquam eius
                        modi tempora incidunt ut labore et dolore magnam aliquam
                        quaerat voluptatem. Ut enim ad minima veniam, quis
                        nostrum exercitationem ullam corporis suscipit
                        laboriosam, nisi ut aliquid ex ea commodi consequatur?
                        Quis autem vel eum iure reprehenderit qui in ea
                        voluptate velit esse quam nihil molestiae consequatur,
                        vel illum qui dolorem eum fugiat quo voluptas nulla
                        pariatur
                    </p>
                    <div className="flex justify-center mb-4">
                        <button className="text-white rounded-full w-16 border-2 border-slate-300 mx-auto">
                            Ok
                        </button>
                    </div>
                </div>
        </>
    );
};
