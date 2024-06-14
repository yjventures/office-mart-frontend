import axios from 'axios'
import { useAtomValue } from 'jotai'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { showToast } from 'src/components/Common/Toastify/Toastify'
import Stepper from 'src/components/User/Cart/Stepper/Stepper'
import { userAtom } from 'src/lib/jotai'
import paymentGif from 'assets/user/payment/payment.gif'
import PaymentInfo from 'src/components/User/Cart/CartSidebar/PaymentInfo'
import { useTranslation } from 'react-i18next'
import { generalData, shippingAndVat } from 'src/lib/helper/dynamicData'
import { BsCheckCircleFill } from 'react-icons/bs'
import Disclimer from 'src/components/User/Disclimer/Disclimer'
import { TbTruckDelivery } from 'react-icons/tb'
import { GiDeliveryDrone } from "react-icons/gi";
import { VscAccount } from 'react-icons/vsc'
import { token } from 'src/lib/helper/uniqueTokenGenerator'


const Payment = () => {
    const navigate = useNavigate()
    const { t, i18n } = useTranslation()
    const currentLanguage = i18n.language;
    const cartItems = JSON.parse(localStorage.getItem('cartItems'))
    console.log(cartItems)
    const [loading, setLoading] = useState(false)
    const [loadingGuest, setLoadingGuest] = useState(false)
    // const [user, setuser] = useAtomValue(userAtom)
    const [user, setuser] = useState(JSON.parse(localStorage.getItem('user')) || null)
    const [uniqueToken, setUniqueToken] = useState(localStorage.getItem('unique_token') || null)
    // console.log(user)
    // console.log(uniqueToken)


    // console.log(releventData.cartId)
    const handlePlaceOrder = async () => {
        let new_unique_token = uniqueToken;

        if (user == null && uniqueToken == null) {
            new_unique_token = token();
            setUniqueToken(new_unique_token)
            localStorage.setItem('unique_token', new_unique_token)
        }
        if (user) {
            setLoading(true)
        } else {
            setLoadingGuest(true)
        }


        try {
            if (!cartItems?.userId) {
                cartItems.unique_token = new_unique_token;
            }

            const res = await axios.post(`${import.meta.env.VITE_API_PATH}/customer-orders/create`, {
                ...cartItems,
                payment_method: 'cash-on-delivery'
            })
            if (res.status == 200) {
                // senf email to guest userr
                if (!cartItems?.userId) {
                    const emailRes = await axios.post(`${import.meta.env.VITE_API_PATH}/emails/send-text`, {
                        "email": cartItems.billing_address.email,
                        "email_text": `
                        New order has been placed. Please track your order in this link
                        ${import.meta.env.VITE_FRONTEND_PATH}/guest-track-order/${res?.data?.order?._id}
                        Best regards, 
                        The ${generalData?.name} Team 
                    `,
                        "email_subject": "A new order has been placed",
                    });
                }


                if (!cartItems?.buy_now) {
                    let response = null;

                    if (user?._id) {
                        response = await axios.put(`${import.meta.env.VITE_API_PATH}/carts/delete-product/${user._id}`, {
                            // map here
                            item_id: cartItems.items.map(item => item._id),
                            permanent: false
                        })
                    } else {
                        // for guest
                        response = await axios.put(`${import.meta.env.VITE_API_PATH}/carts/delete-product-token/${new_unique_token}`, {
                            // map here
                            item_id: cartItems.items.map(item => item._id),
                            permanent: false
                        })
                    }

                    if (response.status === 200) {
                        // Collect all shop IDs from cart items
                        const shopIds = cartItems?.items?.map(item => item.shop_id._id);
                        // Initialize an array to hold the email addresses
                        const emailAddresses = [];
                        // Iterate over each shopId and collect email addresses
                        for (const shopId of shopIds) {
                            try {
                                // Make a request to get the user associated with the shop
                                const userRes = await axios.post(`${import.meta.env.VITE_API_PATH}/shops/get-user`, {
                                    "shop": shopId
                                });
                    
                                // Check if user has an email address and add to the array
                                if (userRes.data.user.email) {
                                    // console.log(userRes.data.user.email)
                                    emailAddresses.push(userRes.data.user.email);
                                }
                            } catch (error) {
                                console.error("Error getting user email:", error);
                            }
                        }
                    
                        // If there are any email addresses collected, send them in a single request
                        if (emailAddresses.length > 0) {
                            // console.log(emailAddresses)
                            try {
                                const emailRes = await axios.post(`${import.meta.env.VITE_API_PATH}/emails/send-multiple-email`, {
                                    "emails": emailAddresses,
                                    "email_text": `
                                        Hey vendor, we found one of your products has been ordered recently. Please check this out in your orders list.
                                        Best regards, 
                                        The ${generalData?.name} Team 
                                    `,
                                    "email_subject": "New order has been placed"
                                });
                                // console.log("Emails sent successfully:", emailRes.data);
                            } catch (error) {
                                console.error("Error sending emails:", error);
                            }
                        }
                    
                        navigate('/payment-success');
                        setLoading(false);
                    } else {
                        showToast('Error on removing from cart', 'info');
                        setLoading(false);
                    }
                } else {
                    navigate('/payment-success')
                    setLoading(false)
                }
            } else {
                showToast('Something went wrong', 'error')
                setLoading(false)
            }
        } catch (error) {
            console.log(error.response.data.message)
            showToast(error.response.data.message, 'info')
        } finally {
            setLoadingGuest(false)
            setLoading(false)
        }


    }


    const paymentMethods = [
        { id: 1, title: 'Cash on Delivery', description: 'Pay with cash upon delivery', disable: false },
        { id: 2, title: 'Visa Payment', description: 'Pay securely with your Visa card', disable: true },
        { id: 3, title: 'Stripe', description: 'Pay securely using Stripe', disable: true },
    ];

    function classNames(...classes) {
        return classes.filter(Boolean).join(' ');
    }

    function PaymentType() {
        const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(paymentMethods[0]);

        const handlePaymentMethodChange = (method) => {
            setSelectedPaymentMethod(method);
        };

        return (
            <div className='font-main w-full'>
                <p className="text-base font-semibold leading-6 text-gray-900">
                    Select a payment method
                </p>
                <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-3 sm:gap-x-4 relative ">
                    {paymentMethods.map((method) => (
                        <label
                            key={method.id}
                            className={classNames(
                                'relative flex cursor-pointer rounded-lg border p-4 shadow-sm focus:outline-none',
                                selectedPaymentMethod === method ? 'border-tertiary-600 ring-2 ring-tertiary-600' : 'border-gray-300',
                                method.disable == true ? 'bg-red-100' : 'bg-white'
                            )}
                        >
                            <input
                                type="radio"
                                className="sr-only"
                                value={method.id}
                                disabled={method.disable}
                                checked={selectedPaymentMethod.id === method.id}
                                onChange={() => {
                                    if (method.disable) {
                                        showToast('We are not offering currently', 'info')
                                    } else {
                                        handlePaymentMethodChange(method)
                                    }
                                }}
                            />
                            <div className="flex flex-col">
                                <span className="block text-sm font-medium text-gray-900">
                                    {method.title}
                                </span>
                                <p className="mt-1 flex items-center text-sm text-gray-500">
                                    {method.description}
                                </p>
                            </div>

                            {selectedPaymentMethod === method ?
                                <BsCheckCircleFill className="h-5 w-5 text-tertiary-600 absolute top-2 right-2" aria-hidden="true" />
                                : method?.disable && <p className='absolute top-2 right-4 text-[10px] bg-red-600 text-white px-2 py-[2px] rounded-full'>Unavailable</p>
                            }
                        </label>
                    ))}
                </div>
            </div>
        );
    }

    const LoadingIcon = () => {
        return (
            <div role="status">
                <svg aria-hidden="true" class="inline w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                </svg>
                <span class="sr-only">Loading...</span>
            </div>
        )
    }



    return (
        <div className='h-full p-3 font-main max-w-7xl mx-auto' dir={currentLanguage == 'ar' && 'rtl'}>
            <Stepper activeStep={2} />

            <div className='grid grid-cols-1 md:grid-cols-6 gap-4'>
                <div className='col-span-1 md:col-span-4 space-y-8'>
                    {/*payment address */}
                    <div
                        className='md:px-8 md:pt-4 pb-10 flex items-center justify-center flex-col'
                        style={{
                            boxShadow: '0px 1px 3px 0px #03004717'
                        }}
                    >
                        <PaymentType />
                    </div>

                    <Disclimer title={`Disclaimer`} text={`Products sold are solely the responsibility of individual vendors. We do not manufacture or endorse them. Any issues should be addressed directly with the vendor. We act solely as a platform for vendors.`} />

                    {
                        user ? <button
                            className='bg-tertiary-700 text-primary-color px-3 py-2 rounded-md hover:bg-buttons transition w-full'
                            onClick={handlePlaceOrder}
                        >
                            {
                                loading === true ? <LoadingIcon /> : <span>{t('payment.place_order')}</span>
                            }
                        </button> :
                            // if no user exist
                            <div className='flex gap-2'>
                                <button
                                    className='bg-buttons text-primary-color px-3 py-2 rounded-md hover:bg-buttons transition w-full'
                                    onClick={handlePlaceOrder}
                                >
                                    {
                                        loading === true ? <LoadingIcon /> :
                                            <p
                                                className='flex justify-center items-center gap-3'
                                                disabled={loading || loadingGuest}
                                            >
                                                Login to Place Order
                                                <TbTruckDelivery className='w-6 h-6' />
                                            </p>
                                    }

                                </button>
                                <button
                                    className='bg-buttons text-primary-color px-3 py-2 rounded-md hover:bg-buttons transition w-full'
                                    onClick={handlePlaceOrder}
                                >
                                    {
                                        loadingGuest === true ?
                                            <LoadingIcon /> :
                                            <p
                                                className='flex justify-center items-center gap-3'
                                                disabled={loading || loadingGuest}
                                            >
                                                Confim Guest Checkout
                                                <VscAccount className='w-5 h-5' />
                                            </p>
                                    }

                                </button>
                            </div>
                    }



                </div>


                {/* cart info of right side*/}
                <div className="col-span-1 md:col-span-2 align-top">
                    <div className='flex flex-col gap-3 px-7 py-12'>
                        <PaymentInfo
                            subtotal={Number(cartItems.sub_total).toFixed(2)}
                            shipping={Number(cartItems.shipping).toFixed(2)}
                            platformFee={Number(cartItems.platform_amount).toFixed(2)}
                            tax={Number(cartItems.tax).toFixed(2)}
                            discount={Number(cartItems.discount).toFixed(2)}
                            showTaxField={true}
                            showPlatformFeeField={true}
                        />

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Payment