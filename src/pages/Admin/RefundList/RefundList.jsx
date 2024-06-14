import React, { useEffect, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { showToast } from 'components/Common/Toastify/Toastify';
import PaginationComponent from 'components/Admin/Pagination/PaginationComponent';
import { TbListDetails } from "react-icons/tb";
import AdminHeader from 'src/components/Admin/AdminHeader/AdminHeader';
import RefundListModal from 'src/components/Admin/RefundListModal/RefundListModal';

const RefundList = () => {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    // console.log(JSON.parse(localStorage.getItem('token')).accessToken)
    const [limit, setLimit] = useState(10)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    const [showRefundModal, setShowRefundModal] = useState(false)
    const [selectedItem, setSelectedItem] = useState(null);

    // Function to handle page change
    const handlePageChange = (pageNumber) => {
        setPage(pageNumber);
    };


    const { isPending, isError, error, data } = useQuery({
        queryKey: ['refunds', { page, limit }],
        queryFn: async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_PATH}/refunds/get-all?page=${page}&limit=${limit}$sortBy=-updatedAt`, {
                    headers: {
                        Authorization: `Bearer ${JSON.parse(localStorage.getItem('token')).accessToken}`
                    }
                });

                const jsonData = await response.json();
                setTotalPages(Math.ceil(jsonData?.total / limit))
                return jsonData.refunds;
            } catch (error) {
                console.error(`Error fetching data`);
            }
        },
    });
    // set total pages
    useEffect(() => {
        setTotalPages(Math.ceil(data?.length / limit))
    }, [data])

    // if (isPending) return <p>Loading...</p>
    // if (isError) return <p>{error}</p>
    // console.log(data)

    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
    }

    // pagination
    // console.log(search)

    return (
        <>
            <AdminHeader
                browseWebsite={true}
                addNew={false}
                notification={true}
                profile={true}
            // search={true}
            // setSearch={setSearch}
            // nameOfSearching={'customers'}
            />
            <div className='bg-gray-100 p-4 rounded-md font-main'>
                {
                    showRefundModal && <RefundListModal setShowRefundModal={setShowRefundModal} selectedItem={selectedItem} />
                }
                <p className='font-[600] px-2'>Refund Requests</p>

                <div className="sm:px-6 lg:px-2 px">
                    <div className="-mx-4 mt-6 ring-1 ring-gray-300 sm:mx-0 sm:rounded-lg bg-white">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead>
                                <tr>
                                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                        Order Number
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        Shop Name
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        Product Details
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        Amount
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
                                {data?.map((refund) => (
                                    <tr key={refund._id}>
                                        <td
                                            className="py-4 pl-4 pr-3 text-sm sm:pl-6 cursor-pointer"
                                            onClick={() => {
                                                navigator.clipboard.writeText(refund?.order?._id);
                                                showToast('Copied to clipboard', 'info')
                                            }}
                                        >
                                            #{refund?.order?._id}
                                        </td>
                                        <td className="px-3 py-3.5 text-sm text-gray-500">
                                            {refund?.shop?.name?.en}
                                        </td>
                                        <td className="px-3 py-3.5 text-sm text-gray-500">
                                            <div className="flex items-center gap-2">
                                                <img src={refund.product_item.image} alt="Product" className="w-10 h-10 rounded-full" />
                                                {refund?.product_item?.name?.en}
                                            </div>
                                        </td>
                                        <td className="px-3 py-3.5 text-sm text-gray-500">
                                            ${refund.amount}
                                        </td>
                                        <td className="px-3 py-3.5 text-sm text-gray-500">
                                            {refund.status}
                                        </td>
                                        <td className="py-3.5 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 flex justify-center items-center gap-2">
                                            {/* Example action: Delete (You can customize as needed) */}
                                            <TbListDetails
                                                onClick={() => {
                                                    setSelectedItem(refund)
                                                    setShowRefundModal(true)
                                                    // showToast('Show refund details - ongoing', 'info')
                                                }}
                                                className='cursor-pointer w-5 h-5 hover:text-tertiary-600 transition mt-3'
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {/* Pagination remains unchanged */}
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

export default RefundList