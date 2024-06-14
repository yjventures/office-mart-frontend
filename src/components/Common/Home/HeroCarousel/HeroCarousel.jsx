import React, { useRef, useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import backGroundPng from 'assets/vendor/vendorHero/new-bg.png' // Removed unused import
// import backGroundNew from 'assets/vendor/vendorHero/bg-new.jpg'
import backGround from 'assets/global/home/bg-image.png'
import icon from 'assets/vendor/vendorHero/icon.svg'
import { IoIosArrowRoundForward } from "react-icons/io";
import { IoIosArrowRoundBack } from "react-icons/io";
import { generalData } from "src/lib/helper/dynamicData";
import { useTranslation } from 'react-i18next'


function HeroCarousel() {
    const sliderRef = useRef();
    const { t, i18n } = useTranslation()
    const currentLanguage = i18n.language
    const settings = {
        dots: false,
        infinite: true,
        speed: 1000,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: false,
        autoplaySpeed: 2000,
        arrows: false,
    };
    const [backgroundImage, setBackgroundImage] = useState(backGround);

    const toggleBackgroundImage = () => {
        setBackgroundImage(previousBackground => previousBackground === backGround ? backGroundPng : backGround);
    };

    const handlePrevClick = () => {
        sliderRef.current.slickPrev();
        toggleBackgroundImage();
    };

    const handleNextClick = () => {
        sliderRef.current.slickNext();
        toggleBackgroundImage();
    };

    const HeroLeftTextSlideOne = () => {
        return (
            <div className="flex flex-col gap-4 p-2 justify-center items-start py-14 transition-all duration-500 -mt-1">
                <img src={generalData?.logo ? generalData?.logo : icon} alt="icon" className="w-[90px] h-[90px] object-contain rounded-md" />
                <p className={`text-[80px] font-teko max-w-[600px]`}
                    style={{
                        lineHeight: '72px',
                        color: generalData?.bannerTextColor
                    }}>
                    { currentLanguage == 'ar' ? generalData?.bannerTextArabic : generalData?.bannerText}
                </p>
                <button className=' bg-buttons text-buttons-color text-[12px] font-[700] px-4 py-3 uppercase w-[150px]'>
                    Join Now
                </button>
            </div>
        )
    }

    const HeroLeftTextSlideTwo = () => {
        return (
            <div className="flex flex-col gap-4 p-2 justify-center items-start mt-14 transition-all duration-500">
                <img src={icon} alt="icon" className="w-[60px] h-[90px]" />
                <p className="text-[80px] font-teko max-w-[600px]" style={{
                    lineHeight: '72px'
                }}>
                    Make your business more easy and handy!
                </p>
                <button className='bg-[#319848] text-primary-color text-[12px] font-[700] px-4 py-3 uppercase w-[150px]'>
                    Explore
                </button>
            </div>
        )
    }

    return (
        <div
            className=""
            dir="ltr"
            style={{
                backgroundImage: `url(${generalData?.bannerImage ? generalData.bannerImage : backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                transition: 'background-image 0.5s ease-in-out',
                backgroundRepeat: 'no-repeat',

            }}>
            <div className="max-w-7xl mx-auto relative">
                <HeroLeftTextSlideOne />
            </div>

            {/* <Slider ref={sliderRef} {...settings} className="max-w-7xl mx-auto relative">
                <div className="h-[500px] relative" >
                    <HeroLeftTextSlideOne />
                    <div className="flex gap-2 p-2 mt-10">
                        <button className="prev bg-[#FAF8F5] py-1 px-4 rounded-sm" onClick={handlePrevClick}>
                            <IoIosArrowRoundBack className="w-6 h-6" />
                        </button>
                        <button className="prev bg-[#FAF8F5] py-1 px-4 rounded-sm" onClick={handleNextClick}>
                            <IoIosArrowRoundForward className="w-6 h-6" />
                        </button>
                    </div>
                </div>
                
                <div className="h-[500px] relative">
                    <HeroLeftTextSlideTwo />
                    <div className="flex gap-2 p-2 mt-10">
                        <button className="prev bg-[#FAF8F5] py-1 px-4 rounded-sm" onClick={handlePrevClick}>
                            <IoIosArrowRoundBack className="w-6 h-6" />
                        </button>
                        <button className="prev bg-[#FAF8F5] py-1 px-4 rounded-sm" onClick={handleNextClick}>
                            <IoIosArrowRoundForward className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </Slider> */}

        </div>
    );
}
export default HeroCarousel;
