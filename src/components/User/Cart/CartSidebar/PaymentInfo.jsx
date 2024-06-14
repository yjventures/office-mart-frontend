import React from 'react';
import { useTranslation } from 'react-i18next';

const PaymentInfo = ({ subtotal = 0, shipping = 0, platformFee = 0, tax = 0, discount = 0, showTaxField = false, showPlatformFeeField = false }) => {
    const total = parseFloat(subtotal) + parseFloat(shipping) + parseFloat(tax) + parseFloat(platformFee) - parseFloat(discount);
    const { t, i18n } = useTranslation()
    const currentLanguage = i18n.language;
    return (
        <div className='flex flex-col gap-3 mdLp-7 '>
            <div className='flex justify-between md:text-[18px]'>
                <p className='text-gray-500'>{t('cart.subtotal')} :</p>
                <p className='text-black font-[600]'>{parseFloat(subtotal).toFixed(2)} USD</p>
            </div>
            <div className='flex justify-between md:text-[18px]'>
                <p className='text-gray-500'>{t('cart.shipping')} :</p>
                <p className='text-black font-[600]'>{parseFloat(shipping).toFixed(2)} USD</p>
            </div>
            {
                showTaxField && <div className='flex justify-between md:text-[18px]'>
                    <p className='text-gray-500'>{t('cart.tax')} :</p>
                    <p className='text-black font-[600]'>{parseFloat(tax).toFixed(2)} USD</p>
                </div>
            }
            {
                showPlatformFeeField && <div className='flex justify-between md:text-[18px]'>
                    <p className='text-gray-500'>{t('cart.platform_fee')} :</p>
                    <p className='text-black font-[600]'>{parseFloat(platformFee).toFixed(2)} USD</p>
                </div>
            }


            <div className='flex justify-between md:text-[18px]'>
                <p className='text-gray-500'>{t('cart.discount')} :</p>
                <p className='text-black font-[600]'>{parseFloat(discount).toFixed(2)} USD</p>
            </div>
            <hr className='w-full bg-gray-200 h-[2px]' />
            <div className='flex justify-between md:text-[18px]'>
                <p className='text-black font-[600]'>{t('cart.total')} :</p>
                <p className='text-black font-[600]'>{total.toFixed(2)} USD </p>
            </div>
        </div>
    );
};

export default PaymentInfo;