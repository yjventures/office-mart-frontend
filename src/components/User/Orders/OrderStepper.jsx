import React from 'react'
import { TfiPackage } from "react-icons/tfi";
import { LiaShippingFastSolid } from "react-icons/lia";
import { BsGift } from "react-icons/bs";
import { useTranslation } from 'react-i18next';

const OrderStepper = ({ activeStep, estimation_date, deliveryStatus }) => {
  // const [activeStep, setActiveStep] = React.useState(0)
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const steps = [
    {
      "en": "Packaging",
      "ar": "التعبئة"
    },
    {
      "en": "Shipping",
      "ar": "الشحن"
    },
    {
      "en": "Delivered",
      "ar": "تم التوصيل"
    }
  ]

  // console.log(deliveryStatus)
  return (
    <div
      className='flex justify-center items-center my-[15px] pt-10 pb-28 relative'

    >
      {
        deliveryStatus === 'delivered' ?
          <p dir={currentLanguage == 'ar' && 'rtl'} className='bg-tertiary-100 text-sm text-tertiary-600 font-[600] absolute bottom-6 md:right-28 px-4 py-2 rounded-full w-[200px] md:w-[330px] text-center'>
            {t('order.delivered')}
          </p>
          :
          <p dir={currentLanguage == 'ar' && 'rtl'} className='bg-tertiary-100 text-sm text-tertiary-600 font-[600] absolute bottom-6 md:right-28 px-4 py-2 rounded-full w-[200px] md:w-[330px] text-center'>
            {t('order.estimated')} {new Date(estimation_date).getDate()} {new Date(estimation_date).toLocaleString('default', { month: 'short' })}, {new Date(estimation_date).getFullYear()}
          </p>
      }
      {
        steps.map((step, index) => {
          return (
            <div className='mx-auto relative' key={index}>
              <div className='flex justify-center items-center flex-col '>
                <div className={`font-[600] flex justify-center items-center rounded-full w-[64px] h-[64px] ${activeStep >= index ? ' bg-buttons text-primary-color' : 'bg-[#DCF3E8] text-tertiary-600'}`}>
                  {
                    step.en === 'Packaging' ? <TfiPackage className='w-5 h-5' /> : step.en === 'Shipping' ? <LiaShippingFastSolid className='w-6 h-6' /> : <BsGift className='w-5 h-5' />
                  }
                </div>
                <p>
                  {currentLanguage == 'ar' ? step?.ar : step?.en}
                </p>
              </div>
              {
                index !== steps.length - 1 && <hr className={`h-[3px] w-[70px] sm:w-[200px] md:w-[220px] absolute top-[35%] ${currentLanguage == 'en' ? 'left-[98%]' : 'right-[98%]'} ${activeStep > index ? 'bg-buttons text-primary-color' : 'bg-[#DCF3E8] text-tertiary-600'} `} />
              }
            </div>
          )
        })
      }

    </div>
  )
}

export default OrderStepper