import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next';
import { FaArrowRight } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import PaginationComponent from 'src/components/Admin/Pagination/PaginationComponent';
import { showToast } from 'src/components/Common/Toastify/Toastify';


const SupportTicketComponent = () => {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user'));
  const { t, i18n } = useTranslation()
  const currentLanguage = i18n.language;
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(4)

  const [totalPages, setTotalPages] = useState(0)
  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };

  const { isPending, isError, error, data } = useQuery({
    queryKey: ['supportTicket', user?._id, page, limit],
    queryFn: async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_PATH}/support-tickets/get-all?user_id=${user?._id}&page=${page}&limit=${limit}&sortBy=-updatedAt`, {
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem('token')).accessToken}`,
          },
        });

        const jsonData = await response.json();
        // console.log(jsonData)
        setTotalPages(Math.ceil((jsonData.total)/limit))
        return jsonData.support_tickets;
      } catch (error) {
        console.error(`Error fetching data`);
      }
    },
  });

  // console.log(error)
  // console.log(data)
  return (
    <div>

      {
        (data?.length == 0 || data == undefined) && <p className='mt-10 md:ms-1 my-10 text-center'>No support tickets were made for you.. </p>
      }
      {
        data?.map((ticket, index) => {

          return <div
            key={ticket._id}
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
            className='rounded-md px-4 py-6 flex justify-between items-center cursor-pointer mb-4 hover:bg-gray-50 transition '
            style={{
              boxShadow: '0px 1px 3px 0px #03004717'
            }}
          >
            <div className=''>
              {/* title */}
              <p className='text-[16px] font-[600]'>{ticket?.detail}</p>
              {/* tags */}
              <div className='flex justify-start items-center mt-4 gap-4 flex-wrap'>
                <div className='flex gap-4 '>
                  {
                    ticket?.tags?.map((tag, index) => (
                      <>
                        <p key={index} className={tag.toLowerCase() == 'urgent' ? 'bg-red-100 text-red-500 rounded-full px-3 pb-[2px]' : tag.toLowerCase() == 'moderate' ? 'bg-tertiary-100 font-[600] text-tertiary-600 rounded-full px-3 pb-[2px]' : ''}>{tag}</p>
                      </>
                    ))
                  }
                  <p className='bg-tertiary-100 font-[600] text-tertiary-600 rounded-full px-3 pb-[2px]'>{ticket?.status}</p>
                </div>
                <p
                  className='border-[1px] px-3 py-[2px] rounded-full'
                >
                  {ticket?.connection}
                </p>
                <p>{new Date(ticket?.createdAt)?.toDateString()}</p>
                <p >{ticket?.caption}</p>

              </div>
            </div>
            <FaArrowRight className={`text-gray-500 ${currentLanguage == 'ar' && 'rotate-180'}`} />
          </div>
        })
      }
      <PaginationComponent
        currentPage={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  )
}

export default SupportTicketComponent