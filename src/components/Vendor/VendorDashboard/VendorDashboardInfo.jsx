import React, { useState } from 'react'
import { useTranslation } from 'react-i18next';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import VendorReports from '../VendorReports/VendorReports';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios'


const VendorDashboardInfo = () => {
  const { t, i18n } = useTranslation()
  const currentLanguage = i18n.language;
  const [shopId, setShopId] = useState(JSON.parse(localStorage.getItem('user'))?.vendor_info?.shop?._id)
  const { data: topProducts, isPending, isError } = useQuery({
    queryKey: ['top_product'],
    queryFn: async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_PATH}/products/get-top-products?limit=5&shop=${shopId}`)
        return res.data;
      } catch (error) {
        console.error('Something went wrong')
      }
    }
  })

  // console.log(topProducts, isPending)
  const data = [
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


  const InfoCard = ({ first_title, value, last_title }) => {
    return (
      <div className='rounded-md px-3 text-center font-main py-4' style={{ boxShadow: '0px 1px 3px 0px rgba(3, 0, 71, 0.09)' }}>
        <p className='text-gray-600 text-[16px] font-[600]'>
          {first_title}
        </p>
        <p className='text-gray-700 font-[700] text-[30px] py-2'>
          ${value}
        </p>
        <p className='text-gray-600 text-[14px] font-[400]'>
          {last_title}
        </p>
      </div>
    )
  }

  const TopProducts = ({ icon, name }) => {
    return (
      <div className='flex items-center justify-between px-3 py-2 rounded-md' >
        <div className='flex items-center'>
          <img src={icon} alt="icon" className='w-[16px] h-[16px] rounded-md' />
          <p className='text-gray-800 text-[16px] font-[400] ms-2 capitalize'>
            {name}
          </p>
        </div>
        {/*  */}
      </div>
    )
  }

  return (
    <div className='my-4 px-1 font-main'>
      {/* cards */}
      {/* <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
        <InfoCard first_title={t('dashboard.earnings')} value='0' last_title={t('dashboard.earnings_last')} />
        <InfoCard first_title={t('dashboard.balance')} value='0' last_title={`${t('dashboard.balance_last')} Feb 15, 2021`} />
        <InfoCard first_title={t('dashboard.orders')} value='0' last_title='7/3/2020 - 8/1/2020' />
      </div> */}
      <VendorReports />
      {/* charts and top country*/}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-2 mt-2 lg:mt-6'>
        <div className='w-full lg:col-span-2 rounded-md p-4' style={{ boxShadow: '0px 1px 3px 0px rgba(3, 0, 71, 0.09)' }}>
          <p>
            {t('dashboard.sales')}
          </p>
          <ResponsiveContainer width="95%" height={250} >
            <LineChart width={300} height={100} data={data}>
              <Line type="monotone" dataKey="pv" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className='rounded-md p-4' style={{ boxShadow: '0px 1px 3px 0px rgba(3, 0, 71, 0.09)' }}>
          <p className='text-gray-900 text-[16px] font-[600] mb-2'>
            {t('dashboard.top_products')}
          </p>
          <div>
            {
              topProducts?.products?.map((country, index) => {
                return (
                  <TopProducts key={index} icon={country?.images[0]} name={country?.name?.en} />
                )
              })
            }
           
          </div>
        </div>
      </div>
    </div>
  )
}

export default VendorDashboardInfo