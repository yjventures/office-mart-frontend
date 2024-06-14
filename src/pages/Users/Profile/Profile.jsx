import React from 'react'
import ProfileSidebar from 'components/Profile/ProfileSidebar/ProfileSidebar';
import profileIcon from 'assets/profile/profile.svg'
import { IoReorderThreeOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import UserDetails from 'components/Profile/UserDetails/UserDetails';
import { useTranslation } from 'react-i18next';

const Profile = () => {
    const [showSidebar, setShowSidebar] = React.useState(false)
    const navigate = useNavigate()
    const { t, i18n } = useTranslation()
    const currentLanguage = i18n.language;
    return (
        <div className='h-full p-3 font-main lg:-ms-10'>
            <div className='lg:flex justify-between items-center relative'>
                <div className='flex items-center'>
                    <img src={profileIcon} alt="icon" />
                    <p className='text-xl font-bold ms-2'>{t('profile.title')}</p>
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
                    onClick={() => {
                        navigate('/edit-profile')
                    }}
                    className='border-2 border-tertiary-600 text-tertiary-600 px-[20px] py-[6px] rounded-sm text-[16px] font-[600] hover:text-primary-color hover:text-tertiary-600 transition my-4 lg:mt-0'>
                    {t('profile.edit_profile')}
                </button>
            </div>
            <UserDetails />
        </div>
    )
}

export default Profile