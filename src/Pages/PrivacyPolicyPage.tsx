import React, { useEffect, useState } from 'react'
import {PrivacyPolicy} from "../Components/ModalContent/PrivacyPolicy"
interface PrivacyPolicyPageProps {}

export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({}) => {

	return (
	<>
  <div className=" py-3 flex items-center justify-center backdrop-blur-lg bg-[#000000d9]" style={{height:"94vh"}}>
    <PrivacyPolicy />
    </div>
  </>
	)
}
