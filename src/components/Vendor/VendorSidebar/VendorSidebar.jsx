import React, { useEffect, useState } from 'react'
import { collection, query, where, onSnapshot, addDoc, limit, orderBy, updateDoc } from "firebase/firestore";
import { FaSignOutAlt } from 'react-icons/fa';
import { TfiHeadphoneAlt } from "react-icons/tfi";
import { PiShoppingBagOpenLight } from "react-icons/pi";
import { useLocation, useNavigate } from 'react-router-dom';
import { BsLayoutThreeColumns } from "react-icons/bs";
import { LuUpload } from "react-icons/lu";
import { FiShoppingCart } from "react-icons/fi";
import { IoSettings } from "react-icons/io5";
import { useAtom, useSetAtom } from 'jotai';
import { newProductAtom, vendorNewMessageAtom } from 'src/lib/jotai';
import { useQuery } from '@tanstack/react-query';
import { PiChats } from "react-icons/pi";
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { db } from 'src/firebase';
import { TbBellRingingFilled } from 'react-icons/tb';


const VendorSidebar = () => {
    const { t, i18n } = useTranslation()
    const currentLanguage = i18n.language;
    const navigate = useNavigate()
    const newProduct = useSetAtom(newProductAtom)
    const location = useLocation()
    const path = window.location.pathname;
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')))
    const token = JSON.parse(localStorage.getItem('token'))
    const [vendorNewMessage, setVendorNewMessage] = useAtom(vendorNewMessageAtom)
    // console.log(vendorNewMessage)
    const { isPending, data, isError, error } = useQuery({
        queryKey: ['vendor_info_count'],
        queryFn: async () => {
            const response = await axios.get(`${import.meta.env.VITE_API_PATH}/customer-orders/get-infos?userId=${user?._id}&shopId=${user?.vendor_info?.shop?._id}`, {
                headers: {
                    Authorization: `Bearer ${token.accessToken}`
                }
            })

            return response?.data?.info;
        }
    })

    useEffect(() => {
        if (!user?.vendor_info?.shop?._id) {
            // console.log("Shop ID is not specified.");
            return;
        }

        const q = query(
            collection(db, "messages"),
            where("shopId", "==", user?.vendor_info?.shop?._id),
            where("vendorRead", "==", false)
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            querySnapshot.forEach((doc) => {
                setVendorNewMessage(true)
            });
        });
        return () => unsubscribe;
    }, [user?.vendor_info?.shop?._id, location.pathname]);

    return (
        <div className='h-[100%] min-h-[380px] max-h-[420px] lg:min-h-[530px] relative w-full lg:max-w-[240px] mx-auto font-main mt-2 lg:mt-0 '
            style={{
                boxShadow: '0px 1px 3px 0px rgba(3, 0, 71, 0.09)',
            }}
        >

            <ul className='space-y-1'>
                <li onClick={() => {
                    navigate('/vendor-dashboard')
                }}
                    className={`flex items-center justify-between py-2 px-6 text-gray-600 transition cursor-pointer hover:text-tertiary-600 hover:border-l-4 hover:border-l-green-600 focus:text-tertiary-600 focus:border-l-4 focus:border-l-green-600 ${path == '/vendor-dashboard' && 'text-tertiary-600 border-l-4 border-l-green-600'}`}
                >
                    <p className='flex items-center'>
                        <BsLayoutThreeColumns className='mr-2 w-[18px] h-[18px] rtl:me-2' />
                        <span> {t('vendor_sidebar.dashboard')} </span>
                    </p>
                </li>
                <li onClick={() => {
                    navigate('/vendor-products')
                }}
                    className={`flex items-center justify-between py-2 px-6 text-gray-600 transition cursor-pointer hover:text-tertiary-600 hover:border-l-4 hover:border-l-green-600 focus:text-tertiary-600 focus:border-l-4 focus:border-l-green-600 ${path == '/vendor-products' && 'text-tertiary-600 border-l-4 border-l-green-600'}`}
                >
                    <p className='flex items-center'>
                        <PiShoppingBagOpenLight className='mr-2 w-[18px] h-[18px] rtl:me-2' />
                        <span>{t('vendor_sidebar.products')} </span>
                    </p>
                    {/* products count */}
                    <p>{data?.product_count}</p>
                </li>
                <li onClick={() => {
                    newProduct({})
                    navigate('/new-product')
                }}
                    className={`flex items-center justify-between py-2 px-6 text-gray-600 transition cursor-pointer hover:text-tertiary-600 hover:border-l-4 hover:border-l-green-600 focus:text-tertiary-600 focus:border-l-4 focus:border-l-green-600 ${path == '/new-product' && 'text-tertiary-600 border-l-4 border-l-green-600'}`}
                >
                    <p className='flex items-center'>
                        <LuUpload className='mr-2 w-[18px] h-[18px] rtl:me-2' />
                        <span>
                            {t('vendor_sidebar.add_new_products')}
                        </span>
                    </p>
                </li>
                <li onClick={() => {
                    navigate('/vendor-orders')
                }}
                    className={`flex items-center justify-between py-2 px-6 text-gray-600 transition cursor-pointer hover:text-tertiary-600 hover:border-l-4 hover:border-l-green-600 focus:text-tertiary-600 focus:border-l-4 focus:border-l-green-600 ${path == '/vendor-orders' && 'text-tertiary-600 border-l-4 border-l-green-600'}`}
                >
                    <p className='flex items-center'>
                        <FiShoppingCart className='mr-2 w-[18px] h-[18px] rtl:me-2' />
                        <span>
                            {t('vendor_sidebar.orders')}
                        </span>
                    </p>
                    {/* order count */}
                    <p>{data?.order_count}</p>
                </li>
                <li onClick={() => {
                    navigate('/shop-settings')
                }}
                    className={`flex items-center justify-between py-2 px-6 text-gray-600 transition cursor-pointer hover:text-tertiary-600 hover:border-l-4 hover:border-l-green-600 focus:text-tertiary-600 focus:border-l-4 focus:border-l-green-600 ${path == '/shop-settings' && 'text-tertiary-600 border-l-4 border-l-green-600'}`}
                >
                    <p className='flex items-center'>
                        <IoSettings className='mr-2 w-[18px] h-[18px] rtl:me-2' />
                        <span>{t('vendor_sidebar.shop_settings')}</span>
                    </p>
                </li>
                {/* chats */}
                <li onClick={() => {
                    navigate('/vendor-chats')
                }}
                    className={`flex items-center justify-between py-2 px-6 text-gray-600 transition cursor-pointer hover:text-tertiary-600 hover:border-l-4 hover:border-l-green-600 focus:text-tertiary-600 focus:border-l-4 focus:border-l-green-600 ${path == '/vendor-chats' && 'text-tertiary-600 border-l-4 border-l-green-600'}`}
                >
                    <p className='flex items-center w-full'>
                        <PiChats className='mr-2 w-[18px] h-[18px] rtl:me-2' />
                        <span>
                            {t('vendor_sidebar.chats')}
                        </span>
                        {
                            vendorNewMessage == true && <span className='bg-tertiary-500 text-white rounded-full ms-auto text-sm flex items-center gap-1 px-2 py-[2px]'> New <TbBellRingingFilled /></span>
                        }
                    </p>
                </li>
                <li onClick={() => {
                    navigate('/vendor-support-tickets')
                }}
                    className={`flex items-center justify-between py-2 px-6 text-gray-600 transition cursor-pointer hover:text-tertiary-600 hover:border-l-4 hover:border-l-green-600 focus:text-tertiary-600 focus:border-l-4 focus:border-l-green-600 ${path == '/vendor-support-tickets' && 'text-tertiary-600 border-l-4 border-l-green-600'}`}
                >
                    <p className='flex items-center'>
                        <PiChats className='mr-2 w-[18px] h-[18px] rtl:me-2' />
                        <span>
                            {t('vendor_sidebar.support_ticket')}
                        </span>
                    </p>
                    <p>{data?.ticket_count}</p>
                </li>
            </ul>

            <button onClick={() => {
                localStorage.clear()
                navigate('/signin')
            }} className='hidden absolute bottom-5 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-buttons w-[100%] max-w-[105px] h-[44px] rounded-md text-primary-color lg:flex justify-center items-center'>
                Log out
                <FaSignOutAlt className='ml-1 mt-[2px] rtl:me-2' />
            </button>
        </div>
    );
}

export default VendorSidebar