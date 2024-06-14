import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Stepper from 'src/components/User/Cart/Stepper/Stepper'
import { RiStackLine } from "react-icons/ri";
import { AiTwotoneCheckCircle } from "react-icons/ai";
import { GoCheckCircle } from "react-icons/go";
import { useTranslation } from 'react-i18next';

const PaymentSuccess = () => {
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null)
  const currentLanguage = i18n.language;
  return (
    <div className='font-main'>
      <Stepper activeStep={3} />
      <div className="flex flex-col items-center justify-center mb-10 p-2">
        {/* <CheckIcon className="text-tertiary-500 w-16 h-16" /> */}
        <GoCheckCircle className="text-tertiary-500 w-16 h-16" />
        <h1 className="mt-6 text-2xl font-semibold text-secondary-color text-center">{t('payment_success.title')}</h1>
        <p className="mt-2 text-center text-sm text-gray-500">
          {t('payment_success.sub_title')}
        </p>
        {
          user && <div className="mt-6 flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
            <button
              onClick={() => {
                navigate('/product-catalogue')
              }}
              className="bg-tertiary-500 text-primary-color hover:bg-buttons w-full sm:w-auto flex items-center justify-center px-4 py-2 rounded-sm transition">
              {t('payment_success.shop_more')}
              <RiStackLine className='w-4 h-4 mx-2' />
            </button>
            <button
              onClick={() => {
                navigate('/orders')
              }}
              className="border border-gray-300 text-primary-color bg-secondary-color hover:bg-primary-color hover:text-secondary-color w-full sm:w-auto flex items-center justify-center px-4 py-2 rounded-sm transition">
              {t('payment_success.view_order')}

              <ArrowRightIcon className="w-4 h-4 ml-2" />
            </button>
          </div>
        }

      </div>
    </div >
  )
}

function ArrowRightIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  )
}

function CheckIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}


export default PaymentSuccess