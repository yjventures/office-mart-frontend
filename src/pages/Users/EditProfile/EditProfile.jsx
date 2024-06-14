import React from 'react'
import ProfileSidebar from 'components/Profile/ProfileSidebar/ProfileSidebar';
import profileIcon from 'assets/profile/profile.svg'
import { IoReorderThreeOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import EditDetails from 'components/Profile/EditDetails/EditDetails';
import { userAtom } from 'lib/jotai';
import { useAtomValue } from 'jotai';
import { useTranslation } from 'react-i18next';

const EditProfile = () => {
  const [showSidebar, setShowSidebar] = React.useState(false)
  const navigate = useNavigate()
  const user = useAtomValue(userAtom)
  const { t, i18n } = useTranslation()
  const currentLanguage = i18n.language;

  return (
    <div className='h-full p-3 font-main lg:-ms-10'>
      <div className='lg:flex justify-between items-center relative'>
        <div className='flex items-center'>
          <img src={profileIcon} alt="icon" />
          <p className='text-xl font-bold ms-2'>{t('profile.edit_profile')}</p>
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
      <EditDetails />
    </div>
  )
}

export default EditProfile