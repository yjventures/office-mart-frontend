import { useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import NotFoundWishlist from 'src/components/Common/Product/NotFoundWishlist/NotFoundWishlist';
import ProductCardWishlist from 'src/components/Common/Product/ProductCard/ProductCardWishlist';
import { showToast } from 'src/components/Common/Toastify/Toastify';
import axios from 'axios'


const WishListSideOver = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    const queryClient = useQueryClient();

    const [isLoadingCart, setIsLoadingCart] = useState(false);
    const [open, setOpen] = useState(false);

    const { isPending, isError, error, data: wishlist } = useQuery({
        queryKey: ['userWishlist'],
        queryFn: async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_PATH}/wishlists/wishlist/${user?._id}`, {
                    headers: {
                        Authorization: `Bearer ${JSON.parse(localStorage.getItem('token')).accessToken}`,
                    },
                });

                const jsonData = await response.json();

                return jsonData.wishlist;
            } catch (error) {
                console.error(`Error fetching data`);
            }
        },
    });


    const handleAddtoWishlist = async (productId) => {

        if (!user) {
            navigate('/signin')
            return;
        }

        try {
            const response = await axios.put(`${import.meta.env.VITE_API_PATH}/wishlists/add-product/${user?._id}`, {
                product: productId,
            }, {
                headers: {
                    Authorization: `Bearer ${JSON.parse(localStorage.getItem('token')).accessToken}`
                }
            })

            // console.log(response.data)
            if (response.status === 200) {
                queryClient.invalidateQueries({ queryKey: ['header_count'] })
                queryClient.invalidateQueries({ queryKey: ['userWishlist'] })
                queryClient.invalidateQueries({ queryKey: ['profile_sidebar_count'] })
                queryClient.invalidateQueries({ queryKey: ['cart'] });
                queryClient.invalidateQueries(['sidecart']);
            } else {
                showToast('Error adding product to wishlist', 'error')
            }

        } catch (error) {
            showToast('Error adding product to wishlist', 'error')
        }
    }

    // handleAddtoWishlist(product?._id);

    const handleAddToCart = async (product) => {
        setIsLoadingCart(true)
        let productNameForCart, variationForCart = null;

        if (product?.variations?.length > 0) {
            productNameForCart = product?.name?.en + ' ' + product?.variations[0]?.name?.en;
            variationForCart = product?.variations[0]?._id;
        } else {
            productNameForCart = product?.name?.en
        }
        
        const productName = productNameForCart;
        const productId = product?._id;
        const shopId = product?.shop;
        const userId = JSON.parse(localStorage.getItem('user'))._id
        // add product to cart
        try {
            const response = await axios.put(`${import.meta.env.VITE_API_PATH}/carts/add-product/${userId}`, {
                product_item: {
                    user_id: userId,
                    name: productName,
                    product_id: productId,
                    quantity: 1,
                    price: product.on_sale ? product?.sales_price : product?.price,
                    total_price: product.on_sale ? Number(product?.sales_price) * 1 : Number(product?.price) * 1,
                    shop_id: shopId,
                    product_varient: variationForCart
                },
                "add_to_cart": true,
                "comment": ""
            })
            if (response.status === 200) {
                // setOpen(true)
                queryClient.invalidateQueries(['sidecart']);
                showToast('Added to cart', 'info')
            } else {
                showToast('Something went wrong', 'error')
            }
        } catch (error) {
            console.error('Catched error', error)
        }
        setIsLoadingCart(false)
    }

    if (isPending) return 'Loading...'

    return (
        <>
            {wishlist && wishlist?.products?.length > 0 ? (
                <div className='grid grid-cols-1 gap-3 font-main relative px-4'>
                    {wishlist?.products?.map((productItem, index) => (
                        <ProductCardWishlist
                            key={index}
                            productItem={productItem}
                            handleRemoveFromWishlist={handleAddtoWishlist} // toggle wihslist
                            handleAddToCart={handleAddToCart}
                            removeAfterAddingCart={true}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-gray-400 text-center mt-4">
                    {isPending ? 'Loading...' :
                        <NotFoundWishlist />
                    }
                </div>
            )}
        </>

    );
}

export default WishListSideOver