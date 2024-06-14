import React from 'react'
import { IoReorderThreeOutline } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import VendorSidebar from '../VendorSidebar/VendorSidebar'
import { useTranslation } from 'react-i18next'

const VendorHeader = ({ icon, text, link, buttonText }) => {
    const [showSidebar, setShowSidebar] = React.useState(false)
    const navigate = useNavigate()
    const { t, i18n } = useTranslation()
    const currentLanguage = i18n.language;
    return (
        <div className='lg:flex justify-between items-center relative'>
            <div className='flex items-center'>
                {icon && <img src={icon} alt="icon" />}

                <p className={`text-xl ms-2 ${icon ? 'font-bold' : 'font-medium'}`}>{text}</p>
            </div>
            <div className={`lg:hidden absolute top-0 ${currentLanguage == 'ar' ? 'left-2' : 'right-2'}`}>
                <IoReorderThreeOutline className={`w-[20px] h-[20px] cursor-pointer`} onClick={() => {
                    setShowSidebar(!showSidebar)
                }} />
            </div>
            <div className='lg:hidden'>
                {
                    showSidebar && <VendorSidebar />
                }
            </div>
            {
                link && <button
                    onClick={() => {
                        navigate(link)
                    }}
                    className='border-2 px-[20px] py-[6px] text-[16px] font-[600] text-tertiary-600 transition my-4 lg:mt-0 rounded-md'>
                    {buttonText}
                </button>
            }

        </div>
    )
}

export default VendorHeader