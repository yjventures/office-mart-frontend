import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next';

const ErrorPage = () => {
    const { t, i18n } = useTranslation()
    const currentLanguage = i18n.language;
    return (
        <div className="flex flex-col items-center justify-center min-h-[600px] w-full text-center space-y-4 font-main">

            <div className="space-y-2">
                <h1 className="text-3xl font-extrabold tracking-tighter sm:text-5xl">
                    {t('error_page.title')}
                </h1>
                <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                    {t('error_page.sub_title')}
                </p>
            </div>
            <Link
                className="inline-flex h-10 items-center rounded-md bg-gray-900 px-8 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                to={'/'}
            >
                {t('error_page.btn')}
            </Link>
        </div>
    )
}

export default ErrorPage