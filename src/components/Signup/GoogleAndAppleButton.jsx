import React from 'react'
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa6";

const GoogleAndAppleButton = ({ type , text }) => {
    return (
        <button className='flex justify-start items-center border p-2 rounded-sm'>
           
            {
                type == 'google' ?  <FcGoogle className='w-[18px] h-[18px]' /> : <FaApple className='w-[18px] h-[18px]' />

            }
            <p className='text-sm justify-self-center w-[100%] text-gray-dark mx-2 mb-1'>{text}</p>
        </button>
    )
}

export default GoogleAndAppleButton