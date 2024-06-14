import React from 'react'
import offerImage from 'assets/global/home/offer-image.svg'
import topCategoryImage from 'assets/global/home/top-category.png'
import { NavLink } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

const TopCategory = () => {
    const { t, i18n } = useTranslation()
    const currentLanguage = i18n.language;

    const { data: categories } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const response = await axios.get(`${import.meta.env.VITE_API_PATH}/categories/get-all?sortBy=-weight_matrics`);
            return response?.data?.categories || [];
        },
    });
    return (
        <div dir={currentLanguage == 'ar' && 'rtl'} >
            <p className='font-[600] text-[20px] my-2 ms-2' >
                {t('titles.top_new_cat')}
            </p>
            <div className='grid md:grid-cols-3 grid-cols-1 gap-4 place-content-start mt-4'>
                {
                    categories?.slice(0, 3)?.map((item, index) => {
                        return (
                            <NavLink key={index} to={`/product-catalogue?category=${item.name}`} className='flex flex-col items-center gap-1 ' >
                                <div className='rounded-md w-full overflow-hidden '>
                                    <img src={item?.image} alt="image" className='mx-auto h-[220px] object-cover w-full rounded-sm hover:scale-105 transition' />
                                </div>
                                <p className='font-[600]'>
                                    {item?.name}
                                </p>
                                <p>
                                    {item?.total} Available Items
                                </p>
                            </NavLink>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default TopCategory