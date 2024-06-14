import React from 'react'
import { useTranslation } from 'react-i18next'
import { BiSupport } from 'react-icons/bi'
import { IoReorderThreeOutline } from 'react-icons/io5'
import { useParams } from 'react-router-dom'
import ProfileSidebar from 'src/components/Profile/ProfileSidebar/ProfileSidebar'
import SupportChatComponent from 'src/components/User/SupportChat/SupportChatComponent'

export default function SupportChat() {
    const [showSidebar, setShowSidebar] = React.useState(false)
    const { t, i18n } = useTranslation()
    const currentLanguage = i18n.language;

    return (
        <div className='h-full p-3 font-main lg:-ms-10 lg:-mt-4'>
            <div className='lg:flex justify-between items-center relative mb-4'>
                <div className='flex items-center'>
                    <BiSupport className='w-6 h-6 text-tertiary-600' />
                    <p className='text-xl font-bold ms-2'>Chat With Vendor</p>
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
            </div>
            <SupportChatComponent />
        </div>
    )
}
