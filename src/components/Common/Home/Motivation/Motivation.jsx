import React from 'react'
import gift from 'assets/global/motivation/gift.svg'
import review from 'assets/global/motivation/review.svg'
import service from 'assets/global/motivation/service.svg'
import { motivationBoxData } from 'src/lib/helper/dynamicData'
import { useTranslation } from 'react-i18next'

const Motivation = ({ length }) => {
    const { i18n } = useTranslation();
    const currentLanguage = i18n.language;

    return (
        <div className={`grid grid-cols-${length === 4 ? 2 : 1} md:grid-cols-${length} gap-4 font-main`} dir={currentLanguage == 'ar' && 'rtl'} >
            {
                motivationBoxData.slice(0, length).map((item, index) => (
                    <div className="bg-primary-motivation rounded-lg shadow-sm flex items-center gap-2 border-[1px] border-[#D8E0E9] p-[24px]">
                        <div className='bg-[#FAF8F5] min-w-14 min-h-14 rounded-full flex items-center justify-center'>
                            <img src={index === 0 ? gift : index === 1 ? review : service} alt="icon" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">{currentLanguage == 'ar' ? item?.title?.ar : item?.title?.en}</h3>
                            <p className="text-sm text-gray-600">{currentLanguage == 'ar' ? item?.subTitle?.ar : item?.subTitle?.en}</p>
                        </div>
                    </div>
                ))
            }
        </div >
    )
}

export default Motivation