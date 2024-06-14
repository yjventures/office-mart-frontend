import React, { useEffect, useState } from 'react'
import { collection, query, where, onSnapshot, addDoc, limit, orderBy, updateDoc } from "firebase/firestore";
import { FaSignOutAlt } from 'react-icons/fa';
import { FaRegHeart } from "react-icons/fa";
import { TfiHeadphoneAlt } from "react-icons/tfi";
import { FaRegUser, FaShop } from "react-icons/fa6";
import { RiMapPin2Line } from "react-icons/ri";
import { PiChats, PiShoppingBagOpenLight } from "react-icons/pi";
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { db } from 'src/firebase';
import { userNewMessageAtom } from 'src/lib/jotai';
import { useAtom } from 'jotai';
import { TbBellRingingFilled } from 'react-icons/tb';


const ProfileSidebar = () => {
    const navigate = useNavigate()
    const { t, i18n } = useTranslation()
    const currentLanguage = i18n.language;
    // get current url path
    const path = window.location.pathname;
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')))
    const [token, setToken] = useState(JSON.parse(localStorage.getItem('token')))
    const [userNewMessage, setUserNewMessage] = useAtom(userNewMessageAtom)
    const location = useLocation()
    // console.log(userNewMessage)
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

    useEffect(() => {
        if (!user?._id) {
            // console.log("User ID is not specified.");
            return;
        }

        const q = query(
            collection(db, "messages"),
            where("userId", "==", user?._id),
            where("userRead", "==", false)
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            querySnapshot.forEach((doc) => {
                setUserNewMessage(true)
            });
        });
        return () => unsubscribe;
    }, [user?._id, location.pathname]);
    // console.log(data)
    // if(isPending) return 'Loading...'
    // if(isError) return 'An error occurred: ' + error



    return (
        <div className='h-[100%] min-h-[380px] lg:min-h-[600px] relative w-full lg:max-w-[240px] mx-auto font-main mt-2 lg:mt-0'
            style={{
                boxShadow: '0px 1px 3px 0px rgba(3, 0, 71, 0.09)',
            }}
            dir={currentLanguage == 'ar' && 'rtl'}
        >
            <header className='text-gray-white py-3 px-6 text-[12px] rtl:ms-1'>
                {t('profile_sidebar.dashboard')}
            </header>
            <ul className='space-y-1'>
                <li onClick={() => {
                    navigate('/orders')
                }}
                    className={`flex items-center justify-between py-2 px-6 text-gray-600 transition cursor-pointer hover:text-tertiary-600 hover:border-l-4 hover:border-l-tertiary-600 focus:text-tertiary-600 focus:border-l-4 focus:border-l-tertiary-600 ${path == '/orders' && 'text-tertiary-600 border-l-4 border-l-tertiary-600'}`}
                >
                    <p className='flex items-center rtl:gap-2'>
                        <PiShoppingBagOpenLight className='mr-2 w-[18px] h-[18px]' />
                        <span> {t('profile_sidebar.orders')} </span>
                    </p>
                    {/* 0 */}
                    {
                        data?.order_count
                    }
                </li>
                <li onClick={() => {
                    navigate('/wishlist')
                }}
                    className={`flex items-center justify-between py-2 px-6 text-gray-600 transition cursor-pointer hover:text-tertiary-600 hover:border-l-4 hover:border-l-tertiary-600 focus:text-tertiary-600 focus:border-l-4 focus:border-l-tertiary-600 ${path == '/wishlist' && 'text-tertiary-600 border-l-4 border-l-tertiary-600'}`}
                >
                    <p className='flex items-center rtl:gap-2'>
                        <FaRegHeart className='mr-2 w-[18px] h-[18px]' />
                        <span>{t('profile_sidebar.wishlist')}</span>
                    </p>
                    {
                        data?.wishlist_count
                    }
                </li>
                <li
                    onClick={() => {
                        navigate('/favourite-shops')
                    }}
                    className={`flex items-center justify-between py-2 px-6 text-gray-600 transition cursor-pointer hover:text-tertiary-600 hover:border-l-4 hover:border-l-tertiary-600 focus:text-tertiary-600 focus:border-l-4 focus:border-l-tertiary-600 ${path == '/favourite-shops' && 'text-tertiary-600 border-l-4 border-l-tertiary-600'}`}
                >
                    <p className='flex items-center rtl:gap-2'>
                        <FaShop className='mr-2 w-[18px] h-[18px]' />
                        <span>
                            {t('profile_sidebar.fav_shops')}
                        </span>
                    </p>
                </li>
                <li onClick={() => {
                    navigate('/support-tickets')
                }}
                    className={`flex items-center justify-between py-2 px-6 text-gray-600 transition cursor-pointer hover:text-tertiary-600 hover:border-l-4 hover:border-l-tertiary-600 focus:text-tertiary-600 focus:border-l-4 focus:border-l-tertiary-600 ${path == '/support-tickets' && 'text-tertiary-600 border-l-4 border-l-tertiary-600'}`}
                >
                    <p className='flex items-center rtl:gap-2'>
                        <TfiHeadphoneAlt className='mr-2 w-[18px] h-[18px]' />
                        <span>{t('profile_sidebar.support_tickets')}</span>
                    </p>
                    {
                        data?.ticket_count
                    }
                </li>
            </ul>
            <header className='text-gray-white py-3 px-6 text-[12px]'>
                {t('profile_sidebar.account_settings')}
            </header>
            <ul className='space-y-1'>
                <li
                    onClick={() => {
                        navigate('/profile')
                    }}
                    className={`flex items-center justify-between py-2 px-6 text-gray-600 transition cursor-pointer hover:text-tertiary-600 hover:border-l-4 hover:border-l-tertiary-600 focus:text-tertiary-600 focus:border-l-4 focus:border-l-tertiary-600 ${path == '/profile' && 'text-tertiary-600 border-l-4 border-l-tertiary-600'}`}
                >
                    <p className='flex items-center rtl:gap-2'>
                        <FaRegUser className='mr-2 w-[18px] h-[18px]' />
                        <span> {t('profile_sidebar.profile')} </span>
                    </p>
                </li>
                <li
                    onClick={() => {
                        navigate('/user-chats')
                    }}
                    className={`flex items-center justify-between py-2 px-6 text-gray-600 transition cursor-pointer hover:text-tertiary-600 hover:border-l-4 hover:border-l-tertiary-600 focus:text-tertiary-600 focus:border-l-4 focus:border-l-tertiary-600 ${path == '/user-chats' && 'text-tertiary-600 border-l-4 border-l-tertiary-600'}`}
                >
                    <p className='flex items-center rtl:gap-2 w-full'>
                        <PiChats className='mr-2 w-[18px] h-[18px]' />
                        <span> {t('profile_sidebar.chats')} </span>
                        {
                            userNewMessage == true && <span className='bg-tertiary-500 text-white rounded-full ms-auto text-sm flex items-center gap-1 px-2 py-[2px]'> New <TbBellRingingFilled /></span>
                        }
                    </p>
                </li>
                <li onClick={() => {
                    navigate('/address')
                }}
                    className={`flex items-center justify-between py-2 px-6 text-gray-600 transition cursor-pointer hover:text-tertiary-600 hover:border-l-4 hover:border-l-tertiary-600 focus:text-tertiary-600 focus:border-l-4 focus:border-l-tertiary-600 ${path == '/address' && 'text-tertiary-600 border-l-4 border-l-tertiary-600'}`}
                >
                    <p className='flex items-center rtl:gap-2'>
                        <RiMapPin2Line className='mr-2 w-[18px] h-[18px]' />
                        <span> {t('profile_sidebar.address')} </span>
                    </p>
                    {/* 0 */}
                </li>
                {/* <li onClick={() => {
                    navigate('/payment-methods')
                }}
                    className={`flex items-center justify-between py-2 px-6 text-gray-600 transition cursor-pointer hover:text-tertiary-600 hover:border-l-4 hover:border-l-tertiary-600 focus:text-tertiary-600 focus:border-l-4 focus:border-l-tertiary-600 ${path == '/payment-methods' && 'text-tertiary-600 border-l-4 border-l-tertiary-600'}`}
                >
                    <p className='flex items-center rtl:gap-2'>
                        <FaCreditCard className='mr-2 w-[18px] h-[18px]' />
                        <span>{t('profile_sidebar.payment_methods')}</span>
                    </p>
                     0 
                </li> */}
            </ul>
            <button
                onClick={() => {
                    localStorage.clear()
                    navigate('/signin')
                }}
                className='hidden absolute bottom-5 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-buttons w-[100%] max-w-[105px] h-[44px] rounded-md text-primary-color hover:bg-tertiary-600 hover:text-white transition lg:flex justify-center items-center'>
                Log out
                <FaSignOutAlt className='ml-1 mt-[2px]' />
            </button>
        </div>
    );
}

export default ProfileSidebar