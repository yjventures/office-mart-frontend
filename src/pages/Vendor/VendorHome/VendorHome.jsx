import React from 'react'
import FlashSale from 'src/components/Common/Home/FlashSale/FlashSale'
import HeroCarousel from 'src/components/Common/Home/HeroCarousel/HeroCarousel'
import HomePageCategory from 'src/components/Common/Home/HomePageCategory/HomePageCategory'
import MoreProducts from 'src/components/Common/Home/MoreProducts/MoreProducts'
import MostViewed from 'src/components/Common/Home/MostViewed/MostViewed'
import Motivation from 'src/components/Common/Home/Motivation/Motivation'
import OfferSlider from 'src/components/Common/Home/OfferSlider/OfferSlider'
import NewsLetter from 'src/components/Common/NewsLetter/NewsLetter'
import VendorHomeInfo from 'src/components/Vendor/VendorHome/VendorHomeInfo'
import VendorHomeHeader from 'src/components/Vendor/VendorHomeHeader/VendorHomeHeader'

const VendorHome = () => {
  return (
    <>
      <HeroCarousel />
      <div className='max-w-7xl mx-auto py-10 px-2'>
        <Motivation length={4} />
        <VendorHomeInfo />
        <HomePageCategory />
        <FlashSale />
        <MostViewed />
        <OfferSlider />
        <MoreProducts />
        <OfferSlider />
      </div>
      <NewsLetter />
    </>

  )
}

export default VendorHome