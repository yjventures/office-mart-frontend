import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IoReorderThreeOutline } from 'react-icons/io5';
import ProfileSidebar from 'src/components/Profile/ProfileSidebar/ProfileSidebar'
import { showToast } from 'src/components/Common/Toastify/Toastify'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { BiSupport } from "react-icons/bi";
import SupportTicketComponent from 'src/components/User/SupportTicket/SupportTicketComponent';
import { IoAddCircleOutline } from "react-icons/io5";
import SupportTicketModal from 'src/components/User/SupportTicket/SupportTicketModal';
import { useTranslation } from 'react-i18next';

const SupportTicket = () => {
    const [showSidebar, setShowSidebar] = React.useState(false)
    const [showSupportTicketModal, setShowSupportTicketModal] = useState(false);
    const token = JSON.parse(localStorage.getItem('token'))
    const { t, i18n } = useTranslation()
    const currentLanguage = i18n.language;

    return (
        <div className='h-full p-3 font-main lg:-ms-10 lg:-mt-4' >
            <div className='lg:flex justify-between items-center relative mb-4 '>
                <div className='flex items-center'>
                    <BiSupport className='w-6 h-6 text-tertiary-600' />
                    <p className='text-xl ms-2'> {t('support_ticket.title')}</p>
                </div>
                <div className={`lg:hidden absolute top-0 ${currentLanguage == 'ar' ? 'left-2' : 'right-2'}`}>
                    <IoReorderThreeOutline className='w-[20px] h-[20px]' onClick={() => {
                        setShowSidebar(!showSidebar)
                    }} />
                </div>
                <div className='lg:hidden'>
                    {
                        showSidebar && <ProfileSidebar />
                    }
                </div>

                <button
                    className='bg-buttons text-white px-3 py-1 rounded-sm flex justify-center items-center gap-3 mt-4 md:mt-0'
                    onClick={() => setShowSupportTicketModal(true)}
                >
                    {t('support_ticket.button')}
                    <IoAddCircleOutline />
                </button>
                {showSupportTicketModal && <SupportTicketModal setShowSupportTicketModal={setShowSupportTicketModal} />}
            </div>
            {/* component of wishlist */}
            <SupportTicketComponent />
        </div>
    )
}

export default SupportTicket