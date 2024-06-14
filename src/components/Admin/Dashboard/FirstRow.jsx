import React from 'react'
import greeting from 'assets/admin/dashboard/greeting.png'
import { IoMdArrowDropup } from "react-icons/io";
import { MdArrowDropDown } from "react-icons/md";
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { calculatePercentage } from 'src/lib/helper/calculatePercentage';
import Skeleton from './Skeleton';

export default function FirstRow() {
    const token = JSON.parse(localStorage.getItem('token'))

    const { isError, isPending, data, error } = useQuery({
        queryKey: ['firstRowRight'],
        queryFn: async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_PATH}/dashboards/provide-data`, {
                    headers: {
                        'Authorization': `Bearer ${token.accessToken}`
                    }
                })
                return res.data.dashboard_data;

            } catch (error) {
                console.error('Something went wrong')
            }
        }
    })
    // console.log(isError, isPending, data, error)
    if (isError) {
        console.error(error)
    }
    // console.log(data)

    const ItemsInfo = ({ type, item }) => {
        return (
            <div className='w-full bg-white p-4 rounded-sm'>
                {
                    type === 'order' ? 'Order by this year' : type === 'sold_items' ? 'Sold Items this year' : type === 'gross_sales' ? 'Gross Sale this year' : 'Total Shipping Cost this year'
                }
                <p className='text-[24px] my-2'>
                    {item.last_year}
                </p>
                <div className='flex justify-between items-center'>
                    {/* two year means last two year */}
                    <p>{item.two_year}</p>
                    <p className={parseInt(item.last_year) > parseInt(item.two_year) ? `flex items-center gap-2 text-tertiary-600` : `flex items-center gap-2 text-red-600`}>
                        {parseInt(item.last_year) > parseInt(item.two_year) ? <span>▲</span> : <span>▼</span>}
                        {item.last_year} ({calculatePercentage(item.last_year, item.two_year)})
                    </p>
                </div>
            </div>
        );
    }
    const user = JSON.parse(localStorage.getItem('user'))
    return (
        <div className='grid grid-cols-2 my-4 gap-4'>
            {/* greeting stuff */}
            <div className='grid grid-cols-12 bg-primary-color px-6 py-6 rounded-md'>
                <div className='col-span-8'>
                    <p className='text-tertiary-600 text-[18px]'>Good Morning {user.firstname}!</p>
                    <p className='text-[14px] text-gray-400 mb-6'>Here’s what happening with your store today!</p>
                    <div className='my-3'>
                        <p className='text-[24px] text-secondary-color'>
                           {data?.visitors}
                        </p>
                        <p className='text-[14px] text-gray-400'>
                            Total Visit
                        </p>
                    </div>
                    <div className='mt-6'>
                        <p className='text-[24px] text-secondary-color'>
                             {data?.todays_total_sale}
                        </p>
                        <p className='text-[14px] text-gray-400'>
                            Today’s total sales
                        </p>
                    </div>
                </div>
                <div className='col-span-4 flex justify-center items-center'>
                    <img src={greeting} alt="greeting-image" />
                </div>
            </div>
            {/* items details */}
            {
                data ? <div className='grid grid-cols-2 gap-4 rounded-md'>
                    {Object.keys(data).slice(0, 4).map((key, index) => (
                        <ItemsInfo key={index} type={key} item={data[key]} />
                    ))
                    }
                </div>
                    : <Skeleton />
            }

        </div>
    )
}
