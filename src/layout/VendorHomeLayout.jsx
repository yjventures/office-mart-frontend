import React from 'react'
import { Outlet } from 'react-router-dom'
import NewsLetter from 'src/components/Common/NewsLetter/NewsLetter'
import Footer from 'src/components/Footer/Footer'
import VendorHomeHeader from 'src/components/Vendor/VendorHomeHeader/VendorHomeHeader'
import ScrollToTop from 'src/lib/helper/ScrollToTop'

const VendorHomeLayout = () => {
    return (
        <div className='overflow-hidden'>
            <ScrollToTop />
            <VendorHomeHeader />
            <Outlet />
            <NewsLetter />
            <Footer />
        </div>
    )
}

export default VendorHomeLayout