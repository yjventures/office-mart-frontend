import React from 'react'
import { Outlet } from 'react-router-dom'
import VendorSidebar from '../components/Vendor/VendorSidebar/VendorSidebar'
import ScrollToTop from 'src/lib/helper/ScrollToTop'
import { useTranslation } from 'react-i18next'

const VendorLayout = () => {
    const { t, i18n } = useTranslation()
    const currentLanguage = i18n.language;
    return (
        <div className='max-w-7xl mx-auto py-10 sm:px-3 px-2 overflow-hidden relative' dir={currentLanguage == 'ar' && 'rtl'} >
            <ScrollToTop />
            <div className='lg:grid lg:grid-cols-3'>
                <div className='hidden lg:block'>
                    <VendorSidebar />
                </div>
                <div className='col-span-2 lg:col-span-0'>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default VendorLayout