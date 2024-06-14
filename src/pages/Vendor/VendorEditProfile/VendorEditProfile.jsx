import { useAtomValue } from 'jotai'
import React, { useState } from 'react'
import { userAtom } from '../../../lib/jotai'
import { useNavigate } from 'react-router-dom'
import { IoReorderThreeOutline } from 'react-icons/io5'
import VendorSidebar from '../../../components/Vendor/VendorSidebar/VendorSidebar'
import VendorEditDetails from '../../../components/Vendor/VendorEditDetails/VendorEditDetails'
import VendorHeader from '../../../components/Vendor/VendorHeader/VendorHeader'
import { useTranslation } from 'react-i18next'

const VendorEditProfile = () => {
  const [showSidebar, setShowSidebar] = useState(false)
  const navigate = useNavigate()
  const user = useAtomValue(userAtom)
  const { t, i18n } = useTranslation()
  const currentLanguage = i18n.language;

  return (
    <div className='h-full p-3 font-main lg:-ms-10'>
      {/* <div className='lg:flex justify-between items-center relative'>
        <div className='flex items-center'>
          <p className='text-xl font-bold ms-2'>Edit Profile</p>
        </div>
        <div className='lg:hidden absolute top-0 right-2'>
          <IoReorderThreeOutline className='w-[20px] h-[20px]' onClick={() => {
            setShowSidebar(!showSidebar)
          }} />
        </div>
        <div className='lg:hidden'>
          {
            showSidebar && <VendorSidebar />
          }
        </div>

      </div> */}
      <VendorHeader text={t('dashboard.edit_profile')} />
      <VendorEditDetails />
    </div>
  )
}

export default VendorEditProfile