import React, { useEffect, useState } from 'react'
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Rectangle, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { FaCircle } from "react-icons/fa";
import { useQuery } from '@tanstack/react-query';
import { calculatePercentage } from 'src/lib/helper/calculatePercentage';
import axios from 'axios';
import Skeleton from './Skeleton';
// import { BarChart, Bar, , XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function SecondRow() {
    const token = JSON.parse(localStorage.getItem('token'))
    const [chartType, setChartType] = useState('yearly')

    const handleChartTypeChange = (e) => {
        setChartType(e.target.value);
    };


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

    const { isError: analyticsIsError, isPending: analyticsPending, data: analyticsData, error: analyticsError } = useQuery({
        queryKey: ['analyticsData'],
        queryFn: async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_PATH}/dashboards/analytics`, {
                    headers: {
                        'Authorization': `Bearer ${token.accessToken}`
                    }
                })
                return res.data;

            } catch (error) {
                console.error('Something went wrong')
            }
        }
    })

    if (analyticsIsError) {
        console.log(analyticsError)
    }
    // console.log(analyticsData, 'anal')

    const WeeklySalesData = [
        {
            name: 'Page A',
            uv: 4000,
            pv: 2400,
            amt: 2400,
        },
        {
            name: 'Page B',
            uv: 3000,
            pv: 1398,
            amt: 2210,
        },
        {
            name: 'Page C',
            uv: 2000,
            pv: 9800,
            amt: 2290,
        },
        {
            name: 'Page D',
            uv: 2780,
            pv: 3908,
            amt: 2000,
        },
        {
            name: 'Page E',
            uv: 1890,
            pv: 4800,
            amt: 2181,
        },
        {
            name: 'Page F',
            uv: 2390,
            pv: 3800,
            amt: 2500,
        },
        {
            name: 'Page G',
            uv: 3490,
            pv: 4300,
            amt: 2100,
        },
    ];

    const weeklyOrder = [
        {
            name: 'Page A',
            uv: 4000,
            pv: 2400,
            amt: 2400,
        },
        {
            name: 'Page B',
            uv: 3000,
            pv: 1398,
            amt: 2210,
        },
        {
            name: 'Page C',
            uv: 2000,
            pv: 9800,
            amt: 2290,
        },
        {
            name: 'Page D',
            uv: 2780,
            pv: 3908,
            amt: 2000,
        },
        {
            name: 'Page F',
            uv: 2390,
            pv: 3800,
            amt: 2500,
        },
        {
            name: 'Page G',
            uv: 3490,
            pv: 4300,
            amt: 2100,
        },
    ];


    const AnalyticsChart = ({ data, chartType }) => {
        const chartData = data && data[`analytics_${chartType}`];

        return (
            <div className='bg-primary-color px-6 py-6 rounded-md'>
                {
                    chartData && <>
                        <div className='flex justify-between items-center'>
                            <p className='text-secondary-color text-[18px]'>Analytics</p>
                            <div className='flex justify-center items-center gap-4'>
                                <p className='flex items-center gap-2'>
                                    <FaCircle className='text-tertiary-500' />
                                    Sales
                                </p>
                                <p className='flex items-center gap-2'>
                                    <FaCircle className='text-gray-white' />
                                    Expense
                                </p>
                            </div>
                            <select value={chartType} onChange={(e) => handleChartTypeChange(e)}>
                                {['yearly', 'monthly'].map((option, index) => (
                                    <option key={index} value={option}>
                                        {option.charAt(0).toUpperCase() + option.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <ResponsiveContainer width='100%' height={250}>
                            <BarChart
                                width={500}
                                height={210}
                                data={chartData}
                                margin={{
                                    top: 25,
                                }}
                            >
                                <XAxis dataKey={chartType === 'yearly' ? 'month_name' : 'week_name'} />
                                <YAxis />
                                <Bar dataKey='sales' fill='#1A985B' barSize={10} />
                                <Bar dataKey='expense' fill='#7D879C' barSize={10} />
                            </BarChart>
                        </ResponsiveContainer>
                    </>
                }
            </div>
        );
    };


    const ItemsInfo = ({ type, item }) => {
        return (
            <div className='w-full bg-white p-4 rounded-sm'>
                {
                    type === 'total_weekly_sale' ? 'Weekly Sales' : 'Weekly Order'
                }

                <div className='grid grid-cols-2 mt-4'>
                    <div>
                        <p className='text-[24px] my-2'>
                            <span>{item.last_year}</span>
                        </p>
                        <p className={parseFloat(item.last_year) > parseFloat(item.two_year) ? `flex items-center gap-2 text-tertiary-600` : `flex items-center gap-2 text-red-600`}>
                            {parseFloat(item.last_year) > parseFloat(item.two_year) ? <span>▲</span> : <span>▼</span>}
                            ({calculatePercentage(item.last_year, item.two_year)})
                        </p>
                    </div>
                    {/* charts */}
                    <div>
                        {
                            type === 'total_weekly_sale' &&
                            <ResponsiveContainer width={250} height={100}>
                                <BarChart
                                    width={250}
                                    height={100}
                                    data={WeeklySalesData}
                                    margin={{
                                        top: 5,
                                        right: 30,
                                        left: 20,
                                        bottom: 5,
                                    }}
                                // barGap={100}
                                >
                                    <Bar dataKey="pv" fill="#1A985B" barSize={10} />
                                </BarChart>
                            </ResponsiveContainer>
                        }
                        {
                            type === 'total_weekly_order' &&
                            <ResponsiveContainer width={250} height={90}>
                                <AreaChart
                                    width={250}
                                    height={100}
                                    data={weeklyOrder}
                                    margin={{
                                        top: 10,
                                        right: 30,
                                        left: 0,
                                        bottom: 0,
                                    }}
                                >

                                    <Area type="monotone" dataKey="uv" stroke="#8884d8" fill="#8884d8" />
                                </AreaChart>
                            </ResponsiveContainer>
                        }

                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className='grid grid-cols-2 my-4 gap-4'>

            {/* items details */}
            <div className='grid grid-cols-1 gap-4 rounded-md'>
                {/* {
                    data?.map((item, index) => <ItemsInfo item={item} key={index} />)
                } */}

                {
                    data ? Object.keys(data).slice(4, 6).map((key, index) => (
                        <ItemsInfo key={index} type={key} item={data[key]} />
                    ))
                        :
                        <Skeleton />
                }
            </div>
            {/* analytics */}
            {
                analyticsData && <AnalyticsChart data={analyticsData} chartType={chartType} />
            }


        </div>
    )
}


// {/* <div className=' bg-primary-color px-6 py-6 rounded-md'>
//                 <div className='flex justify-between items-center'>
//                     <p className='text-secondary-color text-[18px]'>Analytics</p>
//                     <div className='flex justify-center items-center gap-4'>
//                         <p className='flex items-center gap-2'>
//                             <FaCircle className='text-tertiary-500' />
//                             Sales
//                         </p>
//                         <p className='flex items-center gap-2'>
//                             <FaCircle className='text-gray-white' />
//                             Expense
//                         </p>
//                     </div>
//                     <select className='outline-none'>
//                         <option value="yearly">Yearly</option>
//                         <option value="monthly">Monthly</option>
//                     </select>
//                 </div>
//                 <ResponsiveContainer width="100%" height={250}>
//                     <BarChart
//                         width={500}
//                         height={210}
//                         data={salesAndExpense}
//                         margin={{
//                             top: 25,
//                         }}
//                     >
//                         <XAxis dataKey="name" />
//                         <YAxis />
//                         <Bar dataKey="pv" fill="#1A985B" barSize={10} />
//                         <Bar dataKey="uv" fill="#7D879C" barSize={10} />
//                     </BarChart >
//                 </ResponsiveContainer >
//             </div > * /}