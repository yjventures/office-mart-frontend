import React, { useRef } from 'react'
import { showToast } from 'src/components/Common/Toastify/Toastify'
import OrderDetailsComponent from '../OrderDetails/OrderDetailsComponent'
import { shippingAndBillingAtom } from 'src/lib/jotai'
import { useAtomValue } from 'jotai'
import { useParams } from 'react-router-dom'
import sonbolaIcon from 'assets/global/sonbola.svg'
import sonbolaIconText from 'assets/constant/logo/textSonbolaBlack.svg'
import { useTranslation } from 'react-i18next'
import { generalData, invoicePageInfo } from 'src/lib/helper/dynamicData'

const InvoiceComponent = React.forwardRef((props, ref) => {
    const { id } = useParams()
    const { t } = useTranslation()
    const shippingAndBilling = useAtomValue(shippingAndBillingAtom)
    const CompanyDetails = () => {
        return (
            <div className='flex justify-between md:items-center flex-col md:flex-row border-b-2 border-b-gray-200'>
                <div
                    onClick={() => {
                        window.open("https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1862.5568561771315!2d91.87156005957578!3d24.895699353661698!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x37505536e8446057%3A0x4025bb4dcb6ad526!2z4KaV4Ka-4Kac4KeAIOCmj-CmuOCnjeCmquCmvuCmsOCmvuCml-CmvuCmuCDgpqvgp4HgpqEg4KaG4KaH4Kay4KeN4Kav4Ka-4Kao4KeN4KahIOCmuOCmv-CmsuCnh-Cmnw!5e0!3m2!1sbn!2sbd!4v1707032406502!5m2!1sbn!2sbd")
                    }}
                    className='text-gray-dark my-4 hover:underline cursor-pointer' style={{ lineHeight: '30px' }}>
                    {
                        invoicePageInfo?.short_address ? invoicePageInfo?.short_address : "Loading..."
                    }
                    <br />
                    {
                        invoicePageInfo?.country ? invoicePageInfo?.country : "Loading..."
                    }
                    <br />
                    {
                        invoicePageInfo?.number ? invoicePageInfo?.number : "Loading..."
                    }
                </div>
                <div className='flex justify-end flex-col'>
                    <div className='flex items-center gap-3 my-2'>
                        {/* <img src={sonbolaIcon} />
                        <img src={sonbolaIconText} /> */}
                        <img src={generalData?.logo ? generalData?.logo : sonbolaIcon} alt="logo" className='h-8 w-auto' />
                        <img src={generalData?.textLogo ? generalData?.textLogo : sonbolaIconText} alt="sonbola" className={`h-8 w-24 md:w-28 lg:w-32 ${generalData?.textLogo && 'object-contain'}`} />

                    </div>
                    <button
                        className='text-2xl px-2  text-end'>
                        {t('invoice_page.invoice')}
                    </button>
                </div>

            </div>
        )
    }

    const BillingAndShipping = () => {
        return (
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 my-6'>
                <div className='flex flex-col items-start gap-2'>
                    <p className='text-gray-400'>
                        {t('invoice_page.bill_to')}
                    </p>
                    <p>{shippingAndBilling?.billing_address?.name}</p>
                    <p>
                        {
                            shippingAndBilling?.billing_address?.address1
                        }
                    </p>
                </div>
                <div className='flex flex-col items-start gap-2'>
                    <p className='text-gray-400'>
                        {t('invoice_page.ship_to')}
                    </p>
                    <p>{shippingAndBilling?.shipping_address?.name}</p>
                    <p>
                        {
                            shippingAndBilling?.shipping_address?.address1
                        }
                    </p>
                </div>
                <div className='flex flex-col items-start gap-2'>
                    <div className='flex justify-between w-full gap-2'>
                        <p className='text-gray-400'>
                            {t('invoice_page.invoice_id')}
                        </p>
                        <p>#SBL-{id.toUpperCase().slice(-7)}</p>
                    </div>
                    <div className='flex justify-between w-full'>
                        <p className='text-gray-400'>
                            {t('invoice_page.shipment_id')}
                        </p>
                        <p>#SHP-2011REG</p>
                    </div>
                    <div className='flex justify-between w-full'>
                        <p className='text-gray-400'>
                            {t('invoice_page.date')}
                        </p>

                        <p>{new Date().toDateString()}</p>
                    </div>
                </div>
            </div>
        )
    }


    // main component
    return (
        <div className='font-main' ref={ref}>
            {/* company logo and address */}
            <CompanyDetails />
            {/* billing, shipping and invoice info */}
            <BillingAndShipping />
            {/* order details common component */}
            <OrderDetailsComponent />
        </div>
    )
})

export default InvoiceComponent