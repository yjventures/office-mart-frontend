import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import React, { useState } from 'react'
import { FaArrowRight } from 'react-icons/fa';
import AdminHeader from 'src/components/Admin/AdminHeader/AdminHeader';
import PaginationComponent from 'src/components/Admin/Pagination/PaginationComponent';
import { showToast } from 'src/components/Common/Toastify/Toastify';

const SupportTicketList = () => {
    const queryClient = useQueryClient();
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)

    const [totalPages, setTotalPages] = useState(0)
    const handlePageChange = (pageNumber) => {
        setPage(pageNumber);
    };


    const { isPending, isError, error, data } = useQuery({
        queryKey: ['supportTicket_all', page, limit],
        queryFn: async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_PATH}/support-tickets/get-all?page=${page}&limit=${limit}&sortBy=-updatedAt`, {
                    headers: {
                        Authorization: `Bearer ${JSON.parse(localStorage.getItem('token')).accessToken}`,
                    },
                });

                const jsonData = await response.json();
                setTotalPages(Math.ceil((jsonData.total) / limit))
                return jsonData.support_tickets;
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

    // console.log(platformFee)
    // console.log(isPending, data)

    // change status
    const handleStatusChange = async (id, value) => {
        // console.log(id, value)
        if (value == '') {
            showToast('Select a status value', 'info')
            return;
        }
        const res = await axios.put(`${import.meta.env.VITE_API_PATH}/support-tickets/update/${id}`,
            {
                "status": value
            },
            {
                headers: {
                    Authorization: `Bearer ${JSON.parse(localStorage.getItem('token')).accessToken}`,
                },
            })

        if (res.status === 200) {
            queryClient.invalidateQueries(['supportTicket_all']);
            showToast('Status updated', 'info')
        } else {
            console.error('Error on updating status');
        }
    }

    // change platform fee
    const [platformFeeAmount, setPlatformFeeAmount] = useState('');
    const [loadingUpdate, setLoadingUpdate] = useState(false);

    const handlePlatformFeeChange = (e) => {
        // check only numbers
        if (isNaN(e.target.value)) {
            showToast('Only numbers are allowed', 'error')
            return;
        }

        setPlatformFeeAmount(e.target.value)
    }

    const handlePlatformFeeUpdate = async () => {
        if (platformFeeAmount == '') {
            showToast('Please enter a value', 'error')
            return;
        }
        setLoadingUpdate(true);

        const res = await axios.put(`${import.meta.env.VITE_API_PATH}/platform-fees/update/665d4fb5876c1bd9ca7dbd34`,
            {
                "percentage": 0,
                // "amount": platformFeeAmount
            },
            {
                headers: {
                    Authorization: `Bearer ${JSON.parse(localStorage.getItem('token')).accessToken}`,
                },
            })

        if (res.status === 200) {
            queryClient.invalidateQueries(['platform_fee']);
            showToast('Platform fee updated', 'info')
        } else {
            console.error('Error on updating platform fee');
        }

        setLoadingUpdate(false);
        setPlatformFeeAmount('');
    }


    return (
        <>
            <AdminHeader
                browseWebsite={true}
                addNew={false}
                notification={true}
                profile={true}
                // search={true}
                // setSearch={setSearchTerm}
                nameOfSearching={'business name'}
            />
            <div className='bg-gray-100 p-4 rounded-md font-main'>
                <p className='font-[600]'>Platform fee</p>
                <div className='py-3 flex gap-3'>
                    <input
                        type="text"
                        className='w-full py-2 px-4 rounded-md outline-none'
                        placeholder={`Current platform fee: ${platformFee?.percentage} %`}
                        value={platformFeeAmount}
                        onChange={handlePlatformFeeChange}

                    />
                    <button
                        className='bg-buttons px-4 rounded-md text-white'
                        onClick={handlePlatformFeeUpdate}
                    >
                        {loadingUpdate ? 'Updating...' : 'Update'}
                    </button>
                </div>


                <p className='font-[600] mt-2'>Support Tickets List</p>
                {
                    (data?.length == 0 || data == undefined) && <p className='mt-10 md:ms-1 text-center mb-10'>No support tickets found.. </p>
                }
                {
                    data?.map((ticket, index) => {

                        return <div key={ticket._id} className='mt-4 relative'>
                            <div className='my-2 ms-[2px] absolute right-12 bottom-3'>
                                <select
                                    className='p-2 rounded-md outline-none border-[2px] cursor-grab'
                                    onChange={(e) => handleStatusChange(ticket._id, e.target.value)}
                                >
                                    <option value="">Change status</option>
                                    <option value="open">Open</option>
                                    <option value="closed">Close</option>
                                    <option value="resolved">Resolved</option>
                                </select>

                            </div>
                            <div
                                onClick={() => {
                                    navigator.clipboard.writeText(ticket.connection).then(() => {
                                        showToast('Ticket connection copied to clipboard!', 'success');
                                    }, (err) => {
                                        showToast('Failed to copy ticket connection.', 'error');
                                    });
                                    setTimeout(() => {
                                        window.open(`https://sonbolasupport.aigency.chat`, '_blank')
                                    }, [1500])
                                }}
                                // onMouseEnter={() => {
                                //   showToast(`Enter ${ticket?.connection} as ticket in next page`, 'info')
                                // }}
                                className='rounded-md px-4 py-6 flex justify-between items-center cursor-pointer mb-4 transition bg-white'
                                style={{
                                    boxShadow: '0px 1px 3px 0px #03004717'
                                }}
                            >
                                <div className=''>
                                    {/* title */}
                                    <p className='text-[16px] font-[600]'>{ticket?.detail}</p>
                                    <div className='flex justify-start items-center mt-4 gap-4 flex-wrap'>
                                        {/* tags */}
                                        <div className='flex gap-4 '>
                                            {
                                                ticket?.tags?.map((tag, index) => (
                                                    <div key={index}>
                                                        <p
                                                            key={index}
                                                            className={tag.toLowerCase() == 'urgent' ? 'bg-red-100 text-red-500 rounded-full px-3 pb-[2px]' : tag.toLowerCase() == 'moderate' ? 'bg-tertiary-100 font-[600] text-tertiary-600 rounded-full px-3 pb-[2px]' : ''}>
                                                            {tag}
                                                        </p>
                                                    </div>
                                                ))
                                            }
                                            <p className={`${ticket?.status == 'open' ? 'bg-red-100 text-red-600' : 'bg-tertiary-100 text-tertiary-600'} font-[600] rounded-full px-3 pb-[2px]`}>{ticket?.status}</p>
                                        </div>
                                        {/* connection id */}
                                        <p
                                            className='border-[1px] px-3 py-[2px] rounded-full'
                                        >
                                            {ticket?.connection}
                                        </p>
                                        <p>{new Date(ticket?.createdAt)?.toDateString()}</p>
                                        <p >{ticket?.caption}</p>

                                    </div>
                                </div>
                                <FaArrowRight className={`text-gray-500 `} />
                            </div>

                        </div>
                    })
                }
                <PaginationComponent
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </div>
        </>

    )
}

export default SupportTicketList