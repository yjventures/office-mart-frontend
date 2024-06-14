import { useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react'
import { FaHeart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import ReactStars from 'react-stars';
import { showToast } from '../../Common/Toastify/Toastify';
import axios from 'axios';
import { FaCartShopping } from "react-icons/fa6";
import Sideover from '../Cart/Sideover/Sideover';
import NotFoundWishlist from 'src/components/Common/Product/NotFoundWishlist/NotFoundWishlist';
import ProductCard from 'src/components/Common/Product/ProductCard/ProductCardWishlist';
import ProductCardWishlist from 'src/components/Common/Product/ProductCard/ProductCardWishlist';
import { calculateTotalPrice } from 'src/lib/helper/calculateTotalPrice';
import { calculateUnitPrice } from 'src/lib/helper/calculateUnitPrice';

const WishlistComponent = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const queryClient = useQueryClient();
  const [uniqueToken, setUniqueToken] = useState(localStorage.getItem('unique_token') || null)
  // console.log(uniqueToken)
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
        // showToast('Product added to wishlist', 'success')
      } else {
        showToast('Error adding product to wishlist', 'error')
      }

    } catch (error) {
      showToast('Error adding product to wishlist', 'error')
    }
  }


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
            name: productName,
            product_id: productId,
            quantity: quantity,
            price: unitPrice,
            total_price: total_price,
            shop_id: shopId,
            product_varient: product_varient
          },
          add_to_cart: true,
          "comment": ""
        })
      }

      if (response.status === 200) {
        // console.log('Product added to cart', 'info')
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
  if (isPending) return 'Loading...'

  console.log(wishlist)
  return (
    <>
      <Sideover open={open} setOpen={setOpen} />
      {wishlist && wishlist?.products?.length > 0 ? (
        <div className='grid grid-cols-1 md:grid-cols-3 gap-3 font-main relative '>
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

export default WishlistComponent