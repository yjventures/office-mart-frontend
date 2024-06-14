import React, { useState, useMemo, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import Stepper from 'src/components/User/Cart/Stepper/Stepper'
import Select from 'react-select'
import countryList from 'react-select-country-list'
import { atom, useAtomValue, useSetAtom } from 'jotai'
import DeliveryInput from 'src/components/User/DeliveryInfo/DeliveryInput'
import { showToast } from 'src/components/Common/Toastify/Toastify'
import { cartItemsAtom, userDestinationCost, userDestinationVat } from 'src/lib/jotai'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import { VscCloseAll } from "react-icons/vsc";
import { FaFileImport } from "react-icons/fa6";
import { shippingAndVat, shippingDestination } from 'src/lib/helper/dynamicData'
import PaymentInfo from 'src/components/User/Cart/CartSidebar/PaymentInfo'
import { useTranslation } from 'react-i18next'
import { BiImport } from 'react-icons/bi'
import { GoTrash } from 'react-icons/go'
import ShippingDestinationComponent from 'src/components/User/ShippingCost/ShippingCost'
import { calculateTaxAmount } from 'src/lib/helper/calculateTax'
import { BsArrowRightCircleFill } from 'react-icons/bs'
import { IoCheckmarkCircleSharp } from 'react-icons/io5'

const DeliveryInfo = () => {
    const navigate = useNavigate()
    const { t, i18n } = useTranslation()
    const currentLanguage = i18n.language;
    const setCartItems = useSetAtom(cartItemsAtom);
    const [voucher, setVoucher] = useState('')
    const [cartItems, setNewCartItems] = useState(JSON.parse(localStorage.getItem('cartItems')) || { items: [], sub_total: 0, tax: 0, total_price: 0 })
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')))
    const [comment, setComment] = useState('')
    const [subtotal, setSubtotal] = useState(Number(cartItems.sub_total).toFixed(2))
    const [discount, setDiscount] = useState(Number(cartItems?.discount).toFixed(2))

    const shippingDestinationCost = useAtomValue(userDestinationCost)
    const shippingDestinationVat = useAtomValue(userDestinationVat)


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

    const [isShippingAddressImported, setIsShippingAddressImported] = useState(false);
    const [isBillingAddressImported, setIsBillingAddressImported] = useState(false);
    // shipping address state
    const [shippingName, setShippingName] = useState(cartItems.shipping_address?.name || '')
    const [shippingEmail, setShippingEmail] = useState(cartItems.shipping_address?.email || '')
    const [shippingPhone, setShippingPhone] = useState(cartItems.shipping_address?.phone_no || '')
    const [shippingCompany, setShippingCompany] = useState(cartItems.shipping_address?.company || '')
    const [shippingZipCode, setShippingZipCode] = useState(cartItems.shipping_address?.zip || '')
    const [shippingCountry, setShippingCountry] = useState(cartItems.shipping_address?.country || 'Lebanon')
    const [shippingAddress1, setShippingAddress1] = useState(cartItems.shipping_address?.address1 || '')
    const [shippingAddress2, setShippingAddress2] = useState(cartItems.shipping_address?.address2 || '')
    // billing address state
    const [billingName, setBillingName] = useState(cartItems.billing_address?.name || '')
    const [billingEmail, setBillingEmail] = useState(cartItems.billing_address?.email || '')
    const [billingPhone, setBillingPhone] = useState(cartItems.billing_address?.phone_no || '')
    const [billingCompany, setBillingCompany] = useState(cartItems.billing_address?.company || '')
    const [billingZipCode, setBillingZipCode] = useState(cartItems.billing_address?.zip || '')
    const [billingCountry, setBillingCountry] = useState(cartItems.billing_address?.country || 'Lebanon')
    const [billingAddress1, setBillingAddress1] = useState(cartItems.billing_address?.address1 || '')
    const [billingAddress2, setBillingAddress2] = useState(cartItems.billing_address?.address2 || '')


    const { isPending, isError, error, data } = useQuery({
        queryKey: ['addresses', user?._id],
        queryFn: async () => {
            const res = await axios.get(`${import.meta.env.VITE_API_PATH}/addresses/get-all?user_id=${user?._id}`)
            return res?.data?.addresses;
        },
        // enabled: user?._id ? true : false
    })
    // console.log(isPending, isError, error, data)

    const [isAddressSelectorOpen, setIsAddressSelectorOpen] = useState(false);
    const [addressType, setAddressType] = useState(''); // 'shipping' or 'billing'

    // Function to open address selector with type
    const openAddressSelector = (type) => {
        setAddressType(type);
        setIsAddressSelectorOpen(true);
    };

    const AddressSelectorModal = ({ isOpen, addresses, onSelectAddress, onClose }) => {
        if (!isOpen) return null;

        return (
            <div className="fixed z-10 inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
                <div className="relative top-[30%] mx-auto p-5 border w-11/12 md:w-2/3 lg:w-1/2 shadow-lg rounded-md bg-white">
                    <div className="mt-3 text-center">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Select an Address</h3>
                        <div className="mt-2 px-7 py-3">
                            {
                                isPending ? <p>Loading your address information. Please wait..</p> : <>
                                    {
                                        (!addresses || addresses?.length === 0) &&
                                        <div>
                                            <p>No address found! Please add your information by clicking 'Add New' button</p>
                                        </div>
                                    }
                                    {addresses?.map((address, index) => (
                                        <div
                                            key={index}
                                            className="flex justify-between items-center flex-wrap gap-y-2 text-start py-4 px-3 rounded-sm text-gray-500 cursor-pointer mb-2 hover:bg-gray-100"
                                            style={{
                                                boxShadow: '0px 1px 3px 0px rgba(3, 0, 71, 0.09)'
                                            }}
                                            onClick={() => onSelectAddress(address)}
                                        >
                                            <p>{address.name}</p>
                                            <p>{address.address1}</p>
                                            <p>{address.phone_no}</p>
                                        </div>
                                    ))}
                                </>

                            }

                        </div>
                        <div className="items-center px-4 py-3 flex gap-3">
                            <button
                                id="ok-btn"
                                className="px-4 py-2 flex justify-center items-center gap-3 bg-red-600 text-white text-base font-medium rounded-md w-full transition shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                                onClick={onClose}
                            >
                                Close
                                <VscCloseAll className='w-5 h-5' />
                            </button>
                            <button
                                id="ok-btn"
                                className="px-4 py-2 flex justify-center items-center gap-3 bg-buttons text-white text-base font-medium rounded-md w-full transition shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                                onClick={() => {
                                    navigate('/address')
                                }}
                            >
                                Add New
                                <FaFileImport className='w-4 h-4' />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

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
    const [platformFeeAmount, setPlatformFeeAmount] = useState(platformFee?.percentage ? (platformFee?.percentage / 100) * subtotal : 0 || 0);

    useEffect(() => {
        setPlatformFeeAmount(platformFee?.percentage ? (platformFee?.percentage / 100) * subtotal : 0 || 0);
    }, [platformFee])
    // Function to handle address selection
    const handleAddressSelection = (selectedAddress) => {
        if (addressType === 'shipping') {
            // Update shipping address state with selected address
            setShippingName(selectedAddress.name);
            setShippingEmail(selectedAddress.email);
            setShippingPhone(selectedAddress.phone_no);
            setShippingCompany(selectedAddress.company);
            setShippingZipCode(selectedAddress.zip);
            setShippingCountry(selectedAddress.country);
            setShippingAddress1(selectedAddress.address1);
            setShippingAddress2(selectedAddress.address2);
            setIsShippingAddressImported(true);
        } else if (addressType === 'billing') {
            // Update billing address state with selected address
            setBillingName(selectedAddress.name);
            setBillingEmail(selectedAddress.email);
            setBillingPhone(selectedAddress.phone_no);
            setBillingCompany(selectedAddress.company);
            setBillingZipCode(selectedAddress.zip);
            setBillingCountry(selectedAddress.country);
            setBillingAddress1(selectedAddress.address1);
            setBillingAddress2(selectedAddress.address2);
            setIsBillingAddressImported(true);
        }
        setIsAddressSelectorOpen(false); // Close the selector
    };

    const clearAddressFields = (type) => {
        if (type === 'shipping') {
            setShippingName('');
            setShippingEmail('');
            setShippingPhone('');
            setShippingCompany('');
            setShippingZipCode('');
            setShippingCountry('Lebanon'); // Assuming 'Lebanon' as default
            setShippingAddress1('');
            setShippingAddress2('');
            setIsShippingAddressImported(false)
        } else if (type === 'billing') {
            setBillingName('');
            setBillingEmail('');
            setBillingPhone('');
            setBillingCompany('');
            setBillingZipCode('');
            setBillingCountry('Lebanon'); // Assuming 'Lebanon' as default
            setBillingAddress1('');
            setBillingAddress2('');
            setIsBillingAddressImported(false);
        }
    };
    // Checkbox state
    const [sameAsShipping, setSameAsShipping] = useState(false);
    // Function to handle checkbox change
    const handleCheckboxChange = () => {
        setSameAsShipping(!sameAsShipping);

        // If checked, copy shipping address to billing address
        if (!sameAsShipping) {
            setBillingName(shippingName);
            setBillingEmail(shippingEmail);
            setBillingPhone(shippingPhone);
            setBillingCompany(shippingCompany);
            setBillingZipCode(shippingZipCode);
            setBillingCountry(shippingCountry);
            setBillingAddress1(shippingAddress1);
            setBillingAddress2(shippingAddress2);
        } else {
            // Clear billing address fields if unchecked
            setBillingName('');
            setBillingEmail('');
            setBillingPhone('');
            setBillingCompany('');
            setBillingZipCode('');
            setBillingCountry('');
            setBillingAddress1('');
            setBillingAddress2('');
        }
    };

    const validateAllFields = () => {
        return (
            !!shippingName &&
            !!shippingEmail &&
            !!shippingPhone &&
            !!shippingZipCode &&
            !!shippingCountry &&
            !!shippingAddress1 &&
            !!billingName &&
            !!billingEmail &&
            !!billingPhone &&
            !!billingZipCode &&
            !!billingCountry &&
            !!billingAddress1
        );
    };

    const handleNextButton = () => {
        // Validate all fields before navigating
        let amountOfTax = calculateTaxAmount(Number(subtotal), Number(shippingDestinationVat))
        if (validateAllFields()) {
            setCartItems({
                ...cartItems,
                comment: comment ? comment : '',
                sub_total: Number(subtotal),
                platform_amount: Number(platformFeeAmount),
                shipping: Number(shippingDestinationCost),
                tax: Number(amountOfTax),
                discount: Number(discount),
                total_price: Number((parseFloat(subtotal) + parseFloat(shippingDestinationCost) + parseFloat(amountOfTax) + Number(platformFeeAmount) - parseFloat(discount)).toFixed(2)),
                shipping_address: {
                    address1: shippingAddress1,
                    address2: shippingAddress2,
                    zip: shippingZipCode,
                    country: shippingCountry,
                    phone_no: shippingPhone,
                    company: shippingCompany,
                    name: shippingName,
                    email: shippingEmail,
                    user_id: user?._id
                },
                billing_address: {
                    address1: billingAddress1,
                    address2: billingAddress2,
                    zip: billingZipCode,
                    country: billingCountry,
                    phone_no: billingPhone,
                    company: billingCompany,
                    name: billingName,
                    email: billingEmail,
                    user_id: user?._id
                }
            });

            navigate('/payment');
        } else {
            showToast('Please fill in all required fields.', 'error');
        }
    }
    useEffect(() => {
        setNewCartItems(JSON.parse(localStorage.getItem('cartItems')))
    }, [voucher])

    const handleApplyVoucher = async () => {
        // Check if voucher is valid
        // console.log(voucher)
        if (voucher) {
            // If invalid, show error message
            try {
                const res = await axios.post(`${import.meta.env.VITE_API_PATH}/promos/apply`, {
                    code: voucher
                })

                // console.log(res)
                if (res.status == 200) {
                    // console.log(res.data.voucher)
                    if (res.data.voucher.is_percent == true) {
                        // set discount
                        const discount = Number(cartItems.sub_total) * Number(res.data.voucher.percent) / 100;
                        const total_price = Number(cartItems.sub_total) + Number(cartItems.tax) - Number(discount);
                        setDiscount(discount)
                        setCartItems({
                            ...cartItems,
                            total_price: total_price,
                            discount: discount
                        });
                        setNewCartItems(JSON.parse(localStorage.getItem('cartItems')))
                    }
                    showToast('Voucher applied successfully.', 'success');
                } else {
                    showToast('Invalid voucher code.', 'error');
                }
            } catch (err) {
                showToast('Invalid voucher code.', 'error');
            }


        } else {
            showToast('Please enter a valid voucher code.', 'error');
        }
    }

    // console.log(parseFloat(discount) > 0)
    return (
        <div className='h-full p-3 font-main max-w-7xl mx-auto' dir={currentLanguage == 'ar' && 'rtl'}>
            <Stepper activeStep={1} />
            {/* Address Selector Modal */}
            <AddressSelectorModal
                isOpen={isAddressSelectorOpen}
                addresses={data} // Assuming 'data' is your list of addresses
                onSelectAddress={handleAddressSelection}
                onClose={() => setIsAddressSelectorOpen(false)}
            />
            <div className='grid grid-cols-1 md:grid-cols-6 gap-4'>
                {/* Shipping and billing address */}
                <div className='col-span-1 md:col-span-4 space-y-8'>
                    {/* shipping address */}
                    <div className='md:px-8 md:py-4' style={{
                        boxShadow: '0px 1px 3px 0px #03004717'
                    }}>
                        <div className='flex justify-between'>
                            <p className='font-[600] text-secondary-color'>{t('delivery.shipping_address')} </p>
                            <div className='flex items-center justify-start'>
                                <button
                                    className='text-white bg-buttons hover:bg-tertiary-500 px-3 py-1 rounded-full transition flex items-center gap-2'
                                    onClick={() => openAddressSelector('shipping')}
                                >
                                    <BiImport className='text-md' />
                                    {t('delivery.import_address')}
                                </button>
                                {isShippingAddressImported && (
                                    <button
                                        className='bg-red-600 hover:bg-red-500 mx-2 text-white px-3 py-1 rounded-full transition flex items-center gap-2'
                                        onClick={() => clearAddressFields('shipping')}
                                    >
                                        <GoTrash className='text-md' />
                                        {t('delivery.clear')}
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-x-10'>
                            <DeliveryInput type={'text'} label={currentLanguage == 'en' ? 'Full name' : 'الاسم الكامل'} value={shippingName} onChange={setShippingName} required={true} />
                            <DeliveryInput type={'email'} label={currentLanguage == 'en' ? 'Email Address' : 'عنوان البريد الإلكتروني'} value={shippingEmail} onChange={setShippingEmail} required={true} />
                            <DeliveryInput type={'number'} label={currentLanguage == 'en' ? 'Phone Number' : 'رقم الهاتف'} value={shippingPhone} onChange={setShippingPhone} required={true} />
                            <DeliveryInput type={'text'} label={currentLanguage == 'en' ? 'Company' : 'الشركة'} value={shippingCompany} onChange={setShippingCompany} required={false} />
                            <DeliveryInput type={'text'} label={currentLanguage == 'en' ? 'Zip Code' : 'الرمز البريدي'} value={shippingZipCode} onChange={setShippingZipCode} required={true} />
                            <DeliveryInput type={'text'} label={currentLanguage == 'en' ? 'Country' : 'البلد'} value={shippingCountry} onChange={setShippingCountry} required={true} />
                            <DeliveryInput type={'text'} label={currentLanguage == 'en' ? 'Address 1' : 'العنوان 1'} value={shippingAddress1} onChange={setShippingAddress1} required={true} />
                            <DeliveryInput type={'text'} label={currentLanguage == 'en' ? 'Address 2' : 'العنوان 2'} value={shippingAddress2} onChange={setShippingAddress2} required={false} />
                        </div>
                    </div>
                    {/* billing address */}
                    <div className='md:px-8 md:py-4' style={{
                        boxShadow: '0px 1px 3px 0px #03004717'
                    }}>
                        <div className='flex justify-between'>
                            <p className='font-[600] text-secondary-color'> {t('delivery.billing_address')} </p>
                            <div className='flex items-center justify-start'>
                                <button
                                    className='text-white bg-buttons hover:bg-tertiary-500 px-3 py-1 rounded-full transition flex items-center gap-2'
                                    onClick={() => openAddressSelector('billing')}
                                >
                                    <BiImport className='text-md' />
                                    {t('delivery.import_address')}
                                </button>
                                {isBillingAddressImported && (
                                    <button
                                        className='bg-red-600 hover:bg-red-500 mx-2 text-white px-3 py-1 rounded-full transition flex items-center gap-2'
                                        onClick={() => clearAddressFields('billing')}
                                    >
                                        <GoTrash className='text-md' />
                                        {t('delivery.clear')}
                                    </button>
                                )}
                            </div>

                        </div>
                        {/* checkbox for same as shipping address */}
                        <div className='flex gap-2 my-3 items-center' >
                            <input
                                type="checkbox"
                                className='w-4 h-4'
                                checked={sameAsShipping}
                                onChange={handleCheckboxChange}
                            />
                            <p className='text-secondary-color'>{t('delivery.same_as')} </p>
                        </div>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-x-10'>
                            <DeliveryInput type={'text'} label={currentLanguage == 'en' ? 'Full name' : 'الاسم الكامل'} value={billingName} onChange={setBillingName} required={true} />
                            <DeliveryInput type={'email'} label={currentLanguage == 'en' ? 'Email Address' : 'عنوان البريد الإلكتروني'} value={billingEmail} onChange={setBillingEmail} required={true} />
                            <DeliveryInput type={'number'} label={currentLanguage == 'en' ? 'Phone Number' : 'رقم الهاتف'} value={billingPhone} onChange={setBillingPhone} required={true} />
                            <DeliveryInput type={'text'} label={currentLanguage == 'en' ? 'Company' : 'الشركة'} value={billingCompany} onChange={setBillingCompany} required={false} />
                            <DeliveryInput type={'text'} label={currentLanguage == 'en' ? 'Zip Code' : 'الرمز البريدي'} value={billingZipCode} onChange={setBillingZipCode} required={true} />
                            <DeliveryInput type={'text'} label={currentLanguage == 'en' ? 'Country' : 'البلد'} value={billingCountry} onChange={setBillingCountry} required={true} />
                            <DeliveryInput type={'text'} label={currentLanguage == 'en' ? 'Address 1' : 'العنوان 1'} value={billingAddress1} onChange={setBillingAddress1} required={true} />
                            <DeliveryInput type={'text'} label={currentLanguage == 'en' ? 'Address 2' : 'العنوان 2'} value={billingAddress2} onChange={setBillingAddress2} required={false} />
                        </div>

                    </div>
                    {/* buttons */}
                    <div className='flex justify-between items-center gap-3'>
                        <button
                            className='ms-auto border-[1px] border-green-400 px-3 py-2 rounded-md text-tertiary-500 transition w-full md:max-w-[200px]'
                            onClick={() => {
                                navigate('/cart')
                            }}
                        >
                            {t('delivery.back')}
                        </button>
                        <button
                            className='bg-buttons text-primary-color px-3 py-2 rounded-md transition flex items-center justify-center gap-2 hover:bg-tertiary-500 w-full md:max-w-[200px]'
                            onClick={handleNextButton}
                        >
                            {t('delivery.next')}
                            <BsArrowRightCircleFill className='hover:animate-bounce' />
                        </button>
                    </div>

                </div>


                {/* cart info of right side*/}
                <div className="col-span-1 md:col-span-2 align-top">
                    <div className='flex flex-col gap-3 sm:p-7 p-2'>
                        <p className='text-secondary-color font-[600] mb-4'>{t('delivery.your_order')} </p>
                        {
                            cartItems?.items?.length === 0 && (
                                <div className='flex justify-center items-center h-[200px]'>
                                    <p className='text-gray-500'>No items in the cart</p>
                                </div>
                            )
                        }
                        {cartItems?.items?.map((item) => (
                            <div key={item._id} className='flex justify-between items-center text-[18px]'>
                                <div className='flex gap-2 items-start justify-start'>
                                    <p className={`text-gray-500 font-[600] text-nowrap`}>{item.quantity} x </p>
                                    <p className='text-gray-700 text-start'>{item?.name?.en}</p>
                                </div>
                                <p className='text-secondary-color'>${item?.total_price?.toFixed(2)}</p>
                            </div>
                        ))}

                        <hr className='w-full bg-gray-200 h-[2px] my-2' />
                        {/* payment info component */}
                        <PaymentInfo
                            subtotal={subtotal}
                            shipping={shippingDestinationCost}
                            platformFee={Number(platformFeeAmount)}
                            tax={calculateTaxAmount(subtotal, shippingDestinationVat)}
                            discount={discount}
                            showTaxField={true}
                            showPlatformFeeField={true}
                        />

                        {/* Additional Comments */}
                        <p className='text-gray-500 my-1 text-sm'> {t('cart.additional_comments')} </p>
                        {/* comments */}
                        <textarea
                            cols="30"
                            rows="5"
                            onChange={e => setComment(e.target.value)}
                            className='border-gray-200 border-2 rounded-lg outline-none p-2 w-full'
                        ></textarea>


                        {/* shipping place  */}
                        <ShippingDestinationComponent shippingAndVats={shippingAndVats} subtotal={subtotal} />

                        {/* vouchar */}
                        <div className='flex gap-2 items-center'>
                            <input
                                value={voucher}
                                onChange={(e) => setVoucher(e.target.value)}
                                type="text"
                                placeholder="Voucher Code"
                                className='w-full h-10 px-4 border-[1px] border-gray-300 rounded-md focus:outline-none focus:border-green-600'
                            />

                        </div>
                        <button
                            onClick={handleApplyVoucher}
                            disabled={parseFloat(discount) > 0}
                            className={`bg-buttons text-primary-color px-3 py-2 rounded-md hover:bg-tertiary-500 transition flex items-center gap-2 justify-center ${parseFloat(discount) > 0 && 'cursor-not-allowed'}`}
                        >
                            {
                                parseFloat(discount) > 0 ? t('delivery.applied') : t('delivery.apply')
                            }

                            <IoCheckmarkCircleSharp className='w-5 h-5' />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DeliveryInfo