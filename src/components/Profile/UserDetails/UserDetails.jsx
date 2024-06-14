import React, { useState } from 'react'
import profileIcon from 'assets/profile/profile.svg'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'

const UserDetails = () => {
    const user = JSON.parse(localStorage.getItem('user'))
    const { t, i18n } = useTranslation()
    const currentLanguage = i18n.language;
    const InfoBox = ({ text, number }) => {
        return (
            <div
                className='flex flex-col justify-center items-center rounded-md py-2'
                style={{
                    boxShadow: '0px 1px 3px 0px rgba(3, 0, 71, 0.09)'
                }}
            >
                <p className='text-[20px] font-[600] text-tertiary-600'>{number}</p>
                <p className='text-[12px] text-gray-white text-center'>{text}</p>
            </div>
        )
    }

    // format birthdate
    const formatBirthdate = (birthdate) => {
        var birthdayDate = new Date(birthdate);
        // Options for formatting
        var options = { day: 'numeric', month: 'numeric', year: 'numeric' };
        // Format the Date object
        var formattedBirthday = birthdayDate.toLocaleDateString('en-US', options);
        return formattedBirthday;
    }

    const [totalPending, setTotalPending] = useState(0)
    const [totalDeliverd, setTotalDelivert] = useState(0)


    const { isPending, data, isError, error } = useQuery({
        queryKey: ['profile_sidebar_count'],
        queryFn: async () => {
            const response = await axios.get(`${import.meta.env.VITE_API_PATH}/customer-orders/get-infos?userId=${user?._id}`, {
                headers: {
                    Authorization: `Bearer ${token.accessToken}`
                }
            })

            return response?.data?.info;
        }
    })

    const { data: orders, isPending: ordersPending } = useQuery({
        queryKey: ['pending_orders', user?.id],
        queryFn: async () => {
            const res = await fetch(`${import.meta.env.VITE_API_PATH}/order-items/get-all?user_id=${user?._id}&status=pending`)
            const data = await res.json();
            setTotalPending(data.total)
            return data?.orders;
        }
    })

    const { data: shippedOrders, isPending: ordersShipped } = useQuery({
        queryKey: ['shipped_orders', user?.id],
        queryFn: async () => {
            const res = await fetch(`${import.meta.env.VITE_API_PATH}/order-items/get-all?user_id=${user?._id}&status=shipped`)
            const data = await res.json();
            setTotalDelivert(data.total)
            return data?.orders;
        }
    })
    // console.log(totalPending, orders)
    // main function
    return (
        <div className='flex flex-col justify-start items-start gap-16 lg:gap-2 font-main'>
            <div div className='grid grid-cols-1 lg:grid-cols-2 h-[90px] max-h-[150px] gap-2 w-full mb-10 lg:mb-0' >
                <div className='flex justify-between items-center px-[24px] py-[12px] rounded-md flex-wrap' style={{
                    boxShadow: '0px 1px 3px 0px rgba(3, 0, 71, 0.09)'
                }}>
                    <div className='flex gap-2 items-center rounded-md justify-between '>
                        {
                            user?.image ? <img src={user?.image} alt="icon" className='w-[64px] h-[64px] rounded-full object-contain' /> : <img src={profileIcon} alt="icon" className='w-[64px] h-[64px] rounded-full' />
                        }
                        <div >
                            <p className='text-[16px] font-[600]'>{(user?.firstname && user?.lastname) && user?.firstname + ' ' + user?.lastname}</p>
                            {/* <p className='text-[12px]'>
                                <span className='text-gray-600 '>{t('profile.balance')}</span>
                                <span className='text-tertiary-600 font-bold'> $500 </span>
                            </p> */}
                        </div>
                    </div>
                </div>
                <div className='grid grid-cols-2 lg:grid-cols-3 gap-4 mt-6 lg:mt-0'>
                    <InfoBox text={t('profile.orders')} number={data?.order_count ? data?.order_count : 0} />
                    {/* <InfoBox text={t('profile.awaiting_payment')} number='0' /> */}
                    <InfoBox text={t('profile.awaiting_shipment')} number={totalPending ? totalPending : 0} />
                    <InfoBox text={t('profile.awaiting_delivery')} number={totalDeliverd ? totalDeliverd : 0} />
                </div>
            </div >
            {/* lower part */}
            <div className='w-full grid grid-cols-2 lg:grid-cols-5 gap-4 px-2 lg:px-4 py-[24px] rounded-md mt-20 lg:mt-4' style={{
                boxShadow: '0px 1px 3px 0px rgba(3, 0, 71, 0.09)'
            }}>
                <div className='text-[12px]'>
                    <p className='text-gray-white'>{t('profile.first_name')}</p>
                    <p className='text-gray-900'>{user?.firstname ? user?.firstname : 'Loading...'}</p>
                </div>
                <div className='text-[12px]'>
                    <p className='text-gray-white'>{t('profile.last_name')}</p>
                    <p className='text-gray-900'>{user?.lastname ? user?.lastname : 'Loading...'}</p>
                </div>
                <div className='text-[12px]'>
                    <p className='text-gray-white'>{t('profile.email')}</p>
                    <p className='text-gray-900'>{user?.email ? user?.email : 'Loading...'}</p>
                </div>
                <div className='text-[12px]'>
                    <p className='text-gray-white'>{t('profile.phone')}</p>
                    <p className='text-gray-900'>{user?.phone ? user?.phone : 'Not provided'}</p>
                </div>
                <div className='text-[12px]'>
                    <p className='text-gray-white'>{t('profile.birth_date')}</p>
                    <p className='text-gray-900'>{user?.birthdate ? formatBirthdate(user.birthdate) : 'Not provided'}</p>
                </div>
            </div>
        </div>
    )
}

export default UserDetails