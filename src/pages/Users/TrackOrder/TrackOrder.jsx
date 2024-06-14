import { useAtomValue } from 'jotai'
import React, { useEffect, useState } from 'react'
import { IoReorderThreeOutline } from 'react-icons/io5'
import ProfileSidebar from 'src/components/Profile/ProfileSidebar/ProfileSidebar'
import OrderStepper from 'src/components/User/Orders/OrderStepper'
import { FaCircleInfo } from "react-icons/fa6";
import { showToast } from 'src/components/Common/Toastify/Toastify'
import { CiCircleRemove } from "react-icons/ci";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { useNavigate } from 'react-router-dom'
import CancelOrderModal from 'src/components/User/TrackOrder/CancelOrderModal'
import ReviewModal from 'src/components/User/TrackOrder/ReviewModal'
import DisputeModal from 'src/components/User/TrackOrder/DisputeModal'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'


const TrackOrder = () => {
    const [showSidebar, setShowSidebar] = React.useState(false)
    const [showCancelModal, setshowCancelModal] = React.useState(false)
    const [showReviewModal, setShowReviewModal] = React.useState(false)
    const [showDisputeModal, setShowDisputeModal] = React.useState(false)
    const [showOrderAgainModal, setShowOrderAgainModal] = React.useState(false)
    const [selectedProduct, setSelectedProduct] = React.useState(null)
    const [productItemId, setProductItemId] = React.useState(null)
    const [isNeedToUpdate, setIsNeedToUpdate] = React.useState(false)
    const [selectedShopId, setSelectedShopId] = React.useState(null)
    const { t, i18n } = useTranslation()
    const currentLanguage = i18n.language;
    const navigate = useNavigate()
    const order = JSON.parse(localStorage.getItem('orderItems'))
    // console.log(order)

    useEffect(() => {
        // Check if this is the first load by seeing if our object exists in local storage
        if (localStorage.getItem('firstLoadDone') == 0) {
            // If it's the first load, set the flag in local storage to true and reload the page
            // console.log('This is the initial load');
            localStorage.setItem('firstLoadDone', 1);
        } else {
            navigate('/orders');
        }
    }, []);

    const token = JSON.parse(localStorage.getItem('token'))

    const { isPending, isError, error, data: refundSettings } = useQuery({
        queryKey: ['refundSettings'],
        queryFn: async () => {
            const res = await axios.get(`${import.meta.env.VITE_API_PATH}/refund-settings/refund-setting/65d5a254ef555085f7ccd527`, {
                headers: {
                    Authorization: `Bearer ${token.accessToken}`
                }
            })

            return res.data.refund_setting;
        }
    })
    // console.log(isPending, data, isError, error)
    // console.log(refundSettings)
    if (isError) {
        console.error(error, 'refund setting error')
    }


    const isRefundExpired = (orderCreationTime, refundDuration) => {
        const orderCreatedAt = new Date(orderCreationTime);
        const refundExpirationTime = new Date(orderCreatedAt.getTime() + refundDuration * 3600000); // Convert refund duration from hours to milliseconds and add to order creation time
        const currentTime = new Date();
        return currentTime > refundExpirationTime;
    }

    const [showCancelButton, setShowCancelButton] = useState(true);

    useEffect(() => {
        if (order && refundSettings) {
            const refundDuration = refundSettings.duration;
            const isExpired = isRefundExpired(order.creation_date, refundDuration);
            setShowCancelButton(!isExpired);
        }
    }, [order, refundSettings]);

    
    return (
        <div className='h-full p-3 font-main lg:-ms-10 lg:-mt-4'>
            <div className='lg:flex justify-between items-center relative mb-4 ' >
                <div className='flex items-center'>
                    <FaCircleInfo className='w-6 h-6 text-tertiary-600 ' />
                    <p className='text-xl font-bold ms-2'> {t('order.order_details')}</p>
                </div>
                <div className={`lg:hidden absolute top-0 ${currentLanguage == 'ar' ? 'left-2' : 'right-2'}`}>
                    <IoReorderThreeOutline className='w-[20px] h-[20px]' onClick={() => {
                        setShowSidebar(!showSidebar)
                    }} />
                </div>
                <div className='lg:hidden'>
                    {
                        showSidebar && <ProfileSidebar />
                    }
                </div>
                <div className='flex gap-2 mt-4 lg:mt-0'>
                    {/* cancel order */}
                    {/* {
                        order?.items.some(item => item?.canceled == false && item.status !== 'delivered') &&
                        <button
                            onClick={() => setshowCancelModal(true)}
                            className='px-3 py-1 border-2 bg-red-600 rounded-[4px] text-primary-color font-[500]'
                        >
                            Cancel Order
                        </button>
                    } */}
                    {
                        (showCancelButton && order?.items.some(item => item?.canceled == false && item.status !== 'delivered')) &&
                        <button
                            onClick={() => setshowCancelModal(true)}
                            className='px-3 py-1 border-2 bg-red-600 rounded-[4px] text-primary-color font-[500]'
                        >
                            {t('order.cancel_order')}
                        </button>
                    }
                    {/* order again
                    <button

                        className='px-3 py-1 border-2 bg-buttons rounded-[4px] text-primary-color font-[500]'
                    >
                        Order Again
                    </button> */}

                </div>
            </div>
            {/* modal for cancellation */}
            {
                showCancelModal && <CancelOrderModal setshowCancelModal={setshowCancelModal} />
            }
            {/* modal for dispute */}
            {
                showDisputeModal && <DisputeModal setShowDisputeModal={setShowDisputeModal} selectedShopId={selectedShopId} productItemId={productItemId} order={order} reasons={refundSettings?.reasons} />
            }
            {/* modal for review */}
            {
                showReviewModal && <ReviewModal setShowReviewModal={setShowReviewModal} selectedProduct={selectedProduct} productItemId={productItemId} isNeedToUpdate={isNeedToUpdate} />
            }

            {
                order?.items.map((item, index) => {
                    const placedDate = new Date(order?.creation_date);
                    const formattedDate = `${placedDate.getDate()} ${placedDate.toLocaleString('default', { month: 'short' })}, ${placedDate.getFullYear()}, ${placedDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;

                    return (
                        <div className='mb-6 relative rounded-md bg-primary-color'
                            key={index}
                            style={{
                                boxShadow: '0px 1px 3px 0px #03004717',
                            }}

                        >
                            <div className='flex justify-between flex-col gap-2 md:flex-row pb-4 mb-4 px-6 pt-4' dir={currentLanguage == 'ar' && 'rtl'}>
                                <p className='text-sm text-gray-500'>
                                    {t('order.package')}  : <span className='text-secondary-color'>#{index + 1}</span>
                                </p>
                                <p className='text-sm text-gray-500'>
                                    {t('order.placed_on')} : <span className='text-secondary-color'>{formattedDate}</span>
                                </p>
                                {/* check canceled or not */}
                                {
                                    item?.canceled == true ? <p className='text-red-500 text-center'>This order has been canceled</p> :
                                        <div className='text-end'>
                                            {
                                                item?.status == 'delivered' ?
                                                    <p className='text-sm text-gray-500'>
                                                        {t('order.delivered')}: <span className='text-gray-600'>{new Date(order?.estimation_date).toDateString() || 'Not Delivered'}</span>
                                                    </p> :
                                                    <p className='text-sm text-gray-500'>
                                                        {t('order.estimated')}: <span className='text-secondary-color'>{new Date(order?.updatedAt).toDateString()}</span>
                                                    </p>
                                            }
                                        </div>
                                }
                            </div>
                            {
                                item?.canceled == false &&
                                <OrderStepper activeStep={item?.status == 'processing' || item?.status == 'pending' ? 0 : item.status == 'shipped' ? 1 : 2} estimation_date={order?.estimation_date} deliveryStatus={item?.status} />
                            }
                            {/* order details */}
                            <hr />
                            <div
                                className='max-w-4xl mx-auto pt-6 pb-2 bg-primary-color rounded-lg'
                            >
                                <div className='grid md:grid-cols-3 grid-cols-1 gap-1 mb-6 items-center px-6' key={item._id}>
                                    <div className='flex items-center gap-2'>
                                        {
                                            item?.image !== '' && <img src={item?.image} alt="image" className='w-20 h-20 object-contain rounded-md' />
                                        }

                                        <div>
                                            <p className='font-medium text-secondary-color'>{item?.name.en}</p>
                                            <p className='text-sm text-gray-600'>{`$${item?.price} x ${item?.quantity}`}</p>
                                        </div>
                                    </div>
                                    <p className='text-sm text-gray-600 text-center flex items-center justify-center'>
                                        {/* Product Color: {item?.product_id?.color?.map((color, index) => (
                                            <span key={index} style={{ backgroundColor: color, display: 'inline-block', width: '20px', height: '20px', margin: '2px', borderRadius: '50%', border: '1px solid #F4F4F4' }} />
                                        ))} */}
                                        {/* <span></span> */}
                                    </p>
                                    {/* review button */}
                                    {
                                        item?.canceled == true ?
                                            <button className='text-sm md:text-end font-[500] text-red-600' variant='outline'>
                                                {t('order.find_reason')}
                                            </button> :
                                            <>
                                                {
                                                    item?.canceled == false && item.status == 'delivered' ?
                                                        <div className='flex flex-col gap-3 items-end'>
                                                            {
                                                                item?.reviewed == false ?
                                                                    // review button
                                                                    <button
                                                                        onClick={() => {
                                                                            setSelectedProduct(item.product_id)
                                                                            setProductItemId(item._id)
                                                                            setShowReviewModal(true)
                                                                            setIsNeedToUpdate(false)
                                                                        }}
                                                                        className='text-sm md:text-center font-[500] text-primary-color hover:bg-tertiary-500 bg-buttons px-3 py-2 w-32 transition rounded-full' variant='outline'>
                                                                        {t('order.write_review')}
                                                                    </button> :
                                                                    // edit button
                                                                    <button
                                                                        // onClick={() => {
                                                                        //     setSelectedProduct(item.product_id)
                                                                        //     setProductItemId(item._id)
                                                                        //     setShowReviewModal(true)
                                                                        //     setIsNeedToUpdate(true)
                                                                        // }}
                                                                        className='text-sm md:text-center font-[500] text-primary-color rounded-full bg-blue-600 px-3 py-2 w-32 transition' variant='outline'>
                                                                        {t('order.review_added')}
                                                                    </button>
                                                            }
                                                            <button
                                                                onClick={() => {
                                                                    // setSelectedProduct(item.product_id)
                                                                    setProductItemId(item._id)
                                                                    setSelectedShopId(item.shop_id)
                                                                    setShowDisputeModal(true)
                                                                }}
                                                                className='text-sm md:text-center font-[500] text-primary-color hover:bg-red-500 bg-red-600 px-3 py-2 w-32 transition rounded-full' variant='outline'
                                                            >
                                                                {t('order.claim_dispute')}
                                                            </button>
                                                        </div> :
                                                        <p
                                                            className='text-sm md:text-end font-[500] text-gray-600'>
                                                            {t('order.give_review')}
                                                        </p>
                                                }
                                            </>
                                    }
                                </div>

                            </div>

                        </div>
                    )
                })
            }


            {/* address and costing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6" >
                <div className='px-6 py-2 rounded-md' style={{
                    boxShadow: '0px 1px 3px 0px #03004717'
                }}>
                    <h3 className="font-semibold mb-2 text-secondary-color">{t('order.shipping_address')}</h3>
                    <p className='text-[14px] text-gray-500 capitalize'>{order?.shipping_address?.name}</p>
                    <p className='text-[14px] text-gray-500'>{order?.shipping_address?.address1}, {order?.shipping_address?.address2 && order?.shipping_address?.address2 + ','} {order?.shipping_address?.zip}, {order?.shipping_address?.country}</p>
                </div>
                {/*  */}
                <div className='px-6 py-2 shadow-sm rounded-md' style={{
                    boxShadow: '0px 1px 3px 0px #03004717'
                }}>
                    <h3 className="font-semibold mb-2 text-secondary-color">{t('order.total_summary')}</h3>
                    <div className="flex justify-between text-sm mb-1">
                        <span className='text-[14px] text-gray-500'>{t('order.subtotal')}</span>
                        <span className='text-secondary-color'>${order?.sub_total}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-1">
                        <span className='text-[14px] text-gray-500'>{t('order.shipping')}</span>
                        <span className='text-secondary-color'>${order?.shipping}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-1">
                        <span className='text-[14px] text-gray-500'>{t('order.platform_fee')}</span>
                        <span className='text-secondary-color'>${order?.platform_amount}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-1">
                        <span className='text-[14px] text-gray-500'>{t('order.tax')}</span>
                        <span className='text-secondary-color'>${order?.tax}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-1">
                        <span className='text-[14px] text-gray-500'>{t('order.discount')}</span>
                        <span className="text-tertiary-500">${order?.discount}</span>
                    </div>
                    <div className="flex justify-between text-sm font-semibold border-t pt-2">
                        <span>{t('order.total')}</span>
                        <span>${order?.total_price}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">Paid with Credit/Debit Card</p>
                </div>
            </div>
        </div>
    );
}

export default TrackOrder