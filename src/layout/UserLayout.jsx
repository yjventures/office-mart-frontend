import React from 'react'
import Header from '../components/Header/Header'
import { Outlet, useNavigate } from 'react-router-dom'
import Footer from '../components/Footer/Footer'
import EventHeader from '../components/Header/EventHeader'
import VendorHomeHeader from 'src/components/Vendor/VendorHomeHeader/VendorHomeHeader'
import { useLocation } from 'react-router-dom';
import ScrollToTop from 'src/lib/helper/ScrollToTop'
import { generalData } from 'src/lib/helper/dynamicData'
import { useTranslation } from 'react-i18next'
import ButtomNav from 'src/components/Common/BottomNavigation/ButtomNav'

const UserLayout = () => {
    const location = useLocation();
    const path = location.pathname;
    const { t, i18n } = useTranslation()
    const currentLanguage = i18n.language;

    return (
        <div className='bg-primary-color overflow-hidden ' dir={currentLanguage == 'ar' && 'rtl'}>
            <ScrollToTop />
            {
                (path.includes('vendor-home') || path.includes('vendor-signin') || path.includes('vendor-signup')) ?
                    <VendorHomeHeader /> :
                    <>
                        {
                            generalData?.eventEnabled == true && <EventHeader />
                        }
                        <Header />
                    </>
            }
            {/* <p className='w-[100%] h-[1px] bg-gray-100'></p> */}
            <Outlet />
            <Footer />
            <ButtomNav />

        </div>
    )
}
export default UserLayout