import React from 'react'
import { useTranslation } from 'react-i18next';

const Stepper = ({ activeStep }) => {
    const { t, i18n } = useTranslation()
    const currentLanguage = i18n.language;
    // const [activeStep, setActiveStep] = React.useState(0)
    // const steps = ['Cart', 'Delivery Info', 'Payment', 'Review']
    const steps = [
        {
            en: 'Cart',
            ar: 'عربة التسوق'
        },
        {
            en: 'Delivery Info',
            ar: 'معلومات التسليم'
        },
        {
            en: 'Payment',
            ar: 'قسط'
        },
        {
            en: 'Done',
            ar: 'تم'
        },
    ]
    return (
        <div className='hidden md:flex justify-center items-center my-[45px] '>
            {
                steps.map((step, index) => {
                    return (
                        <div key={index} className='flex justify-center items-center' >
                            <div className={`px-6 py-2 font-[600] flex justify-center items-center rounded-full border-[1px] border-tertiary-400 ${activeStep >= index ? ' bg-buttons text-white' : 'bg-yellow-50 text-tertiary-600'}`}>
                                <p className='text-black'>{(currentLanguage == 'en' ? index + 1 + '. ' +  step.en : step.ar )}</p>
                            </div>
                            {
                                index !== steps.length - 1 && <div className={`w-12 w-max-[70px] h-1 bg-[#e9b951] ${activeStep > index && 'bg-buttons'}`}></div>
                            }
                        </div>
                    )
                })
            }
        </div>
    )
}

export default Stepper