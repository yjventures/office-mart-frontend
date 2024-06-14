import React, { useState } from 'react'
import { FaPlus } from 'react-icons/fa';
import { IoMdArrowDropdown } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { showToast } from 'src/components/Common/Toastify/Toastify';
import { IoIosArrowForward } from "react-icons/io";
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useSetAtom } from 'jotai';
import { shippingAndBillingAtom } from 'src/lib/jotai';
import { useTranslation } from 'react-i18next';
import { IoCopy } from "react-icons/io5";
import CancelAndRefundModal from './CancelAndRefundModal';

const OrderDetailsComponent = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { t, i18n } = useTranslation()
    const currentLanguage = i18n.language;
    const queryClient = useQueryClient()
    const setShippingAndBillingAtom = useSetAtom(shippingAndBillingAtom)
    const [confirmModal, setConfirmModal] = useState(false)
    const location = useLocation();
    const path = location.pathname;
    // console.log('path', path.startsWith('/admin-order-details'));

    // console.log(id)
    const user = JSON.parse(localStorage.getItem('user'))
    const { isPending, isError, error, data } = useQuery({
        queryKey: ['order', id],
        queryFn: async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_PATH}/order-items/order-item/${id}`, {
                    headers: {
                        Authorization: `Bearer ${JSON.parse(localStorage.getItem('token')).accessToken}`
                    }
                });
                const jsonData = await response.json();
                return jsonData.product_item;
            } catch (error) {
                console.error(`Error fetching data`);
            }
        },
    });

    // console.log(data, 'info of order')
    const [orderStatus, setOrderStatus] = useState(data?.status || 'loading status'); // initial state

    const handleOrderStatusChange = async (e) => {
        const newOrderStatus = e.target.value;
        setOrderStatus(newOrderStatus);

        try {
            const res = await axios.put(`${import.meta.env.VITE_API_PATH}/order-items/update/${id}`, {
                "status": newOrderStatus
            });

            if (res.status === 200) {
                showToast('Status updated successfully', 'success');
                queryClient.invalidateQueries({ queryKey: ['orders'] })
                // navigate('/vendor-orders');
            } else {
                showToast('Something went wrong', 'error');
            }
        } catch (error) {
            console.error('Error updating order status:', error);
        }

        try {
            const emailResponse = await axios.post(`${import.meta.env.VITE_API_PATH}/auth/send-multidevice-notification`,
                {
                    userId: data?.order_id?.user_id,
                    message: {
                        "title": "Status changed",
                        "body": `You order status has beed changed..`,
                    }
                },
            )

            // if (emailResponse.status == 200) {
            //     console.log('Notification sent to vendor successfully')
            // } else {
            //     console.log('Failed to send notification')
            // }
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };

    console.log(data)

    return (
        <div className={`font-main md:px-4 ${path.startsWith('/admin-order-details') && 'py-6'}`} dir={currentLanguage == 'ar' && 'rtl'}>
            {
                isPending && <p>Loading...</p>
            }
            {/* order id and placed on */}
            <div className='flex justify-between items-center flex-wrap'>
                <div className='flex gap-6 flex-wrap'>
                    <div className='flex gap-2 flex-wrap'>
                        <p className='text-gray-400'>{t('order_details.id')}</p>
                        <p className='uppercase'>#{data?.order_id?._id}</p>
                    </div>
                    <div className='flex gap-2'>
                        <p className='text-gray-400'>{t('order_details.placed_on')}</p>
                        <p>{data?.order_id?.creation_date && new Date(data?.order_id?.creation_date).toLocaleDateString()}</p>
                    </div>
                </div>
                {
                    path.startsWith('/order-details') && <button
                        onClick={() => {
                            let shipping_address = data?.order_id?.shipping_address
                            let billing_address = data?.order_id?.billing_address
                            setShippingAndBillingAtom({
                                shipping_address: shipping_address,
                                billing_address: billing_address
                            })
                            navigate(`/invoice/${data._id}`)
                        }}
                        className='border-2 bg-buttons hover:text-tertiary-600 flex items-center gap-1 border-tertiary-600 hover:text-primary-color px-[20px] py-[6px] rounded-[3px] text-[16px] font-[600] text-primary-color transition my-4 lg:mt-0'>
                        {t('order_details.invoice')}
                        <IoIosArrowForward className={currentLanguage == 'ar' && "rotate-180"} />
                    </button>
                }
            </div>

            {/* product name and status */}
            <div className='relative my-6'>
                <select
                    // make disabled if the order is cancelled
                    disabled={path.startsWith('/invoice') == true}
                    className='w-full block rounded-md border-0 p-3 text-gray-900 shadow-sm cursor-pointer ring-1 outline-none ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 appearance-none'
                    value={orderStatus}
                    onChange={handleOrderStatusChange}
                >
                    <option value="pending">{t('order_details.pending')}</option>
                    <option value="processing">{t('order_details.processing')}</option>
                    <option value="shipped">{t('order_details.shiped')}</option>
                    <option value="delivered">{t('order_details.delivered')}</option>
                </select>
                {/* {
                    (path.startsWith('/order-details') == true || path.startsWith('/admin-order-details') == true) &&
                    <IoMdArrowDropdown className={`absolute top-4 ${currentLanguage == 'ar' ? "left-2" : 'right-2 '}`} />
                } */}

                {/* <div className='w-full flex '>
                    <button
                        onClick={handleOrderStatusUpdate}
                        className='border-2 bg-buttons hover:text-tertiary-600 flex items-center gap-1 border-tertiary-600 hover:text-primary-color px-[20px] py-[6px] rounded-[3px] text-[16px] font-[600] text-primary-color transition my-4 lg:mt-0'
                    >Update Order Status</button>
                </div> */}
            </div>
            {/* bulk products */}
            <div className='grid grid-cols-1 md:grid-cols-2 items-center gap-4 mt-4 mb-5 rounded-md md:pe-2'>
                <div className='flex justify-start gap-1'>
                    <div className='min-w-28 w-28 h-28 rounded-md'>
                        {
                            data?.product_id?.images[0] !== '' ? <img src={data?.product_id?.images[0]} alt="product" className='w-full h-full object-contain rounded-md' /> :
                                <img
                                    src="https://www.apple.com/newsroom/images/product/iphone/standard/Apple_announce-iphone12pro_10132020_big.jpg.large.jpg"
                                    alt="product" className='w-full h-full rounded-md object-contain' />
                        }
                    </div>
                    <div className='ms-2'>
                        <p className='text-md font-[500]'>{data?.name.en}</p>
                        <p className='mt-3'> ${data?.price} x {data?.quantity}</p>
                    </div>
                </div>
                {/* <p className='text-sm md:text-end'>
                    Product color : Black
                </p> */}

            </div>
            {/* shipping address, customer note and total summery */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'>
                {/* shipping and customer night */}
                <div className='flex flex-col md:gap-16 gap-10'>
                    <div className='flex flex-col gap-2'>
                        <p className='text-gray-400'>{t('order_details.shipping_address')}</p>
                        <p>{data?.order_id?.shipping_address?.name}</p>
                        <p className='flex items-center justify-start'>
                            <span>
                                Phone:
                            </span>
                            <span
                                className='mx-2'
                                title='Phone Number'
                            >
                                {data?.order_id?.shipping_address?.phone_no && `${data?.order_id?.shipping_address?.phone_no}`}
                            </span>
                            <IoCopy
                                className='cursor-pointer text-gray-600'
                                onClick={() => {
                                    navigator.clipboard.writeText(data?.order_id?.shipping_address?.phone_no)
                                    showToast('Phone copied to clipboard', 'info')
                                }}
                            />
                        </p>
                        <p
                            className='flex items-center justify-start gap-2'
                            title='Address'
                        >
                            {data?.order_id?.shipping_address?.address1 + ', ' + data?.order_id?.shipping_address?.country}
                            <IoCopy
                                className='cursor-pointer text-gray-600'
                                onClick={() => {
                                    navigator.clipboard.writeText(data?.order_id?.shipping_address?.address1 + ', ' + data?.order_id?.shipping_address?.country)
                                    showToast('Address copied to clipboard', 'info')
                                }}
                            />
                        </p>
                        <p> {data?.order_id?.shipping_address?.address2 && data?.order_id?.shipping_address?.address2 + ', ' + data?.order_id?.shipping_address?.country}</p>
                    </div>
                    <div>
                        <p className='text-gray-400'>{t('order_details.customer_note')}</p>
                        <p>{data?.order_id?.comment == '' ? 'N/A' : data?.order_id?.comment}</p>
                    </div>
                </div>
                {/* total summary */}
                {/* <div className='flex flex-col gap-2'>
                    <p className='font-semibold'>{t('order_details.total_summary')}</p>
                    <div className='flex justify-between my-2 text-gray-500'>
                        <p>{t('order_details.subtotal')}</p>
                        <p>${data?.total_price}</p>
                    </div>
                    <div className='flex justify-between my-2 text-gray-500'>
                        <p>{t('order_details.shipping_fee')}</p>
                        <p>${data?.shipping}0 G</p>
                    </div>
                    <div className='flex justify-between my-2 text-gray-500'>
                        <p>{t('order_details.discount')}</p>
                        <p>${data?.discount}0 G</p>
                    </div>
                    <div className='flex justify-between my-2 text-gray-500'>
                        <p>{t('order_details.platform_commission')}</p>
                        <p>${data?.tax}0 G</p>
                    </div>
                    <hr />
                    <div className='flex justify-between my-2 text-gray-500'>
                        <p>{t('order_details.total')}</p>
                        <p>${data?.total_price}</p>
                    </div>
                    <p className='text-[12px]'>Paid by Credit/Debit Card</p>
                </div> */}
                <div className='flex flex-col gap-2'>
                    <p className='font-semibold'>{t('order_details.total_summary')}</p>
                    <div className='flex justify-between my-2 text-gray-500'>
                        <p>{t('order_details.subtotal')}</p>
                        <p>${data?.order_id?.sub_total}</p>
                    </div>
                    <div className='flex justify-between my-2 text-gray-500'>
                        <p>{t('order_details.shipping_fee')}</p>
                        <p>${data?.order_id?.shipping}</p>
                    </div>
                    <div className='flex justify-between my-2 text-gray-500'>
                        <p>{t('order_details.platform_commission')}</p>
                        <p>${data?.order_id?.platform_amount}</p>
                    </div>
                    <div className='flex justify-between my-2 text-gray-500'>
                        <p>{t('order_details.tax')}</p>
                        <p>${data?.order_id?.tax}</p>
                    </div>
                    <div className='flex justify-between my-2 text-gray-500'>
                        <p>{t('order_details.discount')}</p>
                        <p>${data?.order_id?.discount}</p>
                    </div>
                    <hr />
                    <div className='flex justify-between my-2 text-gray-500'>
                        <p>{t('order_details.total')}</p>
                        <p>${data?.order_id?.total_price}</p>
                    </div>
                    <p className='text-[12px]'>Paid by Credit/Debit Card</p>
                </div>
            </div>
            {/* cancel and refund order */}
            {
                <>
                    {(path.includes('/order-details') || path.startsWith('/admin-order-details')) && (
                        <button
                            onClick={() => {

                                setConfirmModal(true)
                            }}
                            className=' bg-red-600 text-primary-color px-3 py-2 rounded-sm'>
                            {t('order_details.cancel_refund')}
                        </button>
                    )}
                </>
            }
            {
                confirmModal &&
                <CancelAndRefundModal setConfirmModal={setConfirmModal} info={data} cancelId={id} />
            }
        </div>
    )
}

export default OrderDetailsComponent