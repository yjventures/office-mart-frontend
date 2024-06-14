import React from 'react';
import { useNavigate } from 'react-router-dom';
import ReactStars from 'react-stars';
import { FaHeart } from 'react-icons/fa';
import { CiHeart } from 'react-icons/ci';
import { useTranslation } from 'react-i18next';


// used everywhere expect the wishlist
const ProductCardNormal = ({ product, wishlist, handleAddtoWishlist, isInWishlistCheckEnabled = false }) => {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation()
    const currentLanguage = i18n.language;
    // console.log(wishlist?.products?.some((p) => p.product._id == product._id))
    // console.log(product._id)
    const isInWishlist = isInWishlistCheckEnabled && wishlist && wishlist?.products?.some((p) => p.product._id === product._id);
    return (
        <div
            onClick={() => navigate(`/product/${product?._id}`)}
            style={{
                boxShadow: '0px 1px 3px 0px rgba(3, 0, 71, 0.1)',
            }}
            // className='flex items-center w-full mb-5 flex-col mx-auto rounded-lg cursor-pointer overflow-hidden'
            className={`flex items-center w-full mb-5 flex-col mx-auto rounded-lg cursor-pointer overflow-hidden h-[480px]`}
            dir={currentLanguage == 'ar' && 'rtl'}
        >
            <div className='w-full h-[277px] overflow-hidden'>
                <img
                    src={product?.images[0]}
                    alt="image"
                    className='w-full min-w-[260px] mx-auto h-[277px] object-contain rounded-t-lg hover:scale-105 transition'
                />
            </div>

            <div className='flex flex-col gap-2 rounded-b-md w-full p-4'>
                <div className='flex justify-between items-start gap-1'>
                    <div className='flex justify-start items-start flex-wrap gap-2'>
                        {product?.tags?.length === 0 && <p>No tag available</p>}
                        {product?.tags?.join(',')?.split(',')?.map((tag, index) => (
                            <span key={index} className='text-[12px] pb-[1px] border-gray-300 me-1 bg-gray-100 px-1 rounded-sm'>
                                #{tag?.trim()?.toLowerCase()}
                            </span>
                        ))}
                    </div>
                    {isInWishlistCheckEnabled ? (
                        <FaHeart
                            className={`min-w-6 min-h-6 hover:scale-110 cursor-pointer ${isInWishlist ? 'text-tertiary-600' : 'text-gray-300 border-gray-800'}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                // toggle wihslist item from backend
                                handleAddtoWishlist(product?._id);
                            }}
                        />
                    ) :
                        <CiHeart
                            className={`w-6 h-6 hover:scale-110 cursor-pointer text-gray-500 border-gray-800`}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleAddtoWishlist(product?._id);
                            }}
                        />

                    }
                </div>
                <p className='font-[600] text-md '>
                    {currentLanguage == 'ar' ?
                        product?.name?.ac ?
                            product?.name?.ac?.split(' ')?.map((word) => word?.charAt(0)?.toUpperCase() + word?.slice(1))?.join(' ') :
                            product?.name?.en?.split(' ')?.map((word) => word?.charAt(0)?.toUpperCase() + word?.slice(1))?.join(' ') :
                        product?.name?.en?.split(' ')?.map((word) => word?.charAt(0)?.toUpperCase() + word?.slice(1))?.join(' ')}
                </p>
                <div className={currentLanguage == 'ar' && 'flex w-full ml-auto justify-end'} dir='ltr'>
                    <ReactStars count={5} value={(product.rate > Math.floor(product.rate)) ? Math.floor(product.rate) + 0.5 : product.rate} edit={false} size={20} color2={'#FFCD4E'} />
                </div>
                <div className='flex justify-start items-center gap-3'>
                    {product?.sales_price ? (
                        <>
                            <p className='text-[16px] text-tertiary-500 font-[600]'>${product?.sales_price}</p>
                            <p className='text-[14px] text-gray-500 line-through'>${product?.price}</p>
                        </>
                    ) : (
                        <p className='text-[16px] text-tertiary-500 font-[600]'>${product?.price}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductCardNormal;