import { Fragment, useEffect, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { HiXMark } from "react-icons/hi2";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { TbLayoutSidebarRightCollapseFilled } from "react-icons/tb";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { RxCross2 } from 'react-icons/rx';
import { IoArrowForwardCircle } from "react-icons/io5";
import { MdDoubleArrow } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import PaymentInfo from '../CartSidebar/PaymentInfo';
import ShippingDestinationComponent from '../../ShippingCost/ShippingCost';
import HeaderLoader from 'src/components/Header/HeaderLoader';
import { useAtom, useAtomValue } from 'jotai';
import { userDestinationCost, userDestinationVat } from 'src/lib/jotai';
import { GoTrash } from 'react-icons/go';
import WishListSideOver from './WishListSideOver';
import { token as uniqueTokenGenerator } from 'src/lib/helper/uniqueTokenGenerator'
import { calculateTaxAmount } from 'src/lib/helper/calculateTax';
import { getSelectedVariationDetails } from 'src/lib/helper/getSelectedVariation';
import { calculateTotalPrice } from 'src/lib/helper/calculateTotalPrice';
import { calculateUnitPrice } from 'src/lib/helper/calculateUnitPrice';

export default function Sideover({ open, setOpen }) {
    const navigate = useNavigate();
    const userId = JSON.parse(localStorage.getItem('user'))?._id;
    const queryClient = useQueryClient(); // Add this line to use the query client
    const { t, i18n } = useTranslation()
    const currentLanguage = i18n.language;
    const [loading, setLoading] = useState(false)
    const [loadingDeletion, setLoadingDeletion] = useState(false)
    const [cartItems, setNewCartItems] = useState(JSON.parse(localStorage.getItem('cartItems')) || { items: [], sub_total: 0, tax: 0, total_price: 0 })
    const shippingDestinationCost = useAtomValue(userDestinationCost)
    const shippingDestinationVat = useAtomValue(userDestinationVat)
    const [tab, setTab] = useState('cart')
    const [uniqueToken, setUniqueToken] = useState(localStorage.getItem('unique_token') || null)

    const { isPending: shippingPending, isError: shippingIsError, error: shippingError, data: shippingAndVats } = useQuery({
        queryKey: ['shipping_and_vats'],
        queryFn: async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_PATH}/shipping-vats/get-all`)
                // console.log(response.data)
                return response?.data?.shipping_and_vats
            } catch (error) {
                console.error(`Error fetching data`);
            }
        },
    });

    const { isPending: isPendingPlatformFee, isError: isErrorPlatformFee, error: errorPlatformFee, data: platformFee } = useQuery({
        queryKey: ['platform_fees'],
        queryFn: async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_PATH}/platform-fees/platform-fee/665d4fb5876c1bd9ca7dbd34`);
                const jsonData = await response.json();
                return jsonData.platform_amount;
            } catch (error) {
                console.error(`Error fetching data`);
            }
        },
    });

    const { isPending, data: cartProducts, error } = useQuery({
        queryKey: ['sidecart', open, uniqueToken],
        queryFn: async () => {
            let response = null;
            // console.log(uniqueToken)

            if (userId) {
                response = await fetch(`${import.meta.env.VITE_API_PATH}/carts/cart/${userId}`);
            } else {
                response = await fetch(`${import.meta.env.VITE_API_PATH}/carts/get-by-token/${uniqueToken}`);
            }

            const result = await response.json();
            return result?.cart;
        }
    });
    // console.log(cartProducts)
    // Function to handle quantity update
    const handleUpdateCart = async (cartId, quantity, item) => {
        setLoading(true)
        // console.log(item)

        // get the variaionDetails from given range
        const variation = await getSelectedVariationDetails(item.product_id, quantity);
        // console.log(variation);

        // calculate unit price of the product 
        let unitPrice = null;
        if (variation._id) {
            unitPrice = calculateUnitPrice(item.product_id, quantity, variation);
        } else {
            unitPrice = calculateUnitPrice(item.product_id, quantity);
        }

        console.log(unitPrice);
        // return;

        try {
            const total_price = quantity * unitPrice; // Calculate the new total price based on the updated quantity
            let response = null;
            if (userId) {
                response = await axios.put(`${import.meta.env.VITE_API_PATH}/carts/update-product/${userId}`, {
                    "product_item": {
                        "quantity": quantity,
                        "total_price": total_price,
                        "price": unitPrice,
                        "_id": cartId
                    }
                })
            } else {
                response = await axios.put(`${import.meta.env.VITE_API_PATH}/carts/update-product-token/${uniqueToken}`, {
                    "product_item": {
                        "quantity": quantity,
                        "total_price": total_price,
                        "price": unitPrice,
                        "_id": cartId
                    }
                })
            }

            if (response.status === 200) {
                queryClient.invalidateQueries(['sidecart', open]); // Invalidate queries to refetch cart data
            } else {
                console.error('Error on updating cart');
            }
        } catch (error) {
            console.error('Error on updating cart', error);
        }

        setLoading(false)
    };

    const handleRemoveFromCart = async (cartId) => {
        let response = null;
        try {
            if (userId) {
                response = await axios.put(`${import.meta.env.VITE_API_PATH}/carts/delete-product/${userId}`, {
                    item_id: cartId,
                    permanent: true
                })
            } else {
                response = await axios.put(`${import.meta.env.VITE_API_PATH}/carts/delete-product-token/${uniqueToken}`, {
                    item_id: cartId,
                    permanent: true
                })
            }
            if (response.status === 200) {
                queryClient.invalidateQueries(['sidecart', open]);
            } else {
                console.error('Error on removing from cart');
            }
        } catch (error) {
            console.error('Error on removing from cart', error);
        }
    };
    // console.log(cartProducts?.items?.map((item) => console.log(item)))

    const totalPrice = cartProducts?.items?.reduce((total, item) => {
        // Use sales_price if available, otherwise fallback to price
        const price = item.sales_price !== undefined && item.sales_price !== null ? item.sales_price : item.price || 0;
        // Multiply price by quantity for each item
        return total + (price * item.quantity);
    }, 0);

    const platformFeeAmount = platformFee?.percentage ? (platformFee?.percentage / 100) * totalPrice : 0;
    // console.log("Total Price:", totalPrice);
    // clear cart
    const handleClearCart = async () => {
        setLoadingDeletion(true)
        let response = null;
        try {
            if (userId) {
                response = await axios.delete(`${import.meta.env.VITE_API_PATH}/carts/clear-cart/${userId}`);
            } else {
                response = await axios.delete(`${import.meta.env.VITE_API_PATH}/carts/clear-cart-token/${uniqueToken}`);
            }


            if (response.status === 200) {
                queryClient.invalidateQueries(['sidecart', open]); // Refresh the cart data
            } else {
                console.error('Error on removing from cart');
            }
        } catch (error) {
            console.error('Error on removing from cart', error);
        } finally {
            setLoadingDeletion(false)
        }
    }

    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={setOpen}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-500"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-500"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden" >
                        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                            <Transition.Child
                                as={Fragment}
                                enter="transform transition ease-in-out duration-500 sm:duration-700"
                                enterFrom="translate-x-full"
                                enterTo="translate-x-0"
                                leave="transform transition ease-in-out duration-500 sm:duration-700"
                                leaveFrom="translate-x-0"
                                leaveTo="translate-x-full"
                            >
                                <Dialog.Panel className="pointer-events-auto w-screen max-w-md relative">
                                    <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                                        <div className="sm:px-4 px-2 fixed w-full bg-white z-20 py-6">
                                            <div className="flex items-center justify-start gap-3 w-full">
                                                <div className="flex items-center" >
                                                    <button
                                                        // title='close menu'
                                                        type="button"
                                                        className="rounded-md bg-white text-gray-700 hover:text-gray-800 focus:outline-none"
                                                        onClick={() => setOpen(false)}
                                                    >
                                                        <span className="sr-only">Close panel</span>
                                                        <TbLayoutSidebarRightCollapseFilled className={`h-6 w-6 ${cartProducts?.items?.length === 0 && 'animate-pulse'}`} />
                                                        {/* <HiXMark className="h-6 w-6" aria-hidden="true" /> */}
                                                    </button>
                                                </div>
                                                <Dialog.Title className={` font-semibold leading-6 text-gray-900 -mt-[1px] flex w-full items-center`}>
                                                    <div className=' text-nowrap'>
                                                        {t('sideover.ITEMS_IN_YOUR_CART')}
                                                    </div>
                                                    {
                                                        loadingDeletion == true ?
                                                            <HeaderLoader />
                                                            :
                                                            <GoTrash
                                                                className={`${currentLanguage == 'ar' ? 'ms-[10px]' : 'ms-[180px]'} cursor-pointer mt-1 hover:text-red-600 transition`}
                                                                title='Clear cart'
                                                                onClick={handleClearCart}
                                                            />
                                                    }
                                                </Dialog.Title>
                                            </div>
                                        </div>
                                        <div className='fixed pt-20 w-full max-w-[410px] min-w-[200px]  text-center ms-2 z-10 bg-white flex'>
                                            {
                                                ['cart', 'wishlist'].map((item, index) => {
                                                    return (
                                                        <p
                                                            onClick={() => {
                                                                setTab(item)
                                                            }}
                                                            className={`${tab == item && 'font-semibold border-green-600'} w-1/2 leading-6 text-gray-900 pb-2 cursor-pointer border-b-2 border-gray-100`}
                                                        >
                                                            {item.charAt(0).toUpperCase() + item.slice(1)}
                                                        </p>
                                                    )
                                                })
                                            }


                                        </div>
                                        {
                                            tab == 'cart' ? <>
                                                <div className="relative sm:mt-[140px] mt-[135px] flex-1 sm:px-4 px-2">
                                                    {isPending && <p>Loading...</p>}
                                                    {cartProducts?.items?.length === 0 &&
                                                        <p className='font-[500] ms-1 z-20'>
                                                            No product's left in cart!
                                                        </p>
                                                    }
                                                    {cartProducts && (
                                                        <div>
                                                            {cartProducts?.items?.map((item) => (
                                                                <div key={item._id} className="flex mb-4 shadow-md rounded-md relative">
                                                                    <img src={item?.product_id?.images[0]} alt={item.name.en} className="w-24 h-30 mr-4 object-contain rounded-s-md" />
                                                                    <div className='py-2 flex flex-col'>
                                                                        <p>{item.name.en}</p>
                                                                        <p className='my-1 text-tertiary-500'>
                                                                            <span > {item.quantity} </span>
                                                                            <span > x</span>
                                                                            <span > {item.price} = </span>
                                                                            <span className='font-[500]'> {item.quantity * item.price} </span>
                                                                            {/* <span className='font-[500]'>{item.quantity * item.price !== item?.total_price ? <><span className=' line-through'>{item.quantity * item.price}</span> {item?.total_price}</> : item.quantity * item.price}   </span> USD */}
                                                                        </p>
                                                                        <div className="flex items-center my-2">
                                                                            <button disabled={loading} onClick={() => handleUpdateCart(item._id, Math.max(1, item.quantity - 1), item)} className="text-sm bg-black text-white px-3 py-1 rounded">
                                                                                -
                                                                            </button>
                                                                            <span className="mx-2">
                                                                                {
                                                                                    loading ?
                                                                                        <div className='py-[6px] px-[1px]'>
                                                                                            <HeaderLoader />
                                                                                        </div> :
                                                                                        item.quantity
                                                                                }
                                                                            </span>
                                                                            <button disabled={loading} onClick={() => handleUpdateCart(item._id, item.quantity + 1, item)} className="text-sm bg-black text-white px-3 py-1 rounded">
                                                                                +
                                                                            </button>
                                                                            <button disabled={loading} onClick={() => handleRemoveFromCart(item._id)} className="ml-4 text-sm bg-red-500 text-white px-3 pb-[5px] pt-[2px]  rounded flex justify-center items-center">
                                                                                x
                                                                            </button>
                                                                        </div>

                                                                        {/* Add a button to remove the item from the cart */}
                                                                        {/* <RxCross2 onClick={() => handleRemoveFromCart(item._id)} className=" absolute top-2 right-4 w-6 h-6 rounded-full cursor-pointer transitionrounded-full p-1 bg-red-600 text-white">Remove</RxCross2> */}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className='sm:px-5 px-2 py-4'>
                                                    <PaymentInfo
                                                        subtotal={totalPrice}
                                                        shipping={shippingDestinationCost} //Number(shippingDestinationCost).toFixed(2)
                                                        platformFee={Number(platformFeeAmount)}
                                                        tax={calculateTaxAmount(Number(totalPrice), Number(shippingDestinationVat))}
                                                        discount={0}
                                                        showTaxField={true}
                                                        showPlatformFeeField={true}
                                                    />
                                                    <ShippingDestinationComponent shippingAndVats={shippingAndVats} subtotal={totalPrice} />
                                                </div>
                                                <button
                                                    onClick={() => navigate('/cart')}
                                                    className='bg-black mx-4 py-2 mb-3 text-white rounded-md flex gap-2 items-center justify-center'
                                                >
                                                    {t('sideover.go_to_cart')}
                                                    <MdDoubleArrow className='mt-[3px]' />
                                                </button>
                                            </> :
                                                <div className='mt-[130px]'>
                                                    <WishListSideOver />
                                                </div>
                                        }
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    )
}
