import React from 'react'
import NoResult from 'assets/global/product/no-result.png'
import { useTranslation } from 'react-i18next';

export default function NotFoundProduct() {
    const { t, i18n } = useTranslation()
    const currentLanguage = i18n.language;
    return (
        <div className="flex flex-col items-center justify-start min-h-screen gap-2 p-4 md:gap-4 md:p-8">
            <div className="flex flex-col items-center gap-2 text-center">
                {/* <FrownIcon className="h-10 w-10" /> */}
                <img src={NoResult} alt="no-result" className="h-20 w-20 mb-2" />
                <div className="flex flex-col items-center gap-4">
                    <h1 className="font-bold text-3xl tracking-tight">{t('not_found_product.title')}</h1>
                    <p className="max-w-[600px] text-gray-500 md:text-gray-400">
                        {t('not_found_product.sub_title')}
                    </p>
                </div>
            </div>
        </div>
    )
}
