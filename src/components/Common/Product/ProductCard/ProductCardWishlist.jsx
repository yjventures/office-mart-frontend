import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHeart } from 'react-icons/fa';
import ReactStars from 'react-stars';
import { FaCartShopping } from "react-icons/fa6";
import HeaderLoader from 'src/components/Header/HeaderLoader';


export default function ProductCardWishlist({ productItem, handleRemoveFromWishlist, handleAddToCart, isLoadingCart, removeAfterAddingCart }) {
    const navigate = useNavigate();

    const [product, setProduct] = useState(productItem?.product ? productItem?.product : productItem);
    // console.log(productItem, 'product')
    return (
        <div
            style={{
                boxShadow: '0px 1px 3px 0px #03004717'
            }}
            className='relative cursor-pointer'
            onClick={() => navigate(`/product/${product._id}`)}
        >
            <div className='overflow-hidden relative'>
                {product?.product_discount && (
                    <div className='absolute top-2 left-2 text-tertiary-600 text-primary-color px-2 py-1 rounded-full z-10'>
                        <p className='text-[12px] px-2 font-[300]'>{product?.product_discount}% off</p>
                    </div>
                )}
                <img
                    src={product?.images[0]}
                    alt={product?.name.en}
                    className='w-full h-[280px] object-contain rounded-t-md hover:scale-105 transition'
                />
            </div>
            <div className='flex items-center justify-start flex-col w-full px-3 pb-3'>
                <div className='flex items-center justify-between w-full my-2'>
                    <div className='flex items-start text-[12px] text-gray-400 overflow-hidden'>
                        {product?.tags?.length === 0 && <p>No tag available</p>}
                        {product?.tags?.map((tag, index) => (
                            <span key={index} className='text-[12px] pb-[1px] border-gray-300 me-1 bg-gray-100 px-1 rounded-sm text-nowrap'>
                                #{tag?.trim()?.toLowerCase()}
                            </span>
                        ))}
                    </div>

                </div>
                <div className='ms-3 flex justify-center items-start flex-col w-full gap-1 text-secondary-color'>
                    <p className='text-md font-[600]'>
                        {product?.name.en.charAt(0).toUpperCase() + product?.name.en.slice(1)}
                    </p>
                    <ReactStars count={5} value={5} edit={false} size={24} color={'#ffd700'} />

                </div>
                <div className='border-t-[1px] w-full mt-3 flex justify-between '>
                    <div className='mt-[10px] ms-2'>
                        {product?.sales_price ? (
                            <div className='flex justify-center items-center'>
                                <p className='text-[16px] font-[600] text-tertiary-600'>${product?.sales_price}</p>
                                <p className='text-[12px] text-gray-400 line-through ms-3'>${product?.price}</p>
                            </div>
                        ) : (
                            <p className='text-[16px] font-[600] text-tertiary-600'>${product?.price}</p>
                        )}
                    </div>
                    <div className='flex gap-2 mt-auto'>
                        <FaHeart
                            className='w-7 h-10 p-1 text-tertiary-700 cursor-pointer transition hover:text-tertiary-600 rounded-full'
                            onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveFromWishlist(product?._id, true);
                            }}
                        />
                        {
                            isLoadingCart ?
                                <div className='mt-4'>
                                    <HeaderLoader />
                                </div>
                                :
                                <FaCartShopping
                                    className='w-7 h-10 p-1 text-tertiary-700 cursor-pointer transition hover:text-tertiary-600 rounded-full'
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleAddToCart(product);
                                        if(removeAfterAddingCart){
                                            handleRemoveFromWishlist(product?._id, false);
                                        }
                                    }}
                                />
                        }

                    </div>
                </div>
            </div>
        </div>
    );
};