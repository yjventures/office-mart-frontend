import React, { useEffect, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useAtomValue, useSetAtom } from 'jotai';
import { tokenAtom, viewVendorAtom } from 'lib/jotai';
import { AiFillDelete } from "react-icons/ai";
import { useLocation, useNavigate } from 'react-router-dom';
import { showToast } from 'components/Common/Toastify/Toastify';
import PaginationComponent from 'components/Admin/Pagination/PaginationComponent';
import { RxAvatar } from "react-icons/rx";
import AdminHeader from 'src/components/Admin/AdminHeader/AdminHeader';
import DeleteVendorModal from 'src/components/Admin/DeleteVendorModal/DeleteVendorModal';

const CustomerList = () => {
    const token = useAtomValue(tokenAtom)
    // console.log(token)
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const location = useLocation()
    // console.log(JSON.parse(localStorage.getItem('token')).accessToken)
    const [is_verified, setIs_verified] = useState(true)
    const [limit, setLimit] = useState(10)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    const [search, setSearch] = useState('')
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [vendorIdToDelete, setVendorIdToDelete] = useState(null);

    const handleDeleteClick = (vendorId) => {
        setVendorIdToDelete(vendorId);
        setShowDeleteModal(true);
    };
    // Determine the API parameters based on the current route
    let apiParams = '';
    if (location.pathname.includes('unvarified-customer-list')) {
        apiParams = '&is_verified=false';
    } else if (location.pathname.includes('varified-customer-list')) {
        apiParams = '&is_verified=true';
    }
    // Function to handle page change
    const handlePageChange = (pageNumber) => {
        setPage(pageNumber);
    };


    const { isPending, isError, error, data } = useQuery({
        queryKey: ['customers', { is_verified, page, limit, location }],
        queryFn: async () => {
            try {
                // const response = await fetch(`${import.meta.env.VITE_API_PATH}/users/get-all?is_approved=${is_approved}&type=vendor`, {
                const response = await fetch(`${import.meta.env.VITE_API_PATH}/users/get-all?type=customer&page=${page}&limit=${limit}${apiParams}`, {
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
    // set total pages
    // useEffect(() => {
    //     setTotalPages(Math.ceil(data?.length / limit))
    // }, [data])

    // if (isPending) return <p>Loading...</p>
    // if (isError) return <p>{error}</p>
    // console.log(data, 'cusotmer')
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
    // console.log(search)

    return (
        <div className='font-main'>
            <AdminHeader
                browseWebsite={true}
                addNew={false}
                search={true}
                notification={true}
                profile={true}
                setSearch={setSearch}
                nameOfSearching={'customers'}
            />
            <div className='rounded-md bg-gray-100 py-4 px-3'>
                <p className='font-[600] px-4'>Customer List</p>
                {/* table for vendors */}
                <div className="sm:px-6 lg:px-1 px-4 -mt-3">
                    <div className="-mx-4 mt-10 ring-1 ring-gray-300 sm:mx-0 sm:rounded-lg bg-white">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead>
                                <tr>
                                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 lg:table-cell">
                                        User
                                    </th>

                                    <th
                                        scope="col"
                                        className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                                    >
                                        Email
                                    </th>
                                    <th
                                        scope="col"
                                        className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                                    >
                                        {/* Wallet Balance */}
                                        Verification status
                                    </th>
                                    {/* <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    Main Category
                                </th> */}
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
                                            <td colSpan='6' className='text-center py-4'>No Customer Found</td>
                                        </tr>
                                    )
                                }
                                {data
                                    ?.filter((user) => user?.firstname.toLowerCase().includes(search.toLocaleLowerCase()))
                                    ?.map((user, userIndex) => (
                                        <tr key={user._id}>
                                            <td
                                                className={classNames(
                                                    userIndex === 0 ? '' : 'border-t border-gray-200',
                                                    'relative py-4 pl-4 pr-3 text-sm sm:pl-6'
                                                )}
                                            >
                                                <div className="font-medium text-gray-900 flex items-center justify-start gap-2">
                                                    {
                                                        user?.image ? <img src={user?.image} alt='image' className='w-7 h-7 border-2 rounded-full' />
                                                            : <RxAvatar className='w-7 h-7 text-gray-400' />
                                                    }
                                                    {user?.firstname} {user?.lastname}
                                                </div>
                                            </td>

                                            <td
                                                className={classNames(
                                                    userIndex === 0 ? '' : 'border-t border-gray-200',
                                                    'hidden px-3 py-3.5 text-sm text-gray-500 lg:table-cell'
                                                )}
                                            >
                                                {user?.email}
                                            </td>
                                            <td
                                                className={classNames(
                                                    userIndex === 0 ? '' : 'border-t border-gray-200',
                                                    'hidden px-3 py-3.5 text-sm text-gray-500 lg:table-cell'
                                                )}
                                            >
                                                {user?.is_verified == true ?
                                                    <span className='bg-buttons text-primary-color py-1 px-4 rounded-full ms-4'>
                                                        Verified
                                                    </span> :
                                                    <span className='bg-red-600 text-primary-color py-1 px-4 rounded-full ms-1'>
                                                        Not Verified
                                                    </span>
                                                }
                                            </td>

                                            <td
                                                className={classNames(
                                                    userIndex === 0 ? '' : 'border-t border-gray-200',
                                                    'relative py-3.5 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 flex justify-center items-center gap-2'
                                                )
                                                }
                                            >

                                                {/* <AiFillDelete
                                                    onClick={handleDeleteVendor(user?._id)}
                                                    className='cursor-pointer w-5 h-5 hover:text-red-600 transition'
                                                />
                                                 */}
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
        </div>

    )
}

export default CustomerList