import React, { useState } from 'react'
import { IoMdArrowDropup } from "react-icons/io";
import Circle1 from 'assets/vendor/circle1.svg'
import Shipped from 'assets/vendor/shipped.svg'
import Delivered from 'assets/vendor/delivered.svg'
import Cancel from 'assets/vendor/cancel.svg'
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';

const VendorReports = () => {
    const { t, i18n } = useTranslation()
    const currentLanguage = i18n.language;
    const user = JSON.parse(localStorage.getItem('user'))
    const [totalCard1, setTotalCard1] = useState(0);
    const [totalCard2, setTotalCard2] = useState(0);
    const [totalCard3, setTotalCard3] = useState(0);
    const [totalCard4, setTotalCard4] = useState(0);

    const { isPending: card1Pending, isError: card1IsError, error: card1Error, data: card1Data } = useQuery({
        queryKey: ['card1'],
        queryFn: async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_PATH}/order-items/get-all?shop_id=${user?.vendor_info?.shop?._id}&status=processing`, {
                    headers: {
                        Authorization: `Bearer ${JSON.parse(localStorage.getItem('token')).accessToken}`
                    }
                });

                const jsonData = await response.json();
                setTotalCard1(Math.ceil(jsonData?.total))
                return jsonData?.product;
            } catch (error) {
                // console.log(error.response.data.message)
                console.error(`Error fetching data`);
            }
        },
        refetchInterval: 10000,
    });




    const { isPending: card2Pending, isError: card2IsError, error: card2Error, data: card2Data } = useQuery({
        queryKey: ['card2'],
        queryFn: async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_PATH}/order-items/get-all?shop_id=${user?.vendor_info?.shop?._id}&status=shipped`, {
                    headers: {
                        Authorization: `Bearer ${JSON.parse(localStorage.getItem('token')).accessToken}`
                    }
                });

                const jsonData = await response.json();
                setTotalCard2(Math.ceil(jsonData?.total))
                return jsonData?.product;
            } catch (error) {
                // console.log(error.response.data.message)
                console.error(`Error fetching data`);
            }
        },
        refetchInterval: 10000,
    });

    const { isPending: card3Pending, isError: card3IsError, error: card3Error, data: card3Data } = useQuery({
        queryKey: ['card3'],
        queryFn: async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_PATH}/order-items/get-all?shop_id=${user?.vendor_info?.shop?._id}&status=delivered`, {
                    headers: {
                        Authorization: `Bearer ${JSON.parse(localStorage.getItem('token')).accessToken}`
                    }
                });

                const jsonData = await response.json();
                setTotalCard3(Math.ceil(jsonData?.total))
                return jsonData?.product;
            } catch (error) {
                // console.log(error.response.data.message)
                console.error(`Error fetching data`);
            }
        },
        refetchInterval: 10000,
    });

    const { isPending: card4Pending, isError: card4IsError, error: card4Error, data: card4Data } = useQuery({
        queryKey: ['card4'],
        queryFn: async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_PATH}/order-items/get-all?shop_id=${user?.vendor_info?.shop?._id}&canceled=true`, {
                    headers: {
                        Authorization: `Bearer ${JSON.parse(localStorage.getItem('token')).accessToken}`
                    }
                });

                const jsonData = await response.json();
                setTotalCard4(Math.ceil(jsonData?.total))
                return jsonData?.product;
            } catch (error) {
                // console.log(error.response.data.message)
                console.error(`Error fetching data`);
            }
        },
        refetchInterval: 10000,
    });

    return (
        <div className='grid sm:grid-cols-2 md:grid-cols-4 gap-2'>
            <div className='border-2 border-[#eeeff2] rounded-md relative p-4'>
                <p className='text-gray-dark font-[12px]'>
                    {t('orders.processing')}
                </p>
                <p className='font-[600] my-2 text-[22px]'>
                    {totalCard1} items
                </p>
                {/* <div className='flex gap-2 text-[12px]'>
                    <p className='text-tertiary-600 font-[700] flex items-center'>
                        10%
                        <IoMdArrowDropup />
                    </p>
                    <p className='font-[600] text-gray-500'>
                        +120 {t('orders.today')}
                    </p>
                </div> */}
                <img src={Circle1} alt="icon" className={`absolute top-2  ${currentLanguage == 'ar' ? 'left-3' : 'right-3'}`} />
            </div>
            <div className='border-2 border-[#eeeff2] rounded-[5px] relative p-4'>
                <p className='text-gray-dark font-[12px]'>
                    {t('orders.shiped')}
                </p>
                <p className='font-[600] my-2 text-[22px]'>
                    {totalCard2} items
                </p>
                {/* <div className='flex gap-2 text-[12px]'>
                    <p className='text-tertiary-600 font-[700] flex items-center'>
                        10%
                        <IoMdArrowDropup />
                    </p>
                    <p className='font-[600] text-gray-500'>
                        +120 {t('orders.today')}
                    </p>
                </div> */}
                <img src={Shipped} alt="icon" className={`absolute top-2  ${currentLanguage == 'ar' ? 'left-3' : 'right-3'}`} />
            </div>
            <div className='border-2 border-[#eeeff2] rounded-[5px] relative p-4'>
                <p className='text-gray-dark font-[12px]'>
                    {t('orders.delivered')}
                </p>
                <p className='font-[600] my-2 text-[22px]'>
                    {totalCard3} items
                </p>
                {/* <div className='flex gap-2 text-[12px]'>
                    <p className='text-tertiary-600 font-[700] flex items-center'>
                        10%
                        <IoMdArrowDropup />
                    </p>
                    <p className='font-[600] text-gray-500'>
                        +912 {t('orders.today')}
                    </p>
                </div> */}
                <img src={Delivered} alt="icon" className={`absolute top-2  ${currentLanguage == 'ar' ? 'left-3' : 'right-3'}`} />
            </div>
            <div className='border-2 border-[#eeeff2] rounded-[5px] relative p-4'>
                <p className='text-gray-dark font-[12px]'>
                    {t('orders.canceled')}
                </p>
                <p className='font-[600] my-2 text-[22px]'>
                    {totalCard4} items
                </p>
                {/* <div className='flex gap-2 text-[12px]'>
                    <p className='text-tertiary-600 font-[700] flex items-center'>
                        10%
                        <IoMdArrowDropup />
                    </p>
                    <p className='font-[600] text-gray-500'>
                        +14 {t('orders.today')}
                    </p>
                </div> */}
                <img src={Cancel} alt="icon" className={`absolute top-2  ${currentLanguage == 'ar' ? 'left-3' : 'right-3'}`} />
            </div>

        </div>
    )
}

export default VendorReports