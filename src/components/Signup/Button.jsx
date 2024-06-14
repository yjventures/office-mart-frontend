import React from 'react'
import arrow from '../../assets/signup/arrow.svg'
import { useTranslation } from 'react-i18next';

const Button = ({text}) => {
  const { t, i18n } = useTranslation()
  const currentLanguage = i18n.language;
  return (
    <div className='w-[100%] bg-buttons hover:bg-tertiary-500 transition flex justify-center items-center text-primary-color h-[44px] cursor-pointer rounded-sm'>
        {text}
        <img src={arrow} alt="arrow" className={`ms-2 ${currentLanguage == 'ar' && 'rotate-180'}`}/>
    </div> 
  )
}

export default Button