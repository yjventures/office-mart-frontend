import { useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useTranslation } from 'react-i18next';
import { MdOutlineFavorite, MdOutlineFavoriteBorder } from 'react-icons/md';
import { showToast } from 'src/components/Common/Toastify/Toastify';
import { HiChatBubbleLeftRight } from 'react-icons/hi2';
import { ImHome } from 'react-icons/im';
import { useNavigate } from 'react-router-dom';
import NotFoundShop from './NotFoundShop';

const FavShops = () => {
    const user = JSON.parse(localStorage.getItem('user'))
    const token = JSON.parse(localStorage.getItem('token'))
    const { t, i18n } = useTranslation();
    const currentLanguage = i18n.language;
    const queryClient = useQueryClient();
    const [shop, setShop] = useState([])
    const [shopAleadyFav, setShopAleadyFav] = useState(false);
    const navigate = useNavigate()

    const { isError: favShopError, isPending: favShopPending, data: favShop } = useQuery({
        queryKey: ['Favshop', user?._id],
        queryFn: async () => {
            const response = await axios.get(`${import.meta.env.VITE_API_PATH}/favourite-shops/get-list/${user?._id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token.accessToken}`
                    }
                }
            )
            return response?.data?.favourite_shop_list;
        }
    })
    useEffect(() => {
        const found = favShop?.find(myShops => myShops?.shop_id?._id === shop?._id)
        if (found) {
            setShopAleadyFav(true)
        } else {
            setShopAleadyFav(false)
        }
    }, [favShop])


    // console.log(favShop)

    const handleToggleVendorFavourite = async () => {
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_PATH}/favourite-shops/create`,
                {
                    "user_id": user?._id,
                    "shop_id": shop?._id
                },
                {
                    headers: {
                        Authorization: `Bearer ${token.accessToken}`
                    }
                }
            )
            if (res.status === 200) {
                if (shopAleadyFav) {
                    showToast('Removed from favourite vendor list', 'info')
                } else {
                    showToast('Added to favourite vendor', 'success')
                }
                queryClient.invalidateQueries({ queryKey: ['Favshop'] })
            }

        } catch (e) {
            // console.log(e)
            showToast('Something went wrong', 'error')
        }

    }

    return (
        <>

            {
                favShop?.length == 0 ? <NotFoundShop /> :
                    <div className='grid md:grid-cols-3 grid-cols-1 gap-4 mt-3'>

                        {
                            favShop?.map((shop, index) => {
                                return (
                                    <div
                                        style={{
                                            boxShadow: '0px 1px 3px 0px #03004717'
                                        }}
                                        key={index}
                                        className='relative cursor-pointer'
                                        onClick={() => setShop(shop.shop_id)}
                                    >
                                        <div className='overflow-hidden relative'>
                                            <img
                                                src={shop?.shop_id?.banner}
                                                alt="Banner"
                                                className="w-full h-[200px] object-contain rounded-t-md hover:scale-105 transition"
                                            />
                                        </div>
                                        <div className='flex items-center justify-start flex-col w-full px-3 pb-3'>
                                            <div className='flex items-start text-[12px] underline text-gray-400 flex-wrap'>
                                                <p className='text-gray-600 ms-2 cursor-pointer'>
                                                    {/* Assuming shop tags */}
                                                    {shop?.tags?.length === 0 ? 'No tag available' : shop?.tags?.join(', ')}
                                                </p>
                                            </div>
                                            <div className="mb-4 relative w-full my-2">
                                                <p className='font-bold'>
                                                    {/* Assuming shop name */}
                                                    {currentLanguage == 'ar' ? shop?.shop_id?.name?.ac : shop?.shop_id?.name?.en}
                                                </p>

                                                {/* fav vendor add and remove */}
                                                <p className='absolute top-0 right-2 cursor-pointer transition' onClick={handleToggleVendorFavourite}>
                                                    {shopAleadyFav ? <MdOutlineFavorite className='w-6 h-6' title='Add to favourite' /> : <MdOutlineFavoriteBorder className='w-6 h-6' title='Remove from favourite' />}
                                                </p>
                                            </div>
                                            <div className='flex w-full gap-3 mt-4'>
                                                {/* chat button */}
                                                <button
                                                    onClick={() => navigate(`/user-single-chat?shopId=${shop.shop_id?._id}&shopName=${shop?.shop_id?.name?.en}&banner=${shop?.shop_id?.banner}`)}
                                                    className='bg-black text-white px-4 py-1 mt-10 md:mt-0 w-full rounded-md content-center flex justify-center items-center gap-2'
                                                >
                                                    Chat
                                                    <HiChatBubbleLeftRight className='w-4 h-4 hover:animate-bounce' />
                                                </button>
                                                {/* visit vendor-page button */}
                                                <button
                                                    onClick={() => navigate(`/vendor-page?name=${encodeURIComponent(shop?.shop_id?.name?.en)}`)}
                                                    className='bg-black text-white px-4 py-1 mt-10 md:mt-0 w-full rounded-md content-center flex justify-center items-center gap-2'
                                                >
                                                    Visit
                                                    <ImHome className='w-4 h-4 hover:animate-bounce' />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
            }
        </>

    )
}

export default FavShops