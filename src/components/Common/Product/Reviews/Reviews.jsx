import React from 'react'
import { CiCalendarDate } from 'react-icons/ci'
import { RxAvatar } from 'react-icons/rx'
import ReactStars from 'react-stars'
import { useTranslation } from 'react-i18next';

const Reviews = ({ reviewData }) => {
    const { t, i18n } = useTranslation()
    const currentLanguage = i18n.language;
    return (
        <>
            {
                reviewData?.reviews?.filter(item => item.publish === true)?.length == 0 && <p>No reviews available yet </p>
            }
            {/* review list */}
            {
                reviewData
                    ?.reviews
                    ?.filter(item => item.publish === true)
                    ?.map((item, index) => {
                        return (
                            <div className='flex justify-start items-start gap-3 flex-col shadow-sm rounded-md p-3 mb-3 border-[1px]'>
                                <div className='flex justify-between w-full'>
                                    <p className='flex gap-2 text-gray-400'>
                                        {
                                            item?.customer?.image ?
                                                <img
                                                    src={item?.customer?.image}
                                                    className='w-6 h-6 rounded-full'
                                                    alt="user-image"
                                                />
                                                :
                                                <RxAvatar className='w-6 h-6' />
                                        }
                                        <span className='text-gray-500'>{item.customer.firstname} {item.customer?.lastname}</span>
                                    </p>
                                    <p className='flex gap-2'>
                                        <CiCalendarDate className='w-6 h-6' />
                                        {new Date(item?.updatedAt).toDateString()}
                                    </p>
                                </div>
                                <div className='border-t-2 border-gray-100 w-full py-2'>
                                    <div className='flex justify-between py-2 flex-wrap'>
                                        <p>
                                            {item.feedback ? item.feedback : 'No feedback'}
                                        </p>
                                        <div className={currentLanguage == 'ar' ? 'flex w-full ml-auto justify-end text-[16px] items-center' : ' text-[16px] flex items-center'} dir='ltr'>
                                            <ReactStars
                                                count={5}
                                                half={true}
                                                value={item.rating}
                                                edit={false}
                                                size={24}
                                                color2={'#ffd700'}
                                            />
                                        </div>

                                    </div>
                                    {
                                        item?.images && item?.images?.length > 0 &&
                                        <div className='flex gap-2 '>
                                            {item?.images?.map((image, index) => (
                                                <img key={index} src={image} alt='img' className='w-24 h-24 rounded-md' />
                                            ))}
                                        </div>
                                    }
                                </div>
                            </div>
                        )
                    })
            }
        </>
    )
}

export default Reviews