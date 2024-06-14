import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import bgOne from 'assets/global/home/offer.svg'
import { Navigate, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function OfferSlider({ items }) {
    const naviagte = useNavigate()
    const { t, i18n } = useTranslation()
    const currentLanguage = i18n.language;

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
    };

    return (
        <Slider {...settings}>
            {items?.map((item, index) => (
                <div key={index}>
                    <div
                        className="rounded-sm flex justify-center items-center flex-col"
                        style={{
                            background: `url(${item.image}) no-repeat center / cover`,
                            height: '418px'
                        }}
                    >
                        <p className="text-gray-white">
                            {currentLanguage == 'ar' ? item.title.ar : item.title.en}
                        </p>
                        <p className="text-secondary-color md:text-[50px] text-[30px] font-[700]">
                            {currentLanguage == 'ar' ? item.description.ar : item.description.en}
                        </p>
                        <button
                            onClick={() => {
                                naviagte(`/product-catalogue??tag=${item.tag}`)
                            }}
                            className='bg-buttons text-black text-[12px] font-[700] px-4 py-3 uppercase w-[150px] mt-4'>
                            {currentLanguage == 'en' ? 'Explore Now' : 'استكشف الآن'}
                        </button>
                    </div>
                </div>
            ))}
        </Slider>
    );
}

export default OfferSlider;
