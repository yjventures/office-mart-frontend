import React from 'react'
import { BsTruck } from "react-icons/bs";
import { CiBank } from "react-icons/ci";
import { CiTimer } from "react-icons/ci";
import { IoIosCard } from "react-icons/io";

const BottomAdvertisement = () => {

    const Box = ({ title, desc, icon }) => {
        return (
            <div className='flex items-center justify-center'>
                {
                    title === 'Fast Delivery' ? <BsTruck className='text-[40px] ' /> :
                        title === 'Money Guarantee' ? <CiBank className='text-[40px] ' /> :
                            title === '365 Days' ? <CiTimer className='text-[40px] ' /> :
                                title === 'Payment' ? <IoIosCard className='text-[40px] ' /> :
                                    <BsTruck className='text-[40px] ' />
                }
                <div className='flex justify-start flex-col items-start gap-1 ms-3'>
                    <div className='text-sm font-semibold text-center'>{title}</div>
                    <div className='text-xs text-center'>{desc}</div>

                </div>
            </div>
        )
    }
    return (
        <div className='flex justify-around items-center gap-10 my-20 flex-col md:flex-row '>
            <Box title='Fast Delivery' desc='Start from $10' />
            <Box title='Money Guarantee' desc='7 Days Back ' />
            <Box title='365 Days' desc='For free return' />
            <Box title='Payment' desc='Cash on delivery' />
        </div>
    )
}

export default BottomAdvertisement