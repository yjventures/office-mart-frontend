import React, { useState } from 'react'
import { IoChatbubbles, IoReorderThreeOutline } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import ProfileSidebar from 'src/components/Profile/ProfileSidebar/ProfileSidebar'
import { FaLocationDot } from "react-icons/fa6";
import DeliveryInput from 'src/components/User/DeliveryInfo/DeliveryInput';
import { showToast } from 'src/components/Common/Toastify/Toastify';
import axios from 'axios';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { MdModeEditOutline } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { useTranslation } from 'react-i18next';

const Address = () => {
    const [showSidebar, setShowSidebar] = React.useState(false)
    const [showNewAddressFields, setShowNewAddressFields] = useState(false)
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const user = JSON.parse(localStorage.getItem('user'))
    const { t, i18n } = useTranslation()
    const currentLanguage = i18n.language;

    const [addressId, setAddressId] = useState('')
    const [billingName, setBillingName] = useState('')
    const [billingEmail, setBillingEmail] = useState('')
    const [billingPhone, setBillingPhone] = useState('')
    const [billingCompany, setBillingCompany] = useState('')
    const [billingZipCode, setBillingZipCode] = useState('')
    const [billingCountry, setBillingCountry] = useState('Lebanon')
    const [billingAddress1, setBillingAddress1] = useState('')
    const [billingAddress2, setBillingAddress2] = useState('')


    const { isPending, isError, error, data } = useQuery({
        queryKey: ['addresses', user._id],
        queryFn: async () => {
            const res = await axios.get(`${import.meta.env.VITE_API_PATH}/addresses/get-all?user_id=${user?._id}`)

            return res?.data?.addresses;
        }
    })
    // console.log(isPending, isError, error, data)

    // add address of an user
    const handleAddressAdd = async () => {

        if (!billingName || !billingEmail || !billingPhone || !billingZipCode || !billingCountry || !billingAddress1) {
            showToast('Please fillup the form')
            return;
        }

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_PATH}/addresses/create`,
                {
                    name: billingName,
                    address1: billingAddress1,
                    phone_no: billingPhone,
                    zip: billingZipCode,
                    country: billingCountry,
                    email: billingEmail,
                    company: billingCompany,
                    address2: billingAddress2,
                    user_id: user?._id
                },
                {
                    headers: {
                        Authorization: `Bearer ${JSON.parse(localStorage.getItem('token')).accessToken}`
                    }
                })

            // console.log(response.data)
            if (response.status === 200) {
                queryClient.invalidateQueries({ queryKey: ['addresses'] });
                showToast('Address added successfully', 'success')
            } else {
                showToast('Error adding address', 'error')
            }

        } catch (error) {
            console.error(error)
            showToast('Something went wrong', 'error')
        }
        setShowNewAddressFields(false)

    }

    // update address
    const handleAddressUpdate = async () => {

        if (!billingName || !billingEmail || !billingPhone || !billingZipCode || !billingCountry || !billingAddress1) {
            showToast('Please fillup the form')
            return;
        }

        try {
            const response = await axios.put(`${import.meta.env.VITE_API_PATH}/addresses/update/${addressId}`,
                {
                    name: billingName,
                    address1: billingAddress1,
                    phone_no: billingPhone,
                    zip: billingZipCode,
                    country: billingCountry,
                    email: billingEmail,
                    company: billingCompany,
                    address2: billingAddress2,
                    user_id: user?._id
                },
                {
                    headers: {
                        Authorization: `Bearer ${JSON.parse(localStorage.getItem('token')).accessToken}`
                    }
                })

            // console.log(response.data)
            if (response.status === 200) {
                queryClient.invalidateQueries({ queryKey: ['addresses'] });
                showToast('Address updated successfully', 'success')
            } else {
                showToast('Error updating address', 'error')
            }

        } catch (error) {
            console.error(error)
            showToast('Something went wrong', 'error')
        }

        setShowNewAddressFields(false)
    }

    // delete address
    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`${import.meta.env.VITE_API_PATH}/addresses/delete/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${JSON.parse(localStorage.getItem('token')).accessToken}`
                    }
                })

            if (response.status === 200) {
                queryClient.invalidateQueries({ queryKey: ['addresses'] });
                showToast('Address deleted successfully', 'success')
            } else {
                showToast('Error deleting address', 'error')
            }

        } catch (error) {
            console.error(error)
            showToast('Something went wrong', 'error')
        }
    }


    const handleEdit = (address) => {
        setAddressId(address._id)
        setBillingName(address.name);
        setBillingEmail(address.email);
        setBillingPhone(address.phone_no);
        setBillingCompany(address.company || ''); // Assuming company is optional
        setBillingZipCode(address.zip);
        setBillingCountry(address.country);
        setBillingAddress1(address.address1);
        setBillingAddress2(address.address2 || ''); // Assuming address2 is optional
        setShowNewAddressFields(true);
        // console.log('Editing address:', address.name); // Debug log
    };



    return (
        <div className='h-full p-3 font-main lg:-ms-10'>
            <div className='lg:flex justify-between items-center relative my-2'>
                <div className='flex items-center'>
                    <FaLocationDot className='w-5 h-5 text-tertiary-600' />
                    <p className='text-xl font-bold ms-2'>{t('address.title')}</p>
                </div>
                <div className={`lg:hidden absolute top-0 ${currentLanguage == 'ar' ? 'left-2' : 'right-2'}`}>
                    <IoReorderThreeOutline className='w-[20px] h-[20px] cursor-pointer' onClick={() => setShowSidebar(!showSidebar)} />
                </div>
                {showSidebar && <div className='lg:hidden'><ProfileSidebar /></div>}
                <button
                    onClick={() => {
                        setAddressId('')
                        setShowNewAddressFields(!showNewAddressFields)

                    }}
                    className='border-2 border-tertiary-600 px-[20px] py-[6px] rounded-sm text-[16px] font-[600] text-tertiary-600 hover:bg-tertiary-600 hover:text-primary-color transition my-4 lg:mt-0'>
                    {
                        showNewAddressFields ? `${t('address.discard')}` : `${t('address.add_new')}`
                    }
                </button>
            </div>
            {/* Display address */}
            <div className='flex flex-col gap-2'>
                {
                    showNewAddressFields &&
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-x-10'>
                        <DeliveryInput type={'text'} label={t('address.full_name')} value={billingName} onChange={setBillingName} required={true} />
                        <DeliveryInput type={'email'} label={t('address.email')} value={billingEmail} onChange={setBillingEmail} required={true} />
                        <DeliveryInput type={'number'} label={t('address.phone')} value={billingPhone} onChange={setBillingPhone} required={true} />
                        <DeliveryInput type={'text'} label={t('address.company')} value={billingCompany} onChange={setBillingCompany} required={false} />
                        <DeliveryInput type={'text'} label={t('address.zip')} value={billingZipCode} onChange={setBillingZipCode} required={true} />
                        <DeliveryInput type={'text'} label={t('address.country')} value={billingCountry} onChange={setBillingCountry} required={true} />
                        <DeliveryInput type={'text'} label={t('address.address1')} value={billingAddress1} onChange={setBillingAddress1} required={true} />
                        <DeliveryInput type={'text'} label={t('address.address2')} value={billingAddress2} onChange={setBillingAddress2} required={false} />

                        {
                            addressId ?
                                <button
                                    className='bg-buttons text-white hover:bg-tertiary-600 hover:text-white transition rounded-sm py-2 my-4'
                                    onClick={handleAddressUpdate}
                                >
                                    {t('address.update')}
                                </button>
                                :
                                <button
                                    className='bg-buttons text-white rounded-sm py-2 my-4'
                                    onClick={handleAddressAdd}
                                >
                                    {t('address.confirm')}
                                </button>
                        }
                    </div>
                }
                {
                    isPending && <p>Loading addresses..</p>
                }
                {
                    data?.length === 0 && <p>No saved address found</p>
                }
                {
                    data?.map((address, index) => {
                        return (
                            <div
                                key={index}
                                className='flex justify-between items-center py-4 px-3 rounded-sm text-gray-500'
                                style={{
                                    'boxShadow': '0px 1px 3px 0px #03004717'
                                }}
                            >
                                <p>
                                    {address.name}
                                </p>
                                <p>
                                    {address.address1}
                                </p>
                                <p>
                                    {address.phone_no}
                                </p>
                                <p className='flex justify-center gap-3 items-start w-[100px]'>
                                    <MdModeEditOutline
                                        className='w-7 h-7 cursor-pointer hover:bg-tertiary-300 rounded-full p-[4px] transition'
                                        onClick={() => handleEdit(address)}
                                    />
                                    <MdDelete className='w-7 h-7 cursor-pointer hover:bg-red-100 rounded-full p-[4px] transition'
                                        onClick={() => handleDelete(address._id)}
                                    />
                                </p>
                            </div>
                        )
                    })
                }
            </div>
        </div >
    )
}

export default Address