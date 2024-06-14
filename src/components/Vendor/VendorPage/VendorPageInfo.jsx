import React from 'react'
import { HiChatBubbleLeftRight } from 'react-icons/hi2';
import { IoLocationSharp } from "react-icons/io5";
import { IoCall } from "react-icons/io5";
import { useLocation, useNavigate } from 'react-router-dom';
import ProductCatalog from 'src/pages/Users/ProductCatalog/ProductCatalog';
import LazyLoad from 'react-lazy-load';
import { useTranslation } from 'react-i18next';
import { AiFillFacebook, AiFillInstagram } from "react-icons/ai";
import { CiGlobe } from 'react-icons/ci';
import { ImLinkedin } from 'react-icons/im';
import { BiShare } from 'react-icons/bi';
import { showToast } from 'src/components/Common/Toastify/Toastify';

export default function VendorPageInfo({ banner, logo, name, region, phone, id, desc, links, adminView = false }) {
    const { t, i18n } = useTranslation()
    const currentLanguage = i18n.language;
    const navigate = useNavigate()
    const location = useLocation()
    return (
        <div className='w-full mt-4 relative'>
            <LazyLoad height={200}>
                <img src={banner && banner} alt="banner-image" className='w-full h-[200px] object-cover rounded-t-lg' />
            </LazyLoad>
            <p className={`absolute top-[140px] ${currentLanguage == 'ar' ? `md:right-[160px] right-[100px]` : `md:left-[160px] left-[100px]`} bg-[#4D5565] text-white px-4 py-2 rounded-sm`}>{name && currentLanguage == 'ar' ? (name?.ac ? name?.ac : name?.en) : name?.en}</p>
            <div className='flex justify-between items-center '>
                {/* text div */}
                <div className='flex justify-start items-start'>
                    <img src={logo && logo} alt="logo" className='md:w-[120px] md:h-[120px] w-[50px] h-[50px] object-contain rounded-full md:-mt-20 -mt-8 md:ms-5 ms-5 ring-2 ring-white z-10' />
                    <div className='mt-4 flex flex-col gap-3 md:ms-6 -ms-14 items-start'>
                        <div className='flex justify-center items-center gap-2'><IoLocationSharp className='min-w-5 min-h-5 text-gray-400' /><p className='text-gray-500'> {region && currentLanguage == 'ar' ? region?.ac : region?.en} </p></div>
                        <div className='flex justify-center items-center gap-2'><IoCall className='min-w-5 min-h-5 text-gray-400' /> <p className='text-gray-500'>{phone && phone}</p></div>
                    </div>
                </div>

                <div className='flex '>
                    {/* contact button */}
                    <button
                        className='bg-buttons text-buttons-color font-[600] px-4 py-2 me-4 rounded-sm cursor-pointer flex justify-center items-center gap-2'
                        onClick={() => {
                            navigator.clipboard.writeText(window.location)
                                .then(() => {
                                    showToast('Ready to share shop link', 'info')
                                })
                        }}
                    >
                        <span className='hidden sm:block'>
                            Share
                        </span>
                        <BiShare className='w-6 h-5' />
                    </button>
                    {/* contact button */}
                    <button
                        className='bg-buttons text-buttons-color font-[600] px-4 py-2 me-4 rounded-sm cursor-pointer flex justify-center items-center gap-2'
                        onClick={() => {
                            if (adminView == true) {
                                showToast('Admin view enabled', 'info')
                            } else {
                                navigate(`/user-single-chat?shopId=${id}&shopName=${name?.en}&banner=${banner}`)
                            }
                        }}
                    >
                        <span className='hidden sm:block'>
                            Chat with vendor
                        </span>
                        <HiChatBubbleLeftRight className='w-6 h-5' />
                    </button>
                </div>
            </div>
            <p className='my-4 text-secondary-color opacity-80 sm:px-3 px-1 text-justify'>
                {desc && currentLanguage == 'ar' ? (desc?.ac ? desc?.ac : desc?.en) : desc?.en}
            </p>
            {
                links && (
                    <div className='sm:px-3 px-1 grid sm:grid-cols-3'>
                        {links.map((link, index) => {
                            let icon;
                            if (link.includes('facebook')) {
                                icon = <AiFillFacebook className='min-w-7 min-h-7 ms-1' />;
                            } else if (link.includes('instagram')) {
                                icon = <AiFillInstagram className='min-w-7 min-h-7 ms-1' />;
                            } else if (link.includes('linkedin')) {
                                icon = <ImLinkedin className='min-w-7 min-h-7 ms-1' />;
                            } else {
                                // Use a default icon for other links
                                icon = <CiGlobe className='min-w-7 min-h-7 ms-1' />;
                            }
                            return (
                                <p
                                    key={index}
                                    className='flex items-center cursor-pointer shadow-sm gap-2 rounded-md hover:shadow-md py-3 px-2'
                                    onClick={() => {
                                        window.open('_blank', link)
                                    }}
                                >
                                    {icon}
                                    {/* <a href={link} target="_blank" rel="noopener noreferrer">
                                        {link}
                                    </a> */}
                                    <span className='text-gray-700 transition'>
                                        Click here to pay a visit ({link.slice(0, 18)}...)
                                    </span>
                                </p>
                            );
                        })}
                    </div>
                )
            }
            <div className='mt-4'>
                <ProductCatalog singleShop={true} shopId={id} adminView={adminView} />
            </div>
        </div>
    )
}
