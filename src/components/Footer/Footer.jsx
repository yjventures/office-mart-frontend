import React from 'react'
import icon from '../../assets/global/sonbola.svg'
import textIcon from 'assets/constant/logo/textSonbola.svg'
import googlePlay from '../../assets/global/google-play.svg'
import appStore from '../../assets/global/app-store.svg'
import { GrFacebookOption } from "react-icons/gr";
import { FaTwitter } from "react-icons/fa";
import { IoLogoInstagram } from "react-icons/io";
import { AiOutlineYoutube } from "react-icons/ai";
import { IoLogoGoogle } from "react-icons/io";
import { footerData, socialLinks } from 'src/lib/helper/dynamicData'
import { useTranslation } from 'react-i18next'

const Footer = () => {
  const { t, i18n } = useTranslation()
  const currentLanguage = i18n.language;

  return (
    <footer className=" bg-footer-background pb-12" aria-labelledby="footer-heading">
      <div className="mx-auto max-w-7xl px-6 py-[30px] sm:py-24 lg:px-8 lg:py-32">
        <div className="sm:mt-16 grid grid-cols-2 gap-3 md:gap-8 xl:col-span-2 xl:mt-0">
          <div className="md:grid md:grid-cols-2 md:gap-8">
            {/* left column */}
            <div className='px-1'>
              <div className='flex gap-4 items-center'>
                <img
                  className="min-h-7 max-h-7 "
                  src={footerData?.logo ? footerData?.logo : icon}
                  alt="Company name"
                />
                <img
                  className="min-h-7 max-h-7 w-[100px] md:w-[150px] sm:object-contain"
                  src={footerData?.textLogo ? footerData?.textLogo : textIcon}
                  alt="Company name"
                />
              </div>
              <p className='text-gray-300 text-balance my-6' style={{ lineHeight: '30px' }} >
                {currentLanguage == 'ar' ? footerData?.description?.ar : footerData?.description?.en}
              </p>
              <div className='hidden gap-2 flex-wrap lg:flex'>
                {/* play store button */}
                {
                  socialLinks
                    ?.filter((item) => item.appLink == true)
                    .map((item, index) => {
                      return <a href={item.link} target='_blank' key={index}>
                        <img
                          className="sm:h-[40px] md:h-[50px] sm:w-[80px] md:w-[120px] cursor-pointer"
                          src={item.name == 'Playstore' ? googlePlay : appStore}
                          alt="google-play-download"
                        />
                      </a>
                    })
                }
              </div>
            </div>
            <div className="mt-10 md:mt-0 ml-0 md:ml-8">
              <h3 className="text-xl font-semibold leading-6 text-primary-color">{currentLanguage == 'ar' ? footerData?.secondColumn?.headingName.ar : footerData?.secondColumn?.headingName.en}</h3>
              <ul role="list" className="mt-6 space-y-4">
                {footerData?.secondColumn?.items?.map((item, index) => (
                  <li key={index}>
                    <a href={item.link} className="text-sm leading-6 text-gray-300 hover:text-primary-color cursor-pointer">
                      {currentLanguage == 'ar' ? item.name.ar : item.name.en}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="md:grid md:grid-cols-2 md:gap-8">
            <div>
              <h3 className="text-xl font-semibold leading-6 text-primary-color">{currentLanguage == 'ar' ? footerData?.thirdColumn?.headingName.ar : footerData?.thirdColumn?.headingName.en}</h3>
              <ul role="list" className="mt-6 space-y-4">
                {footerData?.thirdColumn?.items?.map((item) => (
                  <li key={item.link}>
                    <a href={item.link} className="text-sm leading-6 text-gray-300 hover:text-primary-color cursor-pointer">
                      {currentLanguage == 'ar' ? item.name.ar : item.name.en}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-10 md:mt-0">
              <h3 className="text-xl font-semibold leading-6 text-primary-color">{currentLanguage == 'ar' ? footerData?.fourthColumn?.headingName.ar : footerData?.fourthColumn?.headingName.en}</h3>

              <ul role="list" className="mt-6 space-y-4">
                {footerData?.fourthColumn?.items.map((item, index) => (
                  <div
                    key={index}
                    className='flex text-gray-300 gap-2 flex-wrap'
                  // dir={item.name == 'phone' ? 'rtl' : 'ltr'}
                  >
                    <p>{currentLanguage == 'ar' ? item.name.ar : item.name.en}</p>
                    <p>{currentLanguage == 'ar' ? item.value.ar : item.value.en}</p>
                  </div>
                ))}
              </ul>
              {/* {footerData?.fourthColumn?.richText} */}
              <ul role="list" className="flex justify-start items-center flex-wrap gap-3 text-primary-color mt-5">
                {
                  socialLinks
                    ?.filter((item) => !item.appLink)
                    ?.map((item, index) => (
                      <li
                        key={index}
                        className='bg-gray-600 p-2 rounded-full cursor-pointer hover:bg-gray-500 transition'
                      >
                        {
                          (() => {
                            switch (item.name.toLowerCase()) {
                              case 'facebook':
                                return <GrFacebookOption className='w-[18px] h-[18px]' />;
                              case 'twitter':
                                return <FaTwitter className='w-[18px] h-[18px]' />;
                              case 'instagram':
                                return <IoLogoInstagram className='w-[18px] h-[18px]' />;
                              case 'youtube':
                                return <AiOutlineYoutube className='w-[18px] h-[18px]' />;
                              default:
                                return null;
                            }
                          })()
                        }
                      </li>
                    ))
                }
              </ul>
            </div>
          </div>
        </div>
        <div className='flex justify-between gap-2 flex-wrap lg:hidden mt-10'>
          {
            socialLinks
              ?.filter((item) => item.appLink == true)
              .map((item, index) => {
                return <a href={item.link} target='_blank' key={index}>
                  <img
                    className="sm:h-[40px] md:h-[50px] sm:w-[80px] md:w-[120px] cursor-pointer"
                    src={item.name == 'Playstore' ? googlePlay : appStore}
                    alt="google-play-download"
                  />
                </a>
              })
          }

        </div>
      </div>
    </footer >
  )
}

export default Footer