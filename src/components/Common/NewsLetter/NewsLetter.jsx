import React from 'react'
import newsletterBg from 'assets/global/home/newsletter-bg.png'
import { useTranslation } from 'react-i18next'
import { generalData } from 'src/lib/helper/dynamicData'

const NewsLetter = () => {
    const { t } = useTranslation()
    return (
        <div className="font-main py-16 px-4 flex flex-col gap-2"
            style={{
                backgroundImage: `url('https://sonbolabucket.s3.ap-southeast-2.amazonaws.com/footer.svg')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}>
            <h2 className="mx-auto max-w-2xl text-center text-3xl font-bold tracking-tight text-primary-color sm:text-4xl">
                {t('newsletter.news_letter_title')}
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-center text-md leading-8 text-gray-300">
                {t('newsletter.news_letter_desc')}
            </p>
            <form className="mx-auto mt-4 flex max-w-md gap-x-4 w-full bg-white p-2 rounded-md">
                <label htmlFor="email-address" className="sr-only">
                    Email address
                </label>
                <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="min-w-0 flex-auto rounded-md border-0 bg-white/5 px-3.5 py-2 text-secondary-color shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 outline-none sm:text-sm sm:leading-6"
                    placeholder="Enter your email"
                />
                <button
                    type="submit"
                    className="flex-none rounded-sm bg-buttons px-3.5 py-2.5 text-sm font-semibold text-black shadow-sm "
                >
                    Subscribe
                </button>
            </form>

        </div>
    )
}

export default NewsLetter