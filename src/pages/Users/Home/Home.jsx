import React, { useEffect, useState } from 'react'
import Motivation from 'src/components/Common/Home/Motivation/Motivation'
import FlashSale from 'src/components/Common/Home/FlashSale/FlashSale'
import MostViewed from 'src/components/Common/Home/MostViewed/MostViewed'
import OfferSlider from 'src/components/Common/Home/OfferSlider/OfferSlider'
import MoreProducts from 'src/components/Common/Home/MoreProducts/MoreProducts'
import HeroCarousel from 'src/components/Common/Home/HeroCarousel/HeroCarousel'
import NewsLetter from 'src/components/Common/NewsLetter/NewsLetter'
import CategorySidebar from 'src/components/Common/Home/CategorySidebar/CategorySidebar'
import TopCategory from 'src/components/Common/Home/TopCategory/TopCategory'
import { homeOfferImage, offerSliderData } from 'src/lib/helper/dynamicData'
import axios from 'axios'
import { useTranslation } from 'react-i18next'
import LazyLoad from 'react-lazy-load';
import { NavLink } from 'react-router-dom'
import { token as uniqueTokenGenerator } from 'src/lib/helper/uniqueTokenGenerator'

const Home = () => {
  const { t, i18n } = useTranslation();
  const [uniqueToken, setUniqueToken] = useState(localStorage.getItem('unique_token') || null)
  useEffect(() => {
    // console.log(uniqueToken)
    if (uniqueToken == null) {
      let new_unique_token = uniqueTokenGenerator();
      setUniqueToken(new_unique_token)
      // console.log(uniqueToken)
      // console.log(new_unique_token)
      localStorage.setItem('unique_token', new_unique_token)
    }
  }, [])

  const currentLanguage = i18n.language;
  useEffect(() => {

    const callForVisit = async () => {
      try {
        await axios.post(`${import.meta.env.VITE_API_PATH}/dashboards/add-visitor`, {});
      } catch (error) {
        // showToast(error?.response?.data?.message, 'error')
        // console.log(error)
        console.error('visitor increment cant called in home page, error')
      }
    }

    callForVisit()
  }, [])


  return (
    <div className=' bg-primary-color'>
      <HeroCarousel />
      {/* checking sentry breaks */}
      {/* <button onClick={() => methodDoesNotExist()}>Break the world</button>; */}
      <div className='max-w-7xl mx-auto py-10 px-2'>
        {/* dir={currentLanguage == 'ar' && 'rtl'} */}
        <div className='grid sm:grid-cols-12 grid-cols-1 gap-4' >
          <div className='lg:col-span-3 col-span-12 h-full'>
            <CategorySidebar />
          </div>
          <div className='lg:col-span-9 col-span-12 flex flex-col gap-4 ' >
            <Motivation length={3} />
            {
              homeOfferImage?.enabled == true &&
              <div className='grid md:grid-cols-2 grid-cols-1 gap-4'>
                {
                  homeOfferImage?.offers?.map((offer, index) => {
                    return (
                      <NavLink to={`${import.meta.env.VITE_FRONTEND_PATH}/product-catalogue?tag=${offer.tag}`} key={index}>
                        <LazyLoad height={230}>
                          <img src={offer?.image} alt="offer-image-one" className='w-full h-[230px] object-contain rounded-md' />
                        </LazyLoad>
                      </NavLink>
                    )
                  })
                }


              </div>
            }
            <TopCategory />
          </div>
        </div>

        <FlashSale />
        <MostViewed />
        {
          offerSliderData?.enabled === true &&
          <OfferSlider items={offerSliderData?.items} />
        }
        <MoreProducts />
        {/* {
          offerSliderData?.enabled === true &&
          <OfferSlider items={offerSliderData?.items} />
        } */}
      </div>
      <NewsLetter />
    </div>
  )
}

export default Home