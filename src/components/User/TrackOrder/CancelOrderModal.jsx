import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import React from 'react'
import { CiCircleRemove } from 'react-icons/ci'
import { MdOutlineKeyboardArrowDown } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import { showToast } from 'src/components/Common/Toastify/Toastify'

const CancelOrderModal = ({ setshowCancelModal }) => {
    const token = JSON.parse(localStorage.getItem('token'))
    const user = JSON.parse(localStorage.getItem('user'))
    const [details, setDetails] = React.useState('')
    const order = JSON.parse(localStorage.getItem('orderItems'))
    const navigate = useNavigate();

    const { isPending, isError, data, error } = useQuery({
        queryKey: 'cancelOrder',
        queryFn: async () => {
            const response = await axios.get(`${import.meta.env.VITE_API_PATH}/refund-settings/refund-setting/65d5a254ef555085f7ccd527`, {
                headers: {
                    'Authorization': `Bearer ${token.accessToken}`,
                }
            })

            return response?.data?.refund_setting?.reasons;
        }
    })
    const [reason, setReason] = React.useState(data?.[0] || '')
    console.log(reason)

    const handleCancelOrder = async () => {
        if (reason === '') {
            showToast('Please select a reason for cancellation', 'error')
            return
        }
        if (reason === 'Other' && details === '') {
            showToast('Please write a reason for cancellation', 'error')
            return
        }
        // console.log(reason, details)
        // return
        const myReason = data.find(item => item._id == reason)
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_PATH}/refunds/create-batch`,
                {
                    "reason": myReason?.title,
                    "order": order._id,
                    // "product_item": "{{ORDER_ITEM_ID}}",
                    // "shop": "{{SHOP_ID}}",
                    "product_items": order?.items?.map((item) => {
                        return {
                            _id: item?._id,
                            shop_id: item?.shop_id?._id,
                        }
                    }),

                    "amount": order?.total_price,
                    "details": details
                }, {
                headers: {
                    'Authorization': `Bearer ${token.accessToken}`
                }
            })

            if (response.status === 200) {
                showToast('Order has been cancelled successfully', 'success')
                setshowCancelModal(false);
                navigate('/orders')
            } else {
                showToast('Order has not been cancelled', 'error')
            }
        } catch (error) {

        }
    }

    return (
        <div className='fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center px-2'>
            <div className='bg-white py-4 rounded-sm flex flex-col gap-3 w-[472px]'>
                <div className='flex justify-between px-4 items-center'>
                    <p className='mb-1 uppercase font-[500]'>Cancel Your Order</p>
                    <CiCircleRemove
                        className='w-6 h-6 cursor-pointer text-gray-400 hover:text-tertiary-500 transition duration-300 ease-in-out'
                        onClick={() => {
                            setshowCancelModal(false)
                        }}
                    />

                </div>
                <hr className='' />
                {/* reason for cancellation */}
                <div className='flex justify-start gap-2 px-4 flex-col text-[14px] relative'>
                    <p className='text-gray-600 text-start'>Reason for cancellation?</p>
                    <select
                        onChange={(e) => setReason(e.target.value)}
                        className='border-2 border-gray-100 rounded-sm px-2 py-2 appearance-none outline-none cursor-pointer'>
                        {
                            data?.map((reason, index) => (
                                <option
                                    key={index}
                                    value={reason?._id}

                                >
                                    {reason?.title?.en + ' - ' + reason?.title?.ac}
                                </option>
                            ))
                        }
                        {/* <option value=''>I changed my mind</option>
                        <option value=''>I found a better price</option>
                        <option value=''>I found a better product</option>
                        <option value=''>I don't need it anymore</option>
                        <option value=''>I ordered by mistake</option> */}
                        <option value='Other'>Other</option>
                    </select>
                    <MdOutlineKeyboardArrowDown className='absolute right-6 bottom-2 w-5 h-6 text-gray-400' />
                </div>
                {/* details */}
                <div className='flex justify-start gap-2 px-4 flex-col text-[14px] relative'>
                    <p className='text-gray-600 text-start'>Details</p>
                    <textarea
                        onChange={(e) => setDetails(e.target.value)}
                        className='border-2 border-gray-100 rounded-sm px-2 py-2 appearance-none outline-none cursor-text h-28 w-full resize-none overflow-y-auto'
                        placeholder='Write your reason here'
                    />
                </div>
                {/* cancel order button */}
                <div className='flex justify-start gap-2 px-4'>
                    <button
                        onClick={() => {
                            // setshowCancelModal(false)
                            handleCancelOrder()
                        }}
                        className='px-3 py-1 border-2 bg-buttons rounded-[4px] text-primary-color font-[500]'
                    >
                        Cancel Order
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CancelOrderModal