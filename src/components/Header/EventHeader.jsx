import React from 'react'
import { useTranslation } from 'react-i18next';
import { FaArrowRightLong } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { generalData } from 'src/lib/helper/dynamicData';

const EventHeader = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'))
    const { t } = useTranslation()
    
    return (
        <div className='p-3 font-main bg-header-background w-full'>
            <div className='max-w-7xl mx-auto w-full flex justify-between items-center '>
                <div className='flex items-center justify-center '>
                    <h1
                        className='text-[12px] lg:text-[18px] font-[600] text-buttons-color bg-buttons py-2 px-3 sm:ms-7'
                        style={{ rotate: '-7deg', }}
                    >
                        {generalData?.event?.firstName}
                    </h1>
                    <h1 className='text-[12px] lg:text-[18px] font-[600] text-primary-color py-2 px-3'>{generalData?.event?.lastName}</h1>
                </div>

                {/* discount place */}
                <div className='text-primary-color flex items-center lg:gap-2 gap-1 '>
                    <h1 className='text-[8px] lg:text-[18px] '>up to</h1>
                    <h1 className='text-[18px] lg:text-[36px] font-bold text-buttons'>{generalData?.event?.percentage}%</h1>
                    <h1 className='text-[12px] lg:text-[18px] font-bold'>OFF</h1>
                </div>

                {/* shop now button */}
                {
                    user?.type !== 'vendor' &&
                    <div className='hidden lg:block'>
                        <button
                            onClick={() => {
                                navigate('product-catalogue')
                            }}
                            className='bg-buttons text-buttons-color text-[12px] font-[700] px-4 py-2 uppercase flex items-center gap-2 transition '>
                            {
                                t('buttons.shop_now')
                            }
                            <FaArrowRightLong className='text-dark' />
                        </button>
                    </div>
                }


            </div>

        </div>
    )
}

export default EventHeader