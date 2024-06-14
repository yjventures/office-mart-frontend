import React, { useState } from 'react'
import AdminHeader from 'src/components/Admin/AdminHeader/AdminHeader'
import { GoSearch } from "react-icons/go";
import PaginationComponent from 'src/components/Admin/Pagination/PaginationComponent';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { RxAvatar } from 'react-icons/rx';
import { IoCheckmarkDoneCircleSharp } from "react-icons/io5";
import { FaTrash } from "react-icons/fa6";
import { showToast } from 'src/components/Common/Toastify/Toastify';
import axios from 'axios'

const SuperAdmin = () => {
    const queryClient = useQueryClient()
    // console.log(JSON.parse(localStorage.getItem('token')).accessToken)
    const [limit, setLimit] = useState(10)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    const [search, setSearch] = useState('')
    const [searchEmail, setSearchEmail] = useState('')
    const [showAdmineModal, setShowAdminModal] = useState(false);
    const [adminIdtoAdd, setAdminIdtoAdd] = useState(null);
    const [status, setStatus] = useState(null);
    const [userType, setUserType] = useState(null);
    const [loading, setLoading] = useState(false);
    const [type, setType] = useState('');
    // console.log(type)
    const handleToggleAdmin = (id, type, status) => {
        setAdminIdtoAdd(id);
        setUserType(type);
        setShowAdminModal(true);
        setStatus(status);
    };
    // Function to handle page change
    const handlePageChange = (pageNumber) => {
        setPage(pageNumber);
    };

    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
    }

    const { isPending, isError, error, data } = useQuery({
        queryKey: ['customers', { page, limit, type }],
        queryFn: async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_PATH}/users/get-all?page=${page}&limit=${limit}${type !== '' && `&type=${type}`}`, {
                    headers: {
                        Authorization: `Bearer ${JSON.parse(localStorage.getItem('token')).accessToken}`
                    }
                });

                const jsonData = await response.json();
                setTotalPages(Math.ceil(jsonData?.total / limit))
                return jsonData.users; // Access the 'users' array directly
            } catch (error) {
                // console.log(`Error fetching data`);
            }
        },
    });
    if (isError) {
        console.error(error)
    }

    // console.log(data)
    const handleToggleAdminFunction = async () => {
        // console.log(userType);
        // console.log(adminIdtoAdd);
        // console.log(status);
        setLoading(true)
        if (status == false) {
            showToast('User need to be varified first!', 'info');
            setLoading(false)
            setShowAdminModal(false)
            return;
        }

        // if admin try to modify thyself
        if (adminIdtoAdd == JSON.parse(localStorage.getItem('user'))._id) {
            showToast('Sorry, You can not modify yourself!', 'info');
            setLoading(false)
            setShowAdminModal(false)
            return;
        }

        try {

            const response = await axios.put(`${import.meta.env.VITE_API_PATH}/users/update/${adminIdtoAdd}`, {
                type: userType == 'admin' ? 'customer' : 'admin'
            }, {
                headers: {
                    Authorization: `Bearer ${JSON.parse(localStorage.getItem('token')).accessToken}`
                }
            });

            if (response.status === 200) {
                queryClient.invalidateQueries(['customers']);
                // console.log()
            } else {
                console.error('Error on updating cart');
            }
        } catch (error) {
            console.error('Error on updating cart', error);
        } finally {
            setLoading(false)
            setShowAdminModal(false)
        }

    }


    return (
        <>
            <AdminHeader
                browseWebsite={true}
                addNew={false}
                notification={true}
                profile={true}
                search={true}
                setSearch={setSearch}
                nameOfSearching={'user'}
            />
            <div className='bg-gray-100 p-4 rounded-md font-main'>
                <div className='flex justify-between items-center'>
                    <p className='font-[600] px-1 '>
                        Super Admin Capability
                    </p>
                    <div className='flex items-center gap-2'>
                        <p>Filter by</p>
                        <select
                            className='py-1 px-2 appearance-none rounded-md cursor-pointer outline-none'
                            onChange={(e) => {
                                setType(e.target.value)
                            }}
                        >
                            <option value={''}>All User</option>
                            {
                                ['admin', 'customer', 'vendor'].map((item, index) => {
                                    return (
                                        <option key={index} value={item}>{item.charAt(0).toUpperCase() + item.slice(1)}</option>
                                    )
                                })
                            }
                        </select>
                    </div>

                </div>

                <div className='mt-8 px-1 flex items-center gap-6'>
                    <p className='text-nowrap text-md font-semibold'>Search user by email</p>
                    <div className='w-full relative'>
                        <input
                            type="email"
                            className='w-full py-2 px-8 rounded-md outline-none font-mono'
                            onChange={(e) => {
                                setSearchEmail(e.target.value)
                            }}
                        />
                        <GoSearch className='absolute left-2 top-3' />
                    </div>
                </div>

                <div>
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
                                    <th
                                        scope="col"
                                        className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                                    >
                                        Type
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
                                    ?.filter((user) => user?.email.toLowerCase().includes(searchEmail.toLocaleLowerCase()))
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
                                                    'hidden px-3 py-3.5 text-sm text-gray-500 lg:table-cell'
                                                )}
                                            >
                                                {
                                                    user?.type == 'customer' ?
                                                        <span className='bg-black text-primary-color py-1 px-4 rounded-full '>
                                                            Customer
                                                        </span> :
                                                        (
                                                            user?.type == 'vendor' ?
                                                                <span className='bg-blue-500 text-primary-color py-1 px-4 rounded-full ms-1'>
                                                                    Vendor
                                                                </span> : <span className='bg-buttons text-primary-color py-1 px-4 rounded-full ms-1'>
                                                                    Admin
                                                                </span>
                                                        )
                                                }
                                            </td>
                                            <td
                                                className={classNames(
                                                    userIndex === 0 ? '' : 'border-t border-gray-200',
                                                    'relative py-3.5 pl-3 text-right text-sm font-medium flex justify-center items-center gap-2'
                                                )
                                                }
                                            >

                                                <button
                                                    className={`${user.type !== 'admin' ? 'bg-buttons hover:bg-tertiary-500' : 'bg-red-600 hover:bg-red-500'} px-2 py-1 transition text-white rounded-sm flex items-center gap-2`}
                                                    onClick={() => handleToggleAdmin(user?._id, user?.type, user?.is_verified)}
                                                >
                                                    {
                                                        user.type !== 'admin' ? <>
                                                            Mark as admin
                                                            <IoCheckmarkDoneCircleSharp className='w-4 h-4' />
                                                        </> : <>
                                                            Remove admin
                                                            <FaTrash className='w-3 h-3' />
                                                        </>
                                                    }

                                                </button>
                                                {
                                                    showAdmineModal && <div className='fixed inset-0 bg-opacity-50 z-50 flex items-center justify-center px-2'>
                                                        <div className='bg-white rounded-lg p-4 border-2 max-w-4xl'>
                                                            <p className='text-lg font-bold mb-4'>
                                                                {
                                                                    userType == 'admin' ? "Are you sure to remove this admin?" : "Are you sure to make this user an admin?"
                                                                }

                                                            </p>
                                                            <div className='flex justify-between gap-4'>
                                                                <button
                                                                    onClick={() => setShowAdminModal(false)}
                                                                    className='px-4 py-2 w-full bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 focus:outline-none focus:ring focus:ring-gray-400 transition'>
                                                                    No
                                                                </button>
                                                                <button
                                                                    onClick={handleToggleAdminFunction}
                                                                    className='px-4 py-2 w-full bg-tertiary-500 text-white rounded-md hover:bg-buttons focus:outline-none focus:ring focus:ring-red-600 transition'
                                                                    disabled={loading}>
                                                                    {loading ? 'Loading...' : 'Yes, Confirm'}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                }
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

export default SuperAdmin