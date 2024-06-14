import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react'
import { useLayoutEffect, useRef, useState } from 'react'
import { generalData } from 'src/lib/helper/dynamicData';


export default function ThirdRow() {

    const [limit, setLimit] = useState(10)

    const { isPending, isError, error, data: orders } = useQuery({
        queryKey: ['recent_purchase1', limit], //, limit, page
        queryFn: async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_PATH}/customer-orders/get-all`, {
                    headers: {
                        Authorization: `Bearer ${JSON.parse(localStorage.getItem('token')).accessToken}`
                    }
                });

                const jsonData = await response.json();
                // setTotalPages(Math.ceil(jsonData?.total / limit))
                return jsonData.orders;
            } catch (error) {
                console.error(`Error fetching data`);
            }
        },
    });

    const { isPending: stockPending, isError: stockIsError, error: stockError, data: stockOutData } = useQuery({
        queryKey: ['stockout_products', limit], //, limit, page
        queryFn: async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_PATH}/products/get-all?quantity=0`);
                const jsonData = await response.json();
                // setTotalPages(Math.ceil(jsonData?.total / limit))
                return jsonData.product_info;
            } catch (error) {
                console.error(`Error fetching data`);
            }
        },
    });

    // console.log(stockOutData)

    const handleRetiveShopAndMail = async (shopId, productName) => {
        const res = await axios.post(`${import.meta.env.VITE_API_PATH}/shops/get-user`, {
            "shop": shopId
        }
        );
        if (res.data.user.email) {
            const res = await axios.post(`${import.meta.env.VITE_API_PATH}/emails/send-text`, {
                "email": res.data.user.email,
                "email_text": `
                    Hey vendor, we found one of your products is out of stock. Name of the product is: ${productName}.
                    We are expacting you will update your stock amount soon! Have a nice day..
                    Best regards, 
                    The ${generalData?.name} Team 
                `,
                "email_subject": "Your stock is empty",
            }
            );
        }
    }


    return (
        <div className='grid grid-cols-12 gap-4'>
            <div className='col-span-8 bg-white p-4 rounded-md'>
                <div className="mt-8 flow-root">
                    <p className='mb-4'>Recent Purchases</p>
                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                            <div className="relative">

                                <table className="min-w-full table-fixed divide-y divide-gray-300">
                                    <thead className='bg-gray-200'>
                                        <tr>

                                            <th scope="col" className="min-w-[12rem] px-3.5 pr-3 text-left text-sm font-semibold text-gray-900">
                                                Order ID
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Product
                                            </th>
                                            {/* <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Payment
                                            </th> */}
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Amount
                                            </th>
                                            {/* <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-3">
                                                <span className="sr-only">Edit</span>
                                            </th> */}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {orders
                                            ?.slice(0, 5)
                                            ?.map((order) => (
                                                <tr key={order?._id} > { /* className={selectedPeople.includes(order) ? 'bg-gray-50' : undefined} */}

                                                    <td
                                                        className={`whitespace-nowrap p-2 pr-3 text-sm font-medium`}
                                                    >
                                                        #{order._id}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{order.items[0]?.name.en.length > 40 ? order.items[0]?.name.en.slice(0, 40) + '...' : order.items[0]?.name.en}</td>
                                                    {/* <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{order.payment_method}</td> */}
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">USD {order.total_price} </td>
                                                    {/* <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3 ">
                                                        <BsThreeDotsVertical className='cursor-pointer' />
                                                        <span className="sr-only">, {order.user_id}</span>
                                                    </td> */}
                                                </tr>
                                            ))}

                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='col-span-4 bg-white p-4 rounded-md overflow-hidden'>
                <div className="mt-8 flow-root">
                    <p className='mb-4'>Stock out product </p>
                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle sm:px-4 lg:px-4">
                            <div className="relative">
                                <table className="min-w-full table-fixed divide-y divide-gray-300">
                                    <thead className='bg-gray-200'>
                                        <tr>
                                            <th scope="col" className="min-w-[12rem] ps-3 py-3.5 pr-3 text-left text-sm font-semibold text-gray-900">
                                                Product Name
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Amount
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Email
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white ">
                                        {stockOutData?.map((product) => (
                                            <tr key={product?._id} > { /* className={selectedPeople.includes(order) ? 'bg-gray-50' : undefined} */}
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{product?.name?.en?.length > 40 ? product?.name?.en?.slice(0, 40) + '...' : product?.name?.en}</td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{product?.price} USD</td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    <button
                                                        className='bg-blue-500 text-white py-1 px-2 rounded-md'
                                                        onClick={() => {
                                                            handleRetiveShopAndMail(product.shop, product?.name?.en)
                                                        }}
                                                    >
                                                        Notify
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}

                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
