import React, { useEffect, useState } from 'react'
import { IoMdSearch } from "react-icons/io";
import { FaPlus } from "react-icons/fa6";
import eye from '../../../assets/admin/eye.svg'
import deleteIcon from '../../../assets/admin/delete.svg'
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useAtomValue, useSetAtom } from 'jotai';
import { tokenAtom, viewVendorAtom } from '../../../lib/jotai';
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { AiFillDelete } from "react-icons/ai";
import { parse } from 'postcss';
import { useLocation, useNavigate } from 'react-router-dom';
import { showToast } from '../../../components/Common/Toastify/Toastify';
import PaginationComponent from '../../../components/Admin/Pagination/PaginationComponent';
import AdminHeader from 'src/components/Admin/AdminHeader/AdminHeader';
import DeleteVendorModal from 'src/components/Admin/DeleteVendorModal/DeleteVendorModal';


const VendorList = () => {
    const token = useAtomValue(tokenAtom)
    const setViewVendor = useSetAtom(viewVendorAtom)
    // console.log(token)
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const location = useLocation();
    // console.log(JSON.parse(localStorage.getItem('token')).accessToken)
    const [is_approved, setIsApproved] = useState(false)
    const [limit, setLimit] = useState(10)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)

    const [searchTerm, setSearchTerm] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [vendorIdToDelete, setVendorIdToDelete] = useState(null);

    const handleDeleteClick = (vendorId) => {
        setVendorIdToDelete(vendorId);
        setShowDeleteModal(true);
    };

    // Determine the API parameters based on the current route
    let apiParams = '';
    if (location.pathname.includes('pending-vendor-list')) {
        apiParams = 'is_approved=false&is_rejected=false';
    } else if (location.pathname.includes('approved-vendor-list')) {
        apiParams = 'is_approved=true';
    } else if (location.pathname.includes('rejected-vendor-list')) {
        apiParams = 'is_rejected=true';
    }

    // Function to handle page change
    const handlePageChange = (pageNumber) => {
        setPage(pageNumber);
    };


    const { isPending, isError, error, data } = useQuery({
        queryKey: ['users', { is_approved, page, limit, apiParams }],
        queryFn: async () => {
            try {
                // const response = await fetch(`${import.meta.env.VITE_API_PATH}/users/get-all?is_approved=${is_approved}&type=vendor`, {
                const response = await fetch(`${import.meta.env.VITE_API_PATH}/users/get-all?${apiParams}&type=vendor&page=${page}&limit=${limit}`, {
                    headers: {
                        Authorization: `Bearer ${JSON.parse(localStorage.getItem('token')).accessToken}`
                    }
                });

                const jsonData = await response.json();
                setTotalPages(Math.ceil(jsonData?.total / limit))
                return jsonData.users; // Access the 'users' array directly
            } catch (error) {
                console.error(`Error fetching data`);
            }
        },
    });
    // // set total pages
    // useEffect(() => {
    //     setTotalPages(Math.ceil(data?.length / limit))
    // }, [data])

    // if (isPending) return <p>Loading...</p>
    // if (isError) return <p>{error}</p>
    // console.log(data)
    const handleDeleteVendor = (id) => async () => {
        // console.log(id)
        const response = await axios.delete(`${import.meta.env.VITE_API_PATH}/users/delete/${id}`, {
            headers: {
                Authorization: `Bearer ${token.accessToken}`
            }
        })
        // console.log(response)
        if (response.status == 200) {
            showToast('Vendor deleted successfully', 'success')
            queryClient.invalidateQueries({ queryKey: ['users'] });
        } else {
            showToast('Something went wrong, Please try again', 'error')
        }
    }


    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
    }

    // pagination
    // Filter data based on search term
    const filteredData = data?.filter(user =>
        user?.vendor_info?.business_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // console.log(data)

    return (
        <>
            <AdminHeader
                browseWebsite={true}
                addNew={false}
                notification={true}
                profile={true}
                search={true}
                setSearch={setSearchTerm}
                nameOfSearching={'business name'}
            />
            <div className='bg-gray-100 p-4 rounded-md font-main'>
                <div className='flex justify-between items-center px-2'>
                    <p className='font-[600]'>{is_approved == false ? 'Pending' : 'Approved'} Vendor List</p>
                    <div className='flex items-center gap-2'>
                        <p>Filter by</p>
                        <select
                            className='py-1 px-2 appearance-none rounded-md cursor-pointer outline-none'
                            onChange={(e) => {
                                if (e.target.value == 'pending') {
                                    navigate('/pending-vendor-list')
                                } else if (e.target.value == 'approved') {
                                    navigate('/approved-vendor-list')
                                } else if (e.target.value == 'rejected') {
                                    navigate('/rejected-vendor-list')
                                } else {
                                    navigate('/vendor-list')
                                }
                            }}
                        >
                            {
                                ['All Vendors', 'pending', 'approved', 'rejected'].map((item, index) => {
                                    return (
                                        <option value={item} key={index}>{item.charAt(0).toUpperCase() + item.slice(1)}</option>
                                    )
                                })
                            }
                        </select>
                    </div>

                </div>

                {/* table for vendors */}
                <div className="sm:px-6 lg:px-1 ">
                    <div className="-mx-4 mt-6 ring-1 ring-gray-300 sm:mx-0 sm:rounded-lg bg-white">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead>
                                <tr>
                                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 lg:table-cell">
                                        Company Name
                                    </th>
                                    <th
                                        scope="col"
                                        className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                                    >
                                        Business Phone No
                                    </th>
                                    <th
                                        scope="col"
                                        className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                                    >
                                        Business Email
                                    </th>
                                    <th
                                        scope="col"
                                        className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                                    >
                                        {/* Wallet Balance */}
                                        Registration Number
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        {/* No of Orders */}
                                        Main Category
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        Status
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                        Action
                                    </th>

                                </tr>
                            </thead>
                            <tbody>
                                {
                                    isPending && (
                                        <tr>
                                            <td colSpan='6' className='text-center py-4'>Loading...</td>
                                        </tr>
                                    )
                                }
                                {
                                    data?.length === 0 && (
                                        <tr>
                                            <td colSpan='6' className='text-center py-4'>No vendor information available</td>
                                        </tr>
                                    )
                                }
                                {filteredData?.map((user, userIndex) => (
                                    <tr key={user._id}>
                                        <td
                                            className={classNames(
                                                userIndex === 0 ? '' : 'border-t border-gray-200',
                                                'relative py-4 pl-4 pr-3 text-sm sm:pl-6'
                                            )}
                                        >
                                            <div className="font-medium text-gray-900">
                                                {user?.vendor_info?.business_name}
                                            </div>
                                        </td>
                                        <td
                                            className={classNames(
                                                userIndex === 0 ? '' : 'border-t border-gray-200',
                                                'hidden px-3 py-3.5 text-sm text-gray-500 lg:table-cell'
                                            )}
                                        >
                                            {user?.vendor_info?.business_phone_no}
                                        </td>
                                        <td
                                            className={classNames(
                                                userIndex === 0 ? '' : 'border-t border-gray-200',
                                                'hidden px-3 py-3.5 text-sm text-gray-500 lg:table-cell'
                                            )}
                                        >
                                            {user?.vendor_info?.business_email}
                                        </td>
                                        <td
                                            className={classNames(
                                                userIndex === 0 ? '' : 'border-t border-gray-200',
                                                'hidden px-3 py-3.5 text-sm text-gray-500 lg:table-cell'
                                            )}
                                        >
                                            {user?.vendor_info?.business_reg_number}
                                        </td>
                                        <td
                                            className={classNames(
                                                userIndex === 0 ? '' : 'border-t border-gray-200',
                                                'px-3 py-3.5 text-sm text-gray-500'
                                            )}
                                        >
                                            {user?.vendor_info?.main_category?.name ?? 'N/A'}
                                        </td>
                                        <td
                                            className={classNames(
                                                userIndex === 0 ? '' : 'border-t border-gray-200',
                                                'px-3 py-3.5 text-sm text-gray-500'
                                            )}
                                        >
                                            {
                                                user?.is_rejected == true ?
                                                    <span className='bg-red-500 text-white px-3 py-1 rounded-full text-[11px]'>REJECTED</span>
                                                    : user?.is_approved == true ? <span className='bg-tertiary-500 text-white px-3 py-1 text-[10px] rounded-full'>APPROVED</span> :
                                                        <span className='bg-blue-500 text-white px-3 py-1 rounded-full text-[11px]'>PENDING</span>
                                            }
                                        </td>
                                        <td
                                            className={classNames(
                                                userIndex === 0 ? '' : 'border-t border-gray-200',
                                                'relative py-3.5 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 flex justify-center items-center gap-2'
                                            )
                                            }
                                        >
                                            {/* view and delete */}
                                            <MdOutlineRemoveRedEye
                                                onClick={() => {
                                                    setViewVendor(user)
                                                    navigate(`/approve-vendor`)
                                                }}
                                                className='mr-2 cursor-pointer w-5 h-5'
                                            />

                                            <AiFillDelete
                                                onClick={() => handleDeleteClick(user?._id)}
                                                className='mr-2 cursor-pointer w-5 h-5'
                                            />
                                            {showDeleteModal && (
                                                <DeleteVendorModal
                                                    setShowDeleteModal={setShowDeleteModal}
                                                    apiEndpoint={`${import.meta.env.VITE_API_PATH}/users/delete/${vendorIdToDelete}`}
                                                />
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>


                        </table>
                        {/* pagination */}
                        <PaginationComponent
                            currentPage={page}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                </div>
            </div>
        </>

    )
}

export default VendorList