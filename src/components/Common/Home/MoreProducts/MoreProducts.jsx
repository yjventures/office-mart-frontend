import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import React, { useState } from 'react'
import ReactStars from 'react-stars';
import { showToast } from '../../Toastify/Toastify';
import { useNavigate } from 'react-router-dom';
import { CiHeart } from "react-icons/ci";
import ProductCardNormal from '../../Product/ProductCard/ProductCardNormal';
import { useTranslation } from 'react-i18next';
import ProductCardWishlist from '../../Product/ProductCard/ProductCardWishlist';
import Sideover from 'src/components/User/Cart/Sideover/Sideover';
import { calculateTotalPrice } from 'src/lib/helper/calculateTotalPrice';
import { calculateUnitPrice } from 'src/lib/helper/calculateUnitPrice';

const MoreProducts = () => {
    const { t, i18n } = useTranslation()
    const currentLanguage = i18n.language;
    const [open, setOpen] = useState(false);
    const user = JSON.parse(localStorage.getItem('user'))?._id
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [isLoadingCart,setIsLoadingCart] = useState(false)

    const { isPending, isError, error, data } = useQuery({
        queryKey: ['more_for'],
        queryFn: async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_PATH}/products/get-all?limit=20&is_published=true&draft=false`)
                // console.log(response.data)
                return response?.data?.product_info
            } catch (error) {
                console.error(`Error fetching data`);
            }
        },
    });

    const { isPending: isPendingWishlist, isError: isErrorWishlist, error: errorWishlist, data: wishlist } = useQuery({
        queryKey: ['userWishlist'],
        queryFn: async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_PATH}/wishlists/wishlist/${user}`, {
                    headers: {
                        Authorization: `Bearer ${JSON.parse(localStorage.getItem('token')).accessToken}`,
                    },
                });

                const jsonData = await response.json();

                return jsonData?.wishlist;
            } catch (error) {
                console.error(error)
            }
        },
        enabled: user ? true : false
    });

    const handleAddtoWishlist = async (productId) => {
        if (!user) {
            showToast('Please signin to add to wishlist', 'info')
            navigate('/signin')
            return;
        }

        try {
            const response = await axios.put(`${import.meta.env.VITE_API_PATH}/wishlists/add-product/${user}`, {
                product: productId,
            }, {
                headers: {
                    Authorization: `Bearer ${JSON.parse(localStorage.getItem('token')).accessToken}`
                }
            })

            // console.log(response.data)
            if (response.status === 200) {
                queryClient.invalidateQueries({ queryKey: ['userWishlist'] })
                queryClient.invalidateQueries({ queryKey: ['header_count'] })
                showToast('Updated your wishlist', 'info')
            } else {
                showToast('Error adding product to wishlist', 'error')
            }

        } catch (error) {
            showToast('Error adding product to wishlist', 'error')
        }
    }

    // console.log(isErrorWishlist, errorWishlist)

    // add to wishlist
    // const handleAddtoWishlist = async (productId) => {
    //     if (!user) {
    //         showToast('Please signin to add to wishlist', 'info')
    //         navigate('/signin')
    //         return;
    //     }

    //     try {
    //         const response = await axios.put(`${import.meta.env.VITE_API_PATH}/wishlists/add-product/${user}`, {
    //             product: productId,
    //         }, {
    //             headers: {
    //                 Authorization: `Bearer ${JSON.parse(localStorage.getItem('token')).accessToken}`
    //             }
    //         })

    //         // console.log(response.data)
    //         if (response.status === 200) {
    //             queryClient.invalidateQueries({ queryKey: ['userWishlist'] })
    //             queryClient.invalidateQueries({ queryKey: ['header_count'] })
    //             // showToast('Product added to wishlist', 'success')
    //         } else {
    //             showToast('Error adding product to wishlist', 'error')
    //         }

    //     } catch (error) {
    //         showToast('Error adding product to wishlist', 'error')
    //     }
    // }

    // const handleRemoveFromWishlist = async (productId, showMessage) => {
    //     try {
    //         const response = await axios.put(`${import.meta.env.VITE_API_PATH}/wishlists/delete-product/${user}`, {
    //             product: productId,
    //         }, {
    //             headers: {
    //                 Authorization: `Bearer ${JSON.parse(localStorage.getItem('token')).accessToken}`
    //             }
    //         })

    //         if (response.status === 200) {
    //             queryClient.invalidateQueries({ queryKey: ['userWishlist'] })
    //             if (showMessage == true) {
    //                 showToast('Product removed from wishlist', 'info')
    //             }

    //         } else {
    //             showToast('Error removing product from wishlist', 'error')
    //         }
    //     } catch (error) {
    //         showToast('Error removing product from wishlist', 'error')
    //     }
    // };

    const [uniqueToken, setUniqueToken] = useState(localStorage.getItem('unique_token') || null)
    const handleAddToCart = async (product) => {
        setIsLoadingCart(true)
        let productNameForCart, variationForCart = null;
        if (product?.variations?.length > 0) {
            productNameForCart = product?.name?.en + ' ' + product?.variations[0]?.name?.en;
            variationForCart = product?.variations[0];
        } else {
            productNameForCart = product?.name?.en
        }
        // const productName = selectedVariationDetails?.name ? product?.name?.en + ' ' + selectedVariationDetails.name.en : product?.name?.en;
        const productId = product?._id;
        const shopId = product?.shop;
        // For price, check if selectedVariationDetails is defined and has an on_sale property
        const total_price = calculateTotalPrice(product, 1, variationForCart);
        const unitPrice = calculateUnitPrice(product, 1, variationForCart)
        const product_varient = variationForCart?._id;
        const userId = JSON.parse(localStorage.getItem('user'))?._id
        // add product to cart
        try {
            let response = null;
            // for registered user
            if (userId) {
                response = await axios.put(`${import.meta.env.VITE_API_PATH}/carts/add-product/${userId}`, {
                    product_item: {
                        user_id: userId,
                        name: productNameForCart,
                        product_id: productId,
                        quantity: 1,
                        price: unitPrice,
                        total_price: total_price,
                        shop_id: shopId,
                        product_varient: product_varient
                    },
                    add_to_cart: true,
                    "comment": ""
                })
            } else {
                // for guest user
                // console.log(uniqueToken)
                response = await axios.put(`${import.meta.env.VITE_API_PATH}/carts/add-product-token/${uniqueToken}`, {
                    product_item: {
                        unique_token: uniqueToken,
                        name: productNameForCart,
                        product_id: productId,
                        quantity: 1,
                        price: unitPrice,
                        total_price: total_price,
                        shop_id: shopId,
                        product_varient: product_varient
                    },
                    add_to_cart: true,
                    "comment": ""
                })
            }
            console.log(response)
            if (response.status === 200) {
                console.log('Product added to cart', 'info')
            } else if (response.status === 401) {
                showToast('Access token expired, Login again', 'error')
            } else {
                showToast('Something went wrong', 'error')
            }
        } catch (error) {
            console.error('Catched error', error)
        }
        setOpen(true)
        setIsLoadingCart(false)
        queryClient.invalidateQueries({ queryKey: ['header_count'] })
    }

    console.log(data)
    return (
        <div className='font-main mt-6' >
            <Sideover open={open} setOpen={setOpen} />
            <div className='flex gap-2 items-center' dir={currentLanguage == 'ar' && 'rtl'}>
                <p className='text-[20px] font-[600] text-secondary-color'>{t('titles.more_for_you')}</p>
            </div>
            {
                isPending && <p>Loading...</p>
            }
            {
                isError && <p>Something went wrong</p>
            }
            <div className='grid md:grid-cols-3 lg:grid-cols-4 grid-cols-1 gap-4 my-10'>
                {
                    data?.length == 0 && <p>No products found</p>
                }
                 {
                    data?.slice(0, 24)?.map((product, index) => (
                        <div key={index} className={`sm:pe-4 my-3`}>
                            <ProductCardWishlist
                                key={index}
                                productItem={product}
                                handleRemoveFromWishlist={handleAddtoWishlist} // toggle wihslist
                                handleAddToCart={handleAddToCart}
                                wishlist={wishlist}
                                isInWishlistCheckEnabled={true}
                            />

                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default MoreProducts