import React from 'react'
import ProfileSidebar from 'components/Profile/ProfileSidebar/ProfileSidebar';
import profileIcon from 'assets/profile/profile.svg'
import { IoReorderThreeOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import UserDetails from 'components/Profile/UserDetails/UserDetails';
import { useTranslation } from 'react-i18next';
import { MdOutlineFavorite } from 'react-icons/md';
import FavShops from 'src/components/User/FavShops/FavShops';

const FavouriteShops = () => {
    const [showSidebar, setShowSidebar] = React.useState(false)
    const navigate = useNavigate()
    const { t, i18n } = useTranslation()
    const currentLanguage = i18n.language;
    return (
        <div className='h-full p-3 font-main lg:-ms-10'>
            <div className='lg:flex justify-between items-center relative'>
                <div className='flex items-center'>
                    <MdOutlineFavorite className='w-6 h-6 text-tertiary-600' />
                    <p className='text-xl font-bold ms-2'>
                        {t('profile_sidebar.fav_shops')}
                    </p>
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
            <FavShops />
        </div>
    )
}

export default FavouriteShops