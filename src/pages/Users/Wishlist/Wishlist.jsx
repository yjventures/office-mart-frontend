import { useAtomValue } from 'jotai'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import UserDetails from 'src/components/Profile/UserDetails/UserDetails'
import { userAtom } from 'src/lib/jotai'
import heartIcon from "assets/wishlist-and-orders/heart.svg"
import { IoReorderThreeOutline } from 'react-icons/io5';
import ProfileSidebar from 'src/components/Profile/ProfileSidebar/ProfileSidebar'
import { FaHeart } from "react-icons/fa6";
import { showToast } from 'src/components/Common/Toastify/Toastify'
import WishlistComponent from 'src/components/User/Wishlist/WishlistComponent'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { useTranslation } from 'react-i18next'

const Wishlist = () => {
  const [showSidebar, setShowSidebar] = React.useState(false)
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user'));
  const queryClient = useQueryClient();
  const [isLoadingCart, setIsLoadingCart] = useState(false);
  const userId = JSON.parse(localStorage.getItem('user'))._id;
  const { t, i18n } = useTranslation()
  const currentLanguage = i18n.language;

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
        console.error(`Error fetching wishlist: ${error.message}`);
      }
    },
  });



  const handleRemoveFromWishlist = async (productId, showMessage) => {
    try {
      const response = await axios.put(`${import.meta.env.VITE_API_PATH}/wishlists/delete-product/${user?._id}`, {
        product: productId,
      }, {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('token')).accessToken}`
        }
      })

      if (response.status === 200) {
        queryClient.invalidateQueries({ queryKey: ['userWishlist'] })
        if (showMessage == true) {
          showToast('Product removed from wishlist', 'info')
        }

      } else {
        showToast('Something went wrong', 'error');
      }
    } catch (error) {
      showToast('Something went wrong', 'error');
    }
  };

  const handleRemoveAllFromWishlist = async () => {
    try {

      // Iterate through each wishlist item and remove all products
      // for (const wishlistItem of wishlist) {
      const products = wishlist.products;

      for (const productItem of products) {
        const product = productItem.product;
        await handleRemoveFromWishlist(product._id, false);
      }
      // }
    } catch (error) {
      console.error('Error removing all products from wishlist', error);
      showToast('Something went wrong', 'error');
    }
  };


  const handleAllAddToCart = async () => {

    setIsLoadingCart(true);

    try {
      // Iterate through each product in the wishlist and add it to the cart
      // for (const wishlistItem of wishlist) {
      const products = wishlist.products;

      for (const productItem of products) {
        const product = productItem.product;
        await axios.put(`${import.meta.env.VITE_API_PATH}/carts/add-product/${userId}`, {
          product_item: {
            user_id: userId,
            name: product.name.en,
            product_id: product._id,
            quantity: 1,
            price: product.on_sale ? product.sales_price : product.price,
            total_price: product.on_sale ? Number(product.sales_price) * 1 : Number(product.price) * 1,
            shop_id: product.shop
          },
          add_to_cart: true,
          comment: ""
        });
      }
      // }

      await handleRemoveAllFromWishlist();
      showToast('All products added to cart', 'success');
      navigate('/cart');
    } catch (error) {
      console.error('Caught error', error);
      showToast('Something went wrong', 'error');
    }

    setIsLoadingCart(false);
  };


  return (
    <div className='h-full p-3 font-main lg:-ms-10 lg:-mt-4'>
      <div className='lg:flex justify-between items-center relative'>
        <div className='flex items-center'>
          <FaHeart className='w-5 h-5 text-tertiary-600' />
          <p className='text-xl font-bold ms-2'>{t('wishlist.title')}</p>
        </div>
        <div className={`lg:hidden absolute top-0 ${currentLanguage == 'ar' ? 'left-2' : 'right-2'}`}>
          <IoReorderThreeOutline className='w-[20px] h-[20px]' onClick={() => {
            setShowSidebar(!showSidebar)
          }} />
        </div>
        <div className='lg:hidden'>
          {
            showSidebar && <ProfileSidebar />
          }
        </div>

        {/* // Add all to cart button */}
        <button
          onClick={() => {
            if (isLoadingCart) return;
            // console.log(wishlist)
            if (!wishlist || wishlist.products.length === 0) {
              showToast('No products in wishlist', 'info');
              return;
            }
            handleAllAddToCart()
          }}
          className='border-2 text-tertiary-600 px-[20px] py-[6px] rounded-sm text-[16px] font-[600] transition my-4 lg:mt-0'>
          {t('wishlist.add_all_to_cart')}
        </button>
      </div>
      {/* component of wishlist */}
      <WishlistComponent />
    </div>
  )
}

export default Wishlist