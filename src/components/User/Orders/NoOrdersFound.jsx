import React from 'react'
import { useTranslation } from 'react-i18next'
import { PiShoppingCartLight } from 'react-icons/pi'
import { useNavigate } from 'react-router-dom'

const NoOrdersFound = () => {
    const navigate = useNavigate()
    const { t, i18n } = useTranslation()
    const currentLanguage = i18n.language;

    return (
        <div className='text-center flex flex-col gap-3 mt-40'>
            <PiShoppingCartLight className='w-20 h-20 text-gray-400 mx-auto animate-pulse' />
            <p className='text-gray-600'>{t('order.no_order')}</p>
            <button
                className='text-tertiary-500 hover:underline'
                onClick={() => navigate('/product-catalogue')}
            >
                {t('order.shop_now')}
            </button>

        </div>
    )
}

export default NoOrdersFound