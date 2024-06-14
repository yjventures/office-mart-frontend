import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useSetAtom } from 'jotai'
import React, { useEffect, useState } from 'react'
import { IoReorderThreeOutline } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import ProfileSidebar from 'src/components/Profile/ProfileSidebar/ProfileSidebar'
import { orderItemsAtom } from 'src/lib/jotai'
import { PiShoppingCartLight } from "react-icons/pi";
import { IoCloudDoneSharp } from "react-icons/io5";
import NoOrdersFound from 'src/components/User/Orders/NoOrdersFound'
import { useTranslation } from 'react-i18next'
import PaginationComponent from 'src/components/Admin/Pagination/PaginationComponent'


const Orders = () => {
  const [showSidebar, setShowSidebar] = React.useState(false)
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user'))
  const orderItems = useSetAtom(orderItemsAtom)
  const { t, i18n } = useTranslation()
  const currentLanguage = i18n.language;

  const [limit, setLimit] = useState(5)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0);
  const queryClient = useQueryClient()
  useEffect(() => {
    localStorage.setItem('firstLoadDone', 0);
  }, [])

  const { isPending, data: orders, error } = useQuery({
    queryKey: ['orders', user?.id, page, limit],
    queryFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_API_PATH}/customer-orders/get-all?user_id=${user?._id}&limit=${limit}&page=${page}&sortBy=-createdAt`)
      const data = await res.json();
      setTotalPages(Math.ceil(data?.total / limit))
      return data?.orders;
    }
  })

  // console.log(orders)
  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
    queryClient.invalidateQueries({ queryKey: ['orders', user?.id] });
  };

  return (
    <div className='h-full p-3 font-main lg:-ms-10 lg:-mt-4'>
      <div className='lg:flex justify-between items-center relative z-10 mb-6'>
        <div className='flex items-center'>
          <IoCloudDoneSharp className='w-5 h-5 text-tertiary-600' />
          <p className='text-xl font-bold ms-2'> {t('order.title')} </p>
        </div>
        <div className={`lg:hidden absolute top-0 cursor-pointer z-40 ${currentLanguage == 'ar' ? 'left-2' : 'right-2'}`} onClick={() => {
          setShowSidebar(!showSidebar)
        }}
        >
          <IoReorderThreeOutline className='w-[20px] h-[20px] ' />
        </div>
        <div className='lg:hidden'>
          {
            showSidebar && <ProfileSidebar />
          }
        </div>
      </div>
      {
        isPending && <p>Loading...</p>
      }
      {
        orders?.length === 0 && <NoOrdersFound />
      }
      {orders &&
        orders.map((order) => (
          <div key={order._id}

            className='shadow-md pb-2 mb-4 rounded-sm'>
            {/* name, date, and view button  */}
            <div className='flex justify-between py-2 mb-4 border-l-4 border-green-500 ' dir={currentLanguage == 'ar' && 'rtl'}>
              <div className='flex gap-2 px-6 flex-col '>
                <p className='text-sm text-gray-600'>
                  {t('order.order_id')} : <span className='text-gray-800 uppercase'>#{order._id}</span>
                </p>
                <p className='text-sm text-gray-600'>
                  {t('order.placed_on')} : <span className='text-gray-800'>{new Date(order.creation_date).toDateString()}</span>
                </p>
              </div>
              <button
                className='text-sm me-6 hover:underline text-tertiary-500 font-medium'
                onClick={() => {
                  orderItems(order)
                  navigate(`/track-order`);
                }}
              >
                {t('order.view_order')}
              </button>
            </div>
            {/* items name, status, quantity */}
            {order?.items &&
              order?.items?.map((item) => {

                return (
                  (
                    <div key={item._id} className='grid md:grid-cols-3 grid-cols-1 gap-3 items-center mb-6 px-6' dir={currentLanguage == 'ar' && 'rtl'}>
                      <div className='flex items-center gap-2'>
                        {
                          item?.image !== '' && <img src={item?.image} alt="image" className='w-20 h-20 object-contain rounded-md' />
                        }
                        {/* <img src={item?.image} alt={'image of ' + item?.name?.en} className='w-20 h-20 rounded-md' /> */}
                        <div>
                          <p className='font-medium text-secondary-color'>{item?.name?.en}</p>
                          <p className='text-sm text-gray-500 mt-1'>{`$${item.price} x ${item.quantity}`}</p>
                        </div>
                      </div>
                      {/* status */}
                      <p className={`text-sm text-center`}>
                        <span className={`bg-gray-200 py-1 px-3 capitalize rounded-full ${item.canceled == true ? 'bg-red-500 text-primary-color' : item.status === 'delivered' ? 'bg-tertiary-500 text-primary-color' : item.status === 'shipped' ? 'bg-tertiary-500 text-primary-color' : 'text-yellow-700 bg-yellow-400 '}`}>
                          {
                            item.canceled === true ? 'canceled' : item.status
                          }
                        </span>
                      </p>
                      {/* date */}
                      {/* check if canceled */}
                      {
                        item.canceled === true ?
                          <p className='text-sm text-gray-600 text-end'>
                            {t('order.wont_arrive')} !
                          </p>
                          :
                          <>
                            {
                              item.status === 'delivered' ?
                                <p className='text-sm text-gray-600 text-center md:text-end'>
                                  {t('order.delivered')} : <span className='text-gray-800'>{new Date(order.updatedAt).toDateString()}</span>
                                </p>
                                :
                                <p className='text-sm text-gray-600 text-center md:text-end'>
                                  {
                                    order.estimation_date && ` ${t('order.view_order')} ${new Date(order.estimation_date).getDate()} ${new Date(order.estimation_date).toLocaleString('default', { month: 'short' })}`
                                  }
                                </p>
                            }
                          </>
                      }

                    </div>
                  )
                )
              })}
          </div>
        ))}
      <PaginationComponent
        currentPage={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  )
}

export default Orders