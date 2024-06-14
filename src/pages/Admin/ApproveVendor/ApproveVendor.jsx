import React, { useState } from 'react'
import avatar from '../../../assets/admin/avatar.png'
import { IoCopy } from "react-icons/io5";
import { MdEmail } from "react-icons/md";
import { BsFillPhoneFill } from "react-icons/bs";
import { IoDocument } from "react-icons/io5";
import { useAtomValue } from 'jotai';
import { tokenAtom, viewVendorAtom } from '../../../lib/jotai';
import { BsThreeDotsVertical } from "react-icons/bs";
import { GoFile } from "react-icons/go";
import { IoEyeOutline } from "react-icons/io5";
import { FaPen } from "react-icons/fa6";
import { BsShareFill } from "react-icons/bs";
import { HiOutlineDownload } from "react-icons/hi";
import { MdDelete } from "react-icons/md";
import { IoCheckmarkDone } from "react-icons/io5";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { CiCircleRemove } from "react-icons/ci";
import { IoChatbubbles } from "react-icons/io5";
import { showToast } from '../../../components/Common/Toastify/Toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import VendorPageInfo from 'src/components/Vendor/VendorPage/VendorPageInfo';
import { useQuery } from '@tanstack/react-query';

const ApproveVendor = () => {
    const vendorView = useAtomValue(viewVendorAtom)
    const token = useAtomValue(tokenAtom)
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false)
    // console.log(vendorView)
    const [showPreview, setShowPreview] = useState(false)
    const [selectedFile, setSelectedFile] = useState(null)

    const { isPending, isError, error, data: shopInfo } = useQuery({
        queryKey: ['shopInfo', vendorView],
        queryFn: async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_PATH}/shops/get-all?name=${vendorView?.vendor_info?.shop?.name?.en}`)
                // console.log(response.data)
                return response?.data?.shop[0]
            } catch (error) {
                console.error(`Error fetching data`);
            }
        }
    })

    // data box component
    const DataBox = ({ icon, text, desc, isCopyable }) => {
        return (
            <div className='flex justify-between items-center px-3 py-2 mx-auto rounded-md w-full'>

                <div className='flex justify-start items-start'>
                    {
                        icon === 'email' ?
                            <MdEmail className='w-5 h-5 mr-1 text-gray-500 mt-[1px]' /> :
                            icon === 'phone' ?
                                <BsFillPhoneFill className='w-5 h-5 mr-1 text-gray-500 mt-[1px]' /> :
                                <IoDocument className='w-5 h-5 mr-1 text-gray-500 mt-[1px]' />
                    }
                    <div>
                        <p className='text-[14px] font-[500] text-gray-500'>
                            {text}
                        </p>
                        <p className='text-[12px] font-[500]'>
                            {desc}
                        </p>
                    </div>
                </div>
                {
                    isCopyable &&
                    <IoCopy className='text-gray-500 -mt-4 cursor-pointer' onClick={() => {
                        navigator.clipboard.writeText(desc)
                        showToast('Copied to clipboard', 'info')
                    }} />
                }

            </div>
        )
    }

    const handleToggleMenu = (file) => {
        setShowMenu(!showMenu)
        setSelectedFile(file)
        // console.log(file)
    }


    const handleVendorApprove = async () => {
        const response = await axios.put(`${import.meta.env.VITE_API_PATH}/users/update/${vendorView._id}`, {
            is_approved: true,
            is_rejected: false
        }, {
            headers: {
                Authorization: `Bearer ${token.accessToken}`
            }
        })
        if (response.status == 200) {
            showToast('Approved vendor successfully', 'success')
            // send notification to vendor
            const res = await axios.post(`${import.meta.env.VITE_API_PATH}/auth/send-multidevice-notification`,
                {
                    userId: vendorView._id,
                    message: {
                        "title": "Congratulations..",
                        "body": "Your vendor account has been approved successfully",
                    }
                },
            )

            // if (res.status == 200) {
            //     console.log('Notification sent successfully')
            // } else {
            //     console.log('Failed to send notification')
            // }

            navigate('/vendor-list')
        } else {
            showToast('Failed to approve! Please try again', 'error')
        }
    }

    const handleVendorRemoval = async () => {
        const response = await axios.put(`${import.meta.env.VITE_API_PATH}/users/update/${vendorView._id}`, {
            is_approved: false,
            is_rejected: true
        }, {
            headers: {
                Authorization: `Bearer ${token.accessToken}`
            }
        })
        // console.log(response.data)
        if (response.status == 200) {
            showToast('Removed approval successfully', 'success')
            const res = await axios.post(`${import.meta.env.VITE_API_PATH}/auth/send-multidevice-notification`,
                {
                    userId: vendorView._id,
                    message: {
                        "title": "Opps! You are not eligible to be a vendor",
                        "body": "We are sorry to inform you that you are rejected in our vendor varification process",
                    }
                },
            )

            // if (res.status == 200) {
            //     console.log('Notification sent successfully')
            // } else {
            //     console.log('Failed to send notification')
            // }
            navigate('/vendor-list')
        } else {
            showToast('Something went wrong, Please try again', 'error')
        }
    }


    const renderVendorChild = (doc, index) => (
        <div className='flex justify-between items-center flex-col w-full relativew-[230px] p-4 border-1 rounded-md bg-white' key={doc._id}>
            {/* upper side */}
            <div className='flex justify-end items-center w-full relative'>

                <BsThreeDotsVertical
                    className='cursor-pointer'
                    onClick={() => handleToggleMenu(doc._id)}
                />
                {showMenu && (doc._id == selectedFile) && (
                    <div className='absolute top-0 right-0 mt-5 w-[175px] bg-white rounded-md shadow-md'>
                        <p className='py-2 px-4 hover:bg-gray-100 cursor-pointer flex justify-between items-center'
                            onClick={() => {
                                // setShowPreview(true)
                                // open in new tab using google drive preview
                                window.open(`https://docs.google.com/gview?url=${encodeURIComponent(doc.file)}`, '_blank')
                                setShowMenu(false)
                            }}>
                            <span>
                                Open File
                            </span>
                            <IoEyeOutline className='w-5 h-5' />
                        </p>

                        <p className='py-2 px-4 hover:bg-gray-100 cursor-pointer flex justify-between items-center' onClick={() => {
                            window.open(doc?.file, '_blank')
                        }}>
                            <span>
                                Download File
                            </span>
                            <HiOutlineDownload className='w-5 h-5' />
                        </p>
                    </div>
                )}

                {/* {showPreview && (
                    <div className='fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex justify-center items-center'>
                        <div className='bg-white p-4 rounded-md'>
                            <p className='text-2xl font-bold'>Preview <span className='text-[12px] font-[400]'>it may take a little time based on file size</span></p>
                            <div className='flex justify-center items-center mt-4'>
                                <div className='w-[800px] h-[550px] border border-gray-300 rounded-md'>
                                    {doc?.file ? (
                                        <iframe
                                            title='File Preview'
                                            src={`https://docs.google.com/gview?url=${encodeURIComponent(doc.file)}&embedded=true`}
                                            width='100%'
                                            height='100%'
                                        />
                                    ) : (
                                        <p>Error: File URL is missing</p>
                                    )}
                                </div>
                            </div>
                            <div className='flex justify-end mt-4'>
                                <button
                                    onClick={() => {
                                        setShowPreview(false)
                                        setShowMenu(false)
                                        window.location.reload()
                                    }}
                                    className='bg-black text-primary-color px-4 py-2 rounded-md'
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )} */}

                {/* <p className='py-2 px-4 hover:bg-gray-100 cursor-pointer flex justify-between items-center'>
                            <span>
                                Edit File
                            </span>
                            <FaPen className='w-4 h-4 mr-1' />
                        </p> */}
                {/* <p className='py-2 px-4 hover:bg-gray-100 cursor-pointer flex justify-between items-center'>
                            <span>
                                Share File
                            </span>
                            <BsShareFill className='w-4 h-4 mr-1' />
                        </p> */}
                {/* <p className='py-2 px-4 hover:bg-gray-100 cursor-pointer flex justify-between items-center'>
                            <span>
                                Delete File
                            </span>
                            <MdDelete className='w-5 h-5' />
                        </p> */}
            </div>
            {/* lower side for file data */}
            <GoFile className='w-28 h-28 mt-6' />
            <p className='mt-3 text-gray-700'>
                {doc.name} {/* Replace 'File Name here' with the actual file name */}
            </p>
        </div>
    );

    const businessEmail = vendorView?.vendor_info?.business_email;
    const mailtoLink = businessEmail ? `mailto:${businessEmail}` : '#';

    return (
        <div className='w-full bg-gray-100 font-main pt-4'>
            <div className='flex justify-between items-center px-3 relative'>
                <p className='font-[500] fixed'>
                    Vendor Details
                </p>
                <div className='ms-auto'>
                    {
                        vendorView?.is_approved == true ?
                            <button
                                onClick={handleVendorRemoval}
                                className='bg-red-600 text-primary-color px-4 py-2 rounded-md flex items-center gap-1'>
                                <CiCircleRemove />
                                Reject Vendor
                            </button> :
                            <div className='flex gap-3'>
                                <button
                                    onClick={handleVendorApprove}
                                    className='transition bg-black hover:bg-buttons text-primary-color px-4 py-2 rounded-md flex items-center gap-1'>
                                    Mark Approved
                                    <IoCheckmarkDone />
                                </button>
                                {
                                    vendorView?.is_rejected === false && <button
                                        onClick={handleVendorRemoval}
                                        className='transition bg-red-700 hover:bg-red-600 text-primary-color px-4 py-2 rounded-md flex items-center gap-1'>
                                        <CiCircleRemove />
                                        Reject Vendor
                                    </button>
                                }


                            </div>
                    }
                </div>

            </div>
            {/* grid grid-cols-1 lg:grid-cols-4 gap-3 */}
            {/* info part */}
            <div className='py-7 flex justify-center items-center flex-col gap-1 bg-white p-3 mx-auto my-2 rounded-md fixed ms-2 min-w-[300px]' >
                {
                    vendorView?.image ?
                        <img src={vendorView?.image} alt="image" className='w-[100px] h-[100px] rounded-full object-contain' /> :
                        <div className='w-[100px] h-[100px] rounded-full bg-gray-300 flex justify-center items-center object-contain'>
                            <p className='text-[40px] text-gray-500'>{vendorView?.firstname?.charAt(0)}</p>
                        </div>
                    // <img src={avatar} alt="image" className='w-[160px] h-[160px] rounded-full' />
                }

                <p className='text-[20px] font-[600] mt-3'> {vendorView?.firstname + ' ' + vendorView?.lastname} </p>
                <p className='text-sm'>{vendorView?.email}</p>

                <hr className='h-[3px] bg-gray-100 w-full my-6' />
                <DataBox icon='email' text='Business email' desc={`${vendorView?.vendor_info?.business_email}`} isCopyable={true} />
                <DataBox icon='phone' text='Phone' desc={`${vendorView?.vendor_info?.business_phone_no}`} isCopyable={true} />
                <DataBox icon='company' text='Company Name' desc={`${vendorView?.vendor_info?.business_name}`} isCopyable={false} />
                <DataBox icon='reg' text='Registration No' desc={`${vendorView?.vendor_info?.business_reg_number}`} isCopyable={false} />
                <DataBox icon='address' text='Address' desc={`${vendorView?.vendor_info?.region}`} isCopyable={false} />

                <div className='flex justify-between items-center w-full px-2 mt-3 gap-2'>
                    <button onClick={() => {
                        if (businessEmail) {
                            window.location.href = mailtoLink;
                        }
                    }}
                        className='text-[14px] font-[500] bg-gray-200 px-7 py-2 flex items-center gap-1 rounded-md w-1/2'>
                        <MdEmail /> Email
                    </button>
                    <button className='text-[14px] font-[500] bg-black text-primary-color px-7 py-2 flex items-center gap-1 rounded-md w-1/2'>
                        <IoChatbubbles /> Chat
                    </button>
                </div>
            </div>
            {/* docs part */}
            {/* col-span-1 lg:col-span-3 w-[98%] */}
            <div className='pb-4 pt-2 rounded-md mx-auto px-4 ms-[320px] min-h-[92vh]'>
                {/* make 3 col grid */}
                <div className='grid grid-cols-1 lg:grid-cols-3 gap-3'>
                    {
                        vendorView?.vendor_info?.docs?.map((doc) => renderVendorChild(doc))
                    }
                </div>
                <div >
                    {
                        shopInfo ?
                            <div>
                                <div class="bg-tertiary-100 border-t-4 border-teal-500 rounded-b text-teal-900 px-4 py-3 shadow-md my-6" role="alert">
                                    <div class="flex">
                                        <div class="py-1"><svg class="fill-current h-6 w-6 text-tertiary-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" /></svg></div>
                                        <div>
                                            <p class="font-bold">Shop information available</p>
                                            <p class="text-sm">Remember you are an admin! Make sure you do not buy or add to cart any product! That may suspend your capability..</p>
                                        </div>
                                    </div>
                                </div>
                                <VendorPageInfo
                                    id={shopInfo?._id}
                                    banner={shopInfo?.banner}
                                    logo={shopInfo?.logo}
                                    name={shopInfo?.name}
                                    desc={shopInfo?.description}
                                    region={shopInfo?.region}
                                    phone={shopInfo?.phone}
                                    links={shopInfo?.links}
                                    adminView={true}
                                />
                            </div>
                            :
                            <div className='my-10'>
                                Shop information not available of that vendor!
                            </div>

                    }

                </div>
            </div>
        </div>

    )
}

export default ApproveVendor