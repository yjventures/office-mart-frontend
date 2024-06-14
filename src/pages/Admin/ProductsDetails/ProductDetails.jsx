import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import shirt from 'assets/global/product/shirt.png'
import ReactStars from 'react-stars'
import { IoBagHandleOutline } from "react-icons/io5";
import { CiHeart } from "react-icons/ci";
import { FaCodeCompare } from "react-icons/fa6";
import { IoShareSocial } from "react-icons/io5";
import { LiaTruckMovingSolid } from "react-icons/lia";
import { GoGift } from "react-icons/go";
import { MdOutlineDone, MdOutlineFavoriteBorder } from "react-icons/md";
import tShirt from 'assets/global/product/t-shirt.png'
import { FaEye, FaHeart } from "react-icons/fa";
import BottomAdvertisement from 'src/components/Common/BottomAdvertisement/BottomAdvertisement';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSetAtom } from 'jotai';
import { cartItemsAtom, newProductAtom } from 'src/lib/jotai';
import axios from 'axios';
import { VscSend } from "react-icons/vsc";
import { GoGitPullRequestDraft } from "react-icons/go";
import { MdOutlineEdit } from "react-icons/md";
import { showToast } from 'src/components/Common/Toastify/Toastify';
import { CiCalendarDate } from "react-icons/ci";
import { RxAvatar } from "react-icons/rx";
import Sideover from 'src/components/User/Cart/Sideover/Sideover';
import { basicColors } from 'src/lib/helper/basicColors';
import { HiChatBubbleLeftRight } from "react-icons/hi2";
import { ImHome } from "react-icons/im";
import { useTranslation } from 'react-i18next';
import Reviews from 'src/components/Common/Product/Reviews/Reviews';
import { MdOutlineFavorite } from "react-icons/md";
import { calculateTotalPrice } from 'src/lib/helper/calculateTotalPrice';
import { token as uniqueTokenGenerator } from 'src/lib/helper/uniqueTokenGenerator'



const ProductDetails = () => {
  const { id } = useParams()
  const { t, i18n } = useTranslation()
  const currentLanguage = i18n.language;
  const setCartItemAtom = useSetAtom(cartItemsAtom)
  const newProduct = useSetAtom(newProductAtom)
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user'))
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient()
  const url = window.location;
  const [uniqueToken, setUniqueToken] = useState(localStorage.getItem('unique_token') || null)

  useEffect(() => {
    // console.log(uniqueToken)
    if (uniqueToken == null) {
      let new_unique_token = uniqueTokenGenerator();
      setUniqueToken(new_unique_token)
      // console.log(uniqueToken)
      // console.log(new_unique_token)
      localStorage.setItem('unique_token', new_unique_token)
    }
  }, [])
  // fetch product by id
  const { isPending, data: product, error } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const response = await fetch(`${import.meta.env.VITE_API_PATH}/products/product/${id}`)
      // console.log(response)
      const result = await response.json();
      return result?.productInfo;

    }
  })
  // console.log(product, 'my data')
  const [quantity, setQuantity] = useState(1);
  const [isLoadingCart, setIsLoadingCart] = useState(false);
  const [isLoadingBuyNow, setIsLoadingBuyNow] = useState(false);

  const { isPending: reviewPending, isError: reviewError, data: reviewData } = useQuery({
    queryKey: ['product_review', id],
    queryFn: async () => {
      const response = await fetch(`${import.meta.env.VITE_API_PATH}/reviews/get-all?product_id=${id}`)
      const result = await response.json();
      return result;
    }

  })

  // plus product count
  const handleAddProductCount = () => {
    setQuantity(quantity + 1)
  }
  // minus product count
  const handleMinusProductCount = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const tabs = [
    {
      name: {
        en: 'Description',
        ar: 'وصف',
      },
      current: true
    },
    {
      name: {
        en: `Reviews (${reviewData?.reviews?.filter(item => item.publish === true)?.length})`,
        ar: `التعليقات (${reviewData?.reviews?.filter(item => item.publish === true)?.length})`,

      }, current: false
    },
    // {
    //     name: {
    //         en: `Questions`,
    //         ar: `أسئلة`,

    //     }, current: false
    // },
    {
      name: {
        en: `About Vendor`,
        ar: `حول البائع`,

      },
      current: false
    },
  ]
  const [selectedTab, setSelectedTab] = useState('Description');


  const [selectedImage, setSelectedImage] = useState('');
  const [selectedAttributes, setSelectedAttributes] = useState({});

  const [selectedVariationDetails, setSelectedVariationDetails] = useState({
    name: null,
    description: null,
    images: null,
    _id: null,
    on_sale: null,
    sales_price: null,
    price: null,
  });
  const handleTabClick = (tabName) => {
    setSelectedTab(tabName);
  };
  const handleTabChange = (event) => {
    setSelectedTab(event.target.value);
  };

  const handleSaveDraft = async () => {
    // Save the product to the database
    const data = {
      'is_published': false,
      'draft': true,
    };

    const res = await axios.put(`${import.meta.env.VITE_API_PATH}/products/update/${id}`, data, {
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('token')).accessToken}`
      }
    })
    if (res.status === 200) {
      showToast('Product drafted successfully', 'success')
      navigate('/vendor-products')
    } else {
      showToast('Error adding product, try again', 'error')
    }
  }

  const handlePublishProduct = async () => {
    // Save the product to the database
    const data = {
      'is_published': true,
    }

    const res = await axios.put(`${import.meta.env.VITE_API_PATH}/products/update/${id}`, data, {
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('token')).accessToken}`
      }
    })
    if (res.status === 200) {
      showToast('Product published successfully', 'success')
      navigate('/vendor-products')
    } else {
      showToast('Error adding product, try again', 'error')
    }
  }

  const fetchProductById = async (productId) => {
    const response = await fetch(`${import.meta.env.VITE_API_PATH}/products/product/${productId}`);
    const result = await response.json();
    return result?.productInfo;
  };

  // Inside your component
  const RelatedProducts = ({ product }) => {
    const relatedProductIds = product?.related_products || [];

    // Fetch related products using separate useQuery calls
    const relatedProductsQueries = relatedProductIds.map((productId) => {
      return useQuery({
        queryKey: ['product', productId],
        queryFn: () => fetchProductById(productId),
      });
    });

    // Extract data and error from each query result
    const relatedProductsData = relatedProductsQueries.map((query) => query.data);
    const relatedProductsError = relatedProductsQueries.find((query) => query.error);
    // console.log(relatedProductsData, 'related')
    return (
      <div>
        {/* {relatedProductsQueries.some((query) => query.isFetching) && <p>Loading...</p>} */}
        {/* {relatedProductsError && <p>Error: {relatedProductsError?.message}</p>} */}
        {relatedProductsData.length > 0 && (
          <div className='grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-5'>
            {relatedProductsData.map((item, index) => {
              // Render your related product component here
              // console.log(item)
              return (

                <div key={index} className='ms-2 relative border p-3 flex flex-col items-center gap-3 border-gray-200 w-[232px] rounded-md mx-auto'>
                  <div className='flex justify-center items-center rounded-md '>
                    <img src={item?.images[0]} alt="image" className='w-full h-[150px]  rounded-md' />
                  </div>
                  {/* view and wishlist button */}
                  <div className='flex justify-center gap-3 flex-col absolute right-5 top-5'>
                    {/* view icon */}
                    <div
                      style={{
                        // drop shadow
                        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.1)'
                      }}
                      onClick={() => {
                        navigate(`/product/${item._id}`)
                      }}
                      className='w-[30px] h-[30px] rounded-full cursor-pointer flex justify-center items-center hover:bg-white transition'>
                      <FaEye className='text-gray-400' />
                    </div>
                    {/* wishlist icon */}
                    {/* <div
                                            style={{
                                                // drop shadow
                                                boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.1)'
                                            }}
                                            className='w-[30px] h-[30px] rounded-full cursor-pointer flex justify-center items-center'>
                                            <CiHeart className='text-gray-700' />
                                        </div> */}
                  </div>
                  {/* name and price */}
                  <p className='text-[16px] font-[600] text-secondary-color mt-10 text-center'>{item?.name.en}</p>
                  <p className='text-[16px] font-[600] text-tertiary-600'>${item?.price}</p>

                  {/* <div className='flex items-center gap-1'>
                                        <ReactStars
                                            count={5}
                                            value={item?.rating}
                                            edit={false}
                                            size={24}
                                            color2={'#ffd700'}
                                        />
                                        <span className='gray-800 ms-3 mt-1'>({item?.reviews?.length})</span>
                                    </div> */}
                  {/* add to wishlist */}
                  <div className='w-full' >
                    <div
                      className='border border-gray-200 py-2 flex justify-center gap-2 items-center rounded-md cursor-pointer bg-black text-primary-color transition'
                      onClick={() => {
                        handleAddtoWishlist(item._id)
                      }}
                    >
                      <p
                        className='text-[16px] font-[600]'
                      >
                        <p className='text-[16px]'>{t('product.add_to_wishlist')}</p>
                      </p>
                      <FaHeart className='min-w-4 min-h-4 text-primary-color' />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )
        }
      </div>
    );
  };


  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }
  const [isView, setIsView] = useState(false)
  // use url params to get isView value
  const urlSearchParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlSearchParams.entries());

  useEffect(() => {
    if (params.isView == 'true') {
      setIsView(true)
    }
  }, [params, urlSearchParams])

  useEffect(() => {
    // Check if product.images array exists and has at least one image
    if (product?.images?.length > 0) {
      setSelectedImage(product?.images[0]);
    }

    if (selectedVariationDetails) {
      if (selectedVariationDetails?.images?.length > 0) {
        // console.log()
        setSelectedImage(selectedVariationDetails?.images[0]);
      } else {
        setSelectedImage(product?.images[0]);
      }
    }

  }, [product, selectedVariationDetails]);

  const token = JSON.parse(localStorage.getItem('token'))
  const handleAddtoWishlist = async (productId) => {
    try {
      const response = await axios.put(`${import.meta.env.VITE_API_PATH}/wishlists/add-product/${user?._id}`, {
        product: productId,
      }, {
        headers: {
          Authorization: `Bearer ${token.accessToken}`
        }
      })

      // console.log(response.data)
      if (response.status == 200) {
        setOpen(true)
      } else {
        showToast('Error adding product to wishlist', 'error')
      }

    } catch (error) {
      console.error(error.response.status)
      if (error.response.status == 401) {
        showToast('Please signin again to add product to wishlist', 'error')
        navigate('/signin')
      } else {
        showToast('Somwething went wrong', 'error')
      }
    }
    queryClient.invalidateQueries({ queryKey: ['header_count'] })

  }
  // add to cart
  const handleAddToCart = async () => {
    setIsLoadingCart(true)

    const productName = selectedVariationDetails?.name ? product?.name?.en + ' ' + selectedVariationDetails.name.en : product?.name?.en;
    const productId = product?._id;
    const shopId = product?.shop;
    // For price, check if selectedVariationDetails is defined and has an on_sale property
    const price = selectedVariationDetails && selectedVariationDetails.on_sale ? selectedVariationDetails.sales_price : product?.price;
    const total_price = price * quantity;
    const product_varient = selectedVariationDetails?._id;
    // console.log(productName)
    // console.log(productId)
    // console.log(shopId)
    // console.log(price, 'price')
    // console.log(total_price, 'total price');
    // return
    const userId = JSON.parse(localStorage.getItem('user'))?._id
    // console.log(userId)
    // add product to cart
    try {
      let response = null;
      if (userId) {
        response = await axios.put(`${import.meta.env.VITE_API_PATH}/carts/add-product/${userId}`, {
          product_item: {
            user_id: userId,
            name: productName,
            product_id: productId,
            quantity: quantity,
            price: price,
            total_price: total_price,
            shop_id: shopId,
            product_varient: product_varient
          },
          add_to_cart: true,
          "comment": ""
        })
      } else {
        // let new_unique_token = uniqueToken;
        // console.log(uniqueToken)
        response = await axios.put(`${import.meta.env.VITE_API_PATH}/carts/add-product-token/${uniqueToken}`, {
          product_item: {
            unique_token: uniqueToken,
            name: productName,
            product_id: productId,
            quantity: quantity,
            price: price,
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


  //  set attributes
  useEffect(() => {
    // Initialize selectedAttributes with the first option of each attribute
    const initialAttributes = {};
    product?.variations?.forEach(variation => {
      variation.attributes.forEach(attr => {
        if (!initialAttributes[attr.attribute]) {
          initialAttributes[attr.attribute] = attr.value;
        }
      });
    });
    setSelectedAttributes(initialAttributes);
  }, [product?.variations]);

  const handleAttributeChange = (attribute, value) => {
    setSelectedAttributes(prev => ({ ...prev, [attribute]: value }));
  };

  // console.log(selectedAttributes, 'attributes')
  // console.log(selectedVariationDetails, 'variation')
  const handleSelectVariation = () => {
    const matchingVariation = product?.variations?.find(variation => {
      // Check if every selected attribute matches the variation's attributes
      return Object.entries(selectedAttributes).every(([attribute, value]) => {
        // Find the attribute in the variation's attributes array
        const varAttr = variation.attributes.find(attr => attr.attribute === attribute);
        // Return true if the attribute exists and its value matches the selected value
        return varAttr && varAttr.value === value;
      });
    });

    // console.log(matchingVariation, 'matched')
    if (matchingVariation) {
      // Update the selected variation details
      setSelectedVariationDetails({
        name: matchingVariation.name || product?.name?.en, // Fallback to product name if variation name is not available
        description: matchingVariation.description || product?.description?.en, // Fallback to product description if variation description is not available
        images: matchingVariation?.images || product?.images, // Fallback to the first product image if variation images are not available
        _id: matchingVariation._id || product?._id,
        on_sale: matchingVariation.on_sale || product?.on_sale,
        sales_price: matchingVariation.sales_price || product?.sales_price,
        price: matchingVariation.price || product?.price
      });
    }
  };
  // console.log(product)
  // console.log(selectedVariationDetails)
  // Trigger handleSelectVariation whenever selectedAttributes changes
  useEffect(() => {
    handleSelectVariation();
  }, [selectedAttributes]);
  // console.log(selectedVariationDetails, 'variation')
  // Group variations by attribute for display

  const renderVariationOptions = () => {
    const attributesGroup = product?.variations?.reduce((acc, variation) => {
      variation?.attributes?.forEach(attr => {
        if (!acc[attr?.attribute]) {
          acc[attr?.attribute] = new Set();
        }
        acc[attr?.attribute]?.add(attr.value);
      });
      return acc;
    }, {});

    const getColorHex = (colorName) => {
      // Split the input color name into words for case-insensitive comparison
      const colorNameWords = colorName?.toLowerCase()?.split(/\s+/);
      // Find a color in the basicColors array that includes at least one of the words in colorNameWords
      const color = basicColors.find(c =>
        colorNameWords?.some(word =>
          c?.name?.toLowerCase().split(/\s+/).includes(word)
        )
      );
      // Return the hex value if a matching color is found, otherwise return null
      return color ? color.hex : null;
    };

    return Object.entries(attributesGroup).map(([attribute, values]) => (
      <div key={attribute} className='mt-[20px]'>
        <p className='text-[16px] font-[600] text-secondary-color'>
          {attribute}: <span className='text-tertiary-600 ms-2'>{selectedAttributes[attribute]}</span>
        </p>
        <div className='flex items-center gap-3 mt-2'>
          {Array.from(values).map(value => {
            const isColorAttribute = attribute.toLowerCase() === 'color' || attribute.toLowerCase() === 'colors';
            if (isColorAttribute) {
              const colorHex = getColorHex(value); // Get hex value for the color
              return (
                <div
                  key={value}
                  onClick={() => handleAttributeChange(attribute, value)}
                  className={`outline-none size-8 rounded-full px-4 flex justify-center items-center cursor-pointer outline ${selectedAttributes[attribute] === value ? ' outline-gray-300' : 'outline-gray-100'}`}
                  style={{ backgroundColor: colorHex || value }}
                ></div>
              );
            } else {
              return (
                <div
                  key={value}
                  onClick={() => handleAttributeChange(attribute, value)}
                  className={`border border-gray-100 outline-none h-[40px] px-4 flex justify-center items-center rounded-md cursor-pointer  ${selectedAttributes[attribute] === value ? 'bg-secondary-color text-primary-color ' : 'bg-primary-color text-secondary-color'}`}
                >
                  <p className='text-[16px] font-[600]'>{value}</p>
                </div>
              );
            }
          })}
        </div>
      </div>
    ));
  };

  const getImages = () => {
    const images = selectedVariationDetails?.images?.length > 0 ? selectedVariationDetails.images : product?.images;
    // Ensure product?.images[0] is included
    if (!images.includes(product?.images[0])) {
      return [product?.images[0], ...images];
    }
    return images;
  };

  const findCurrentImageIndex = () => {
    const images = getImages();
    return images.findIndex(image => image === selectedImage);
  };

  const handlePreviousImage = () => {
    const images = getImages();
    const currentIndex = findCurrentImageIndex();
    const previousIndex = currentIndex - 1 < 0 ? images.length - 1 : currentIndex - 1;
    setSelectedImage(images[previousIndex]);
  };

  const handleNextImage = () => {
    const images = getImages();
    const currentIndex = findCurrentImageIndex();
    const nextIndex = (currentIndex + 1) % images.length;
    setSelectedImage(images[nextIndex]);
  };
  // for showing product image
  const itemToMap = selectedVariationDetails?.images?.length > 0 ? selectedVariationDetails : product;

  const handleBuyNow = async () => {
    // if (!user) {
    // showToast('Signin to buy the product', 'info');
    // }
    setIsLoadingBuyNow(true);
    // console.log(quantity);
    // console.log('.................');
    // return

    const productName = product?.name?.en +
      (selectedVariationDetails.name !== null
        ? ' (' + selectedVariationDetails.name.en + ')'
        : '')
    const productId = product?._id;
    const shopId = product?.shop;
    const price = selectedVariationDetails && selectedVariationDetails.on_sale ? selectedVariationDetails.sales_price : product?.price;
    const total_price = price * quantity;
    const product_varient = selectedVariationDetails?._id;
    const userId = JSON.parse(localStorage.getItem('user'))?._id;
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_PATH}/order-items/create`, {
        user_id: user?._id,
        name: productName,
        product_id: productId,
        quantity: quantity,
        price: price,
        total_price: total_price,
        shop_id: shopId,
        product_varient: product_varient,
        image: product?.images[0]

      });
      // console.log("Response Data:", response.data.productItem);
      // return
      if (response.status === 200) {
        const newItem = {
          name: {
            en: productName
          },
          _id: response.data?.productItem?._id,
          price: price,
          quantity: quantity,
          total_price: total_price, // Adjust based on quantity if needed
          image: selectedVariationDetails?.images ? selectedVariationDetails?.images[0] : product?.images[0], // Assuming there's at least one image
          product_id: {
            _id: product?._id,
          },
          shop_id: {
            _id: shopId, // Assuming you have shop_id in your product details
          },
          product_varient: product_varient, // Adjust according to your data structure
          ordered: true,
          order_date: new Date(),
          paid_amount: price // Adjust based on quantity if needed
        };

        // Now, update the cartItemsAtom or localStorage directly
        const cartItems = {
          user_id: userId,
          items: [newItem],
          sub_total: price * quantity, // Adjust if you're considering quantity
          tax: 0,
          total_price: total_price,
          comment: "",
          shipping: 0,
          discount: 0,
          // estimation = current date + 3 days
          estimation_date: new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000),
          creation_date: new Date(),
          buy_now: true
        }

        setCartItemAtom(cartItems)
        navigate('/delivery');
      } else {
        showToast('Something went wrong', 'error');
      }

    } catch (error) {
      console.error("Error adding product to cart:", error);
      showToast('Error adding product to bag', 'error');
    } finally {
      setIsLoadingBuyNow(false);
    }
  };

  const { isError: shopError, isPending: shopPending, data: shop } = useQuery({
    queryKey: ['shop', product?.shop],
    queryFn: async () => {
      const response = await axios.get(`${import.meta.env.VITE_API_PATH}/shops/shop/${product?.shop}`)
      return response?.data?.shop;
    }
  })

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


  const [shopAleadyFav, setShopAleadyFav] = useState(false);
  // console.log(shopAleadyFav)
  useEffect(() => {
    const found = favShop?.find(myShops => myShops?.shop_id?._id === shop?._id)
    // console.log(found)
    if (found) {
      setShopAleadyFav(true)
    } else {
      setShopAleadyFav(false)
    }
  }, [favShop])

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
          showToast('Removed from favourite shop list', 'info')
        } else {
          showToast('Added to favourite shop', 'success')
        }
        queryClient.invalidateQueries({ queryKey: ['Favshop'] })
      }

    } catch (e) {
      // console.log(e)
      showToast('Something went wrong', 'error')
    }

  }
  // console.log(favShop)
  // console.log(shopAleadyFav)

  const RenderVendorInfo = () => {
    // Store name, description, logo, selling category
    return (
      <div className='md:flex gap-2 items-center'>
        <img
          alt="Banner"
          className="aspect-[2/1] overflow-hidden rounded-lg object-cover object-center w-full h-[300px] "
          // height="200"
          src={shop?.banner}
          width="400"
        />
        <div className='w-full flex justify-between items-center h-[300px] flex-col'>
          <div className='flex justify-start ps-3 items-start w-full flex-col'>
            <div className="mb-4 relative w-full">
              {/* <p className='font-bold'>{currentLanguage == 'ar' ? shop?.name?.ar : shop?.name?.en}</p> */}
              <p className='font-bold'>{currentLanguage == 'ar' ? shop?.name?.ac : shop?.name?.en}</p>
              <p className='mt-1'>
                {
                  (currentLanguage === 'ar' ? (shop?.description?.ac ? (shop?.description?.ac.length > 200 ? shop?.description?.ac.slice(0, 200) + '...' : shop?.description?.ac) : '') : (shop?.description?.en ? (shop?.description?.en.length > 350 ? shop?.description?.en.slice(0, 350) + '...' : shop?.description?.en) : ''))
                }
              </p>
              {/* fav vendor add and remove */}
              <p
                className='absolute top-0 right-2 cursor-pointer transition'
                onClick={handleToggleVendorFavourite}
              >
                {
                  shopAleadyFav ? <MdOutlineFavorite className='w-6 h-6' title='Remove from favourite' /> : <MdOutlineFavoriteBorder className='w-6 h-6' title='Add to favourite' />
                }
              </p>
            </div>

          </div>
          <div className='flex w-full gap-3'>

            {/* chat button */}
            <button
              onClick={() => showToast('Admin view enabled', 'info')}
              className='bg-black text-white px-4 py-2 mt-10 md:mt-0 w-full rounded-md content-center flex justify-center items-center gap-2'
            >
              {t('buttons.chat_with_vendor')}
              <HiChatBubbleLeftRight className='w-6 h-5 hover:animate-bounce' />
            </button>

            {/* visit vendor-page button */}
            <button
              onClick={() => showToast('Admin view enabled', 'info')}
              className='bg-black text-white px-4 py-2 mt-10 md:mt-0 w-full rounded-md content-center flex justify-center items-center gap-2'
            >
              {t('buttons.visit_shop')}
              <ImHome className='w-6 h-5 hover:animate-bounce' />
            </button>
          </div>

        </div>
      </div >
    )
  }

  const totalPrice = calculateTotalPrice(product, quantity, selectedVariationDetails);
  // console.log("Total Price:", totalPrice);

  const originalPrice = selectedVariationDetails?.images?.length > 0 ? selectedVariationDetails?.price : product?.price;
  const salesPrice = selectedVariationDetails?.images?.length > 0 ? selectedVariationDetails?.sales_price : product?.sales_price;
  const percentageDiscount = ((originalPrice - salesPrice) / originalPrice) * 100;
  // console.log(originalPrice, salesPrice, 'compare')
  // console.log(reviewData, 'review')
  const findVariationByName = (product, selectedVariationDetails) => {
    return product?.variations?.find(variation => variation?.name?.en === selectedVariationDetails?.name?.en);
  };

  const selectedVariation = findVariationByName(product, selectedVariationDetails);



  return (
    <div className='max-w-7xl mx-auto h-full p-3 font-main md:mt-[60px] mt-[30px] overflow-hidden' dir={currentLanguage === 'ar' && 'rtl'} >
      {
        isPending ? <p>Loading...</p> :
          <>
            <Sideover open={open} setOpen={setOpen} />
            {/* <Sideover open={true} setOpen={setOpen} /> */}
            {
              isView == true && (
                <div className='w-full flex justify-start gap-3 mb-6 md:px-10'>
                  <button
                    onClick={() => {
                      handlePublishProduct()
                      navigate('/new-product')
                    }}
                    className='bg-black text-primary-color px-6 py-2 rounded-sm transition flex items-center justify-center gap-2 text-[16px] font-[600] hover:bg-buttons'
                  >
                    {t('product.publish_button')}
                    <VscSend className={`${currentLanguage == 'ar' && 'rotate-180'}`} />
                  </button>
                  {/* draft button */}
                  <button
                    onClick={handleSaveDraft}
                    className='bg-black text-primary-color px-6 py-2 rounded-sm transition flex items-center justify-center gap-2 text-[16px] font-[600] hover:bg-buttons'
                  >
                    {t('product.save_draft')}
                    <GoGitPullRequestDraft />
                  </button>
                  {/* edit button */}
                  <button
                    onClick={() => {
                      newProduct(product)
                      navigate('/new-product')
                    }}
                    className='bg-black text-primary-color px-6 py-2 rounded-sm transition flex items-center justify-center gap-2 text-[16px] font-[600] hover:bg-buttons'
                  >
                    {t('product.edit_product')}
                    <MdOutlineEdit />
                  </button>
                </div>
              )
            }
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-7'>
              {/* images part */}

              <div className='grid md:grid-cols-6 grid-cols-1'>
                {/* All image preview part*/}
                <div className='col-span-2 flex md:flex-col items-center gap-5 order-1 md:order-0 overflow-auto max-h-[598px] scrollbar-hide'
                  style={{ scrollbarWidth: 'none' }}>
                  {/* Map over product images */}
                  {
                    getImages().map((image, index) => (
                      <div key={index}
                        onClick={() => setSelectedImage(image)}
                        className='min-w-[126px] max-w-[126px] sm:mt-0 mt-4 h-[150px] p-1 focus:ring-1 border-[1px] border-gray-200 flex justify-center items-center rounded-md cursor-pointer hover:bg-gray-100 transition'>
                        <img src={image} alt={`Image ${index + 1}`} className='w-full h-full rounded-md p-[1px] object-cover' />
                      </div>
                    ))
                  }
                </div>

                {/* Selected image display */}
                <div className='col-span-4 flex justify-center items-center border-[1px] relative sm:min-h-[600px] sm:max-h-[650px] rounded-md md:order-1'>
                  {/* Previous image arrow */}
                  <div className='absolute top-1/2 -left-4 transform -translate-y-1/2'>
                    <button className='bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition' onClick={handlePreviousImage}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                  </div>

                  {/* Discount label */}
                  {salesPrice && (
                    <p className='absolute top-3 left-3 text-tertiary-600 px-3 py-1 text-primary-color rounded-md'>
                      {Math.round(percentageDiscount)}% off
                    </p>
                  )}

                  {/* Selected image */}
                  <img src={selectedImage} alt="Selected-image" className='sm:min-h-[600px] sm:max-h-[650px] h-[400px] object-cover rounded-md' />

                  {/* Next image arrow */}
                  <div className='absolute top-1/2 -right-4 transform -translate-y-1/2' onClick={handleNextImage}>
                    <button className='bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition'>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>


              {/* product details part */}
              <div>
                <p className='font-[700] md:text-[26px] text-md text-secondary-color'>
                  {
                    currentLanguage == 'ar' ? product?.name?.ac : product?.name?.en +
                      // product?.name?.en +
                      (selectedVariationDetails.price !== null
                        ? ' (' + selectedVariationDetails.name.en + ')'
                        : '')
                  }
                </p>
                {/* Brand | Rating | Code */}
                <div className='mt-[16px] gap-3 flex justify-start items-center flex-wrap'>
                  <p className='text-[16px]'><span className='font-[600] text-gray-500 '>{t('product.brand')}</span> : <span className=' mx-1 text-secondary-color'>{product?.brand && product?.brand}</span></p>
                  <div className='border-x-2 px-3 border-gray-400 h-[20px] flex items-center'>
                    <p className={currentLanguage == 'ar' ? 'flex w-full ml-auto justify-end text-[16px] items-center' : ' text-[16px] flex items-center'} dir='ltr'>
                      <ReactStars
                        count={5}
                        half={true}
                        value={(product.rate > Math.floor(product.rate)) ? Math.floor(product.rate) + 0.5 : product.rate}
                        // value={reviewData?.avg_rating }
                        edit={false}
                        size={24}
                        color2={'#ffd700'}
                      />
                      <span className='gray-800 ms-3 mt-1'>({reviewData?.reviews?.length})</span>
                    </p>
                  </div>
                  <div>
                    <p className='text-[16px]'><span className='font-[600] text-gray-500'>{t('product.code')} </span> : <span className='mx-1 text-secondary-color'>{product?.sku && product?.sku}</span></p>
                  </div>
                </div>
                {/* Amount and discount */}
                {
                  // for variations
                  selectedVariationDetails.price !== null ? (
                    <div className='flex items-center gap-3 mt-[24px]'>
                      <p className='text-[32px] font-[700] text-tertiary-600'>
                        {totalPrice} USD
                      </p>
                      {selectedVariationDetails.sales_price && selectedVariationDetails.sales_price !== selectedVariationDetails.price && (
                        <p className='text-[20px] font-[700] line-through text-gray-400 mt-1'>
                          {selectedVariationDetails.price * quantity} USD
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className='flex items-center gap-3 mt-[24px]'>

                      {product?.sales_price && (product?.sales_price != product.price) ?
                        <>
                          <p className='text-[32px] font-[700] text-tertiary-600'>{totalPrice} USD</p>
                          <p className='text-[20px] font-[700] line-through text-gray-400 mt-1'>
                            {product?.price * quantity} USD
                          </p>
                        </> :
                        <p className='text-[32px] font-[700] text-tertiary-600'>
                          {totalPrice} USD
                        </p>
                      }
                    </div>
                  )
                }

                {/* In stock tag */}
                <div className='my-2'>
                  {product?.quantity > 0 ?
                    <span className='text-tertiary-600 bg-tertiary-200 px-2 py-1 rounded-sm mt-2 min-w-24 max-w-32 flex justify-center items-center '>
                      IN STOCK
                    </span> : <span className='text-red-500 bg-red-200  px-2 py-1 rounded-sm mt-2 min-w-24 max-w-32 flex justify-center items-center text-nowrap'>
                      OUT OF STOCK
                    </span>
                  }
                </div>

                {
                  product?.allow_bulk === true && product?.bulk_prices?.length > 0 ? (
                    <div className='overflow-scroll my-[27px] flex justify-start -ms-2' style={{ scrollbarWidth: 'none' }}>
                      {
                        product?.bulk_prices
                          .filter(item => item.low_range !== undefined)
                          .map((item, index) => {
                            return (
                              <div key={index} className='flex items-start gap-2 flex-col justify-start min-w-[150px] mr-2'>
                                <p className='text-[14px] font-[600] text-secondary-color ms-2'> {item?.low_range} - {item.high_range} Items </p>
                                <p className='text-[24px] font-[700] text-secondary-color ms-2'> {item?.price} USD</p>
                              </div>
                            )
                          })
                      }
                    </div>
                  ) :
                    selectedVariation && selectedVariation?.price !== null && (
                      <div className='overflow-scroll my-[27px] flex justify-start -ms-2' style={{ scrollbarWidth: 'none' }}>
                        {selectedVariation?.bulk_prices?.length > 0 ? (
                          selectedVariation.bulk_prices
                            .filter(item => item.low_range !== undefined)
                            .map((item, index) => (
                              <div key={index} className='flex items-start gap-2 flex-col justify-start min-w-[150px] mr-2'>
                                <p className='text-[14px] font-[600] text-secondary-color ms-2'>{item.low_range} - {item.high_range} Items</p>
                                <p className='text-[24px] font-[700] text-secondary-color ms-2'>{item.price} USD</p>
                              </div>
                            ))
                        ) : (
                          <p className='text-[14px] font-[600] text-secondary-color ms-2'>No bulk prices available for this variation.</p>
                        )}
                      </div>
                    )
                }
                {/* description */}
                <p className='text-[14px] text-secondary-color font-[600] mt-6'>
                  {currentLanguage == 'ar' ? selectedVariationDetails.description?.ac : selectedVariationDetails.description?.en || (currentLanguage == 'ar' ? product?.description?.ac : product?.description?.en)}
                </p>

                {/* make variation dynamic  */}
                <div>
                  {renderVariationOptions()}
                </div>
                {/* count */}
                <div className='flex items-center gap-3 mt-6'>
                  <div
                    onClick={handleMinusProductCount}
                    className='border border-gray-100 w-[45px] h-[40px] flex justify-center items-center rounded-md cursor-pointer bg-gray-100'>
                    <p className='text-[22px] font-[600]'>-</p>
                  </div>
                  <div className='w-[40px] h-[40px] flex justify-center items-center rounded-md cursor-pointer text-secondary-color'>
                    {/* quantity of products */}
                    <p className='text-[16px] font-[600]'>{quantity < 10 ? '0' + quantity : quantity}</p>
                  </div>
                  <div
                    onClick={handleAddProductCount}
                    className='border border-gray-100 w-[45px] h-[40px] flex justify-center items-center rounded-md cursor-pointer bg-gray-100'>
                    <p className='text-[22px] font-[600]'>+</p>
                  </div>

                  {/* add to cart */}
                  <div className='w-full lg:ms-5' >
                    <div
                      // call add to cart function onclick
                      onClick={() => {
                        showToast('Admin view enabled', 'info')
                      }}
                      className='border border-gray-100 py-2 flex justify-center gap-2 items-center rounded-md cursor-pointer bg-gray-100 transition-all'>
                      {
                        isLoadingCart ?
                          // loading spinnner
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                            <p className='text-[16px] font-[600]'>{t('product.adding_to_cart')}</p>
                          </>
                          : <>
                            <IoBagHandleOutline />
                            <p className='text-[16px] font-[600] '>{t('product.add_to_cart')}</p>
                          </>
                      }
                    </div>
                  </div>
                </div>
                {/* buy now green color*/}
                <div className='w-full mt-6' >
                  <div onClick={() => {
                    showToast('Admin view enabled', 'info')
                  }} className='border border-gray-100 py-2 flex justify-center gap-2 items-center rounded-md cursor-pointer hover:text-tertiary-600 bg-secondary-color hover:text-primary-color transition'>
                    <p className='text-[16px] font-[600] text-primary-color'>
                      {
                        isLoadingBuyNow ? 'Processing..' : <span> {t('product.buy_now')}</span>
                      }
                    </p>
                  </div>
                </div>
                {/* wishlish, compare and share buttons */}
                <div className='flex items-center gap-3 mt-6'>
                  <div
                    onClick={() => {
                      showToast('Admin view enabled', 'info')
                    }}

                    className='border border-gray-100 py-2 flex justify-center gap-2 items-center rounded-md cursor-pointer bg-gray-100 w-40 text-gray-900'>
                    <CiHeart />
                    <p className='text-[16px]'>{t('product.add_to_wishlist')}</p>
                  </div>
                  {/* compare */}
                  <div className='border border-gray-100 flex justify-center gap-2 items-center rounded-md cursor-pointer bg-gray-100 text-gray-900 px-3 py-3'>
                    <FaCodeCompare className='text-[13px]' />
                  </div>
                  {/* share */}
                  <div
                    onClick={() => {
                      // window.Clipboard.copy('Ok');
                      window.navigator.clipboard.writeText(url)
                      showToast('Link is ready to share', 'info');
                    }}
                    className='border border-gray-100 flex justify-center gap-2 items-center rounded-md cursor-pointer bg-gray-100 text-gray-900 px-3 py-3'
                  >
                    <IoShareSocial className='text-[14px]'

                    />
                  </div>

                </div>
                {/* hr line */}
                <div className='border-b border-gray-200 my-8'></div>
                {/* estimated delivery and returns */}
                <div className='flex items-center gap-3'>
                  <p className='text-[16px] font-[600] text-gray-900 flex items-center gap-3'><LiaTruckMovingSolid className='text-gray-700' /> {t('product.estimated_delivery')} : </p>
                  <p className='text-[16px] font-[600] text-gray-500'>{new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000).toDateString()}</p>
                </div>
                {/* returns */}
                {/* <div className='flex items-center gap-3 my-3'>
                  <p className='text-[16px] font-[600] text-gray-900 flex items-center gap-3'><GoGift className='text-gray-700' />  {t('product.free_shipping_returns')} : </p>
                  <p className='text-[16px] font-[600] text-gray-500'>Orders over 300.00 USD</p>
                </div> */}
                {/* we accept payments */}
                {/* <div className='flex items-center gap-3 mt-6 bg-gray-100 justify-center py-2 rounded-sm'>
                  <p className='text-[16px] font-[600] text-gray-900 flex items-center gap-3'> {t('product.we_accept_visa')} </p>
                </div> */}
              </div>
              {/* description, reviews, additional info etc tabs */}
              <div className='w-full flex flex-col'>
                <div className="sm:hidden">
                  <label htmlFor="tabs" className="sr-only">
                    Select a tab
                  </label>
                  {/* Use an "onChange" listener to update the selected tab state. */}
                  <select
                    id="tabs"
                    name="tabs"
                    className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    value={selectedTab}
                    onChange={handleTabChange}
                  >
                    {tabs.map((tab, index) => (
                      <option key={index} value={tab.name.en}>
                        {tab.name.en}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="hidden md:block">
                  <div className="border-b border-gray-200 w-full">
                    <nav className="-mb-px flex " aria-label="Tabs">
                      {tabs.map((tab) => (
                        <p
                          key={tab.name}
                          onClick={() => handleTabClick(tab.name.en)}
                          className={classNames(
                            tab.name.en == selectedTab
                              ? 'border-black text-black'
                              : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                            'whitespace-nowrap border-b-2 py-4 text-sm font-medium cursor-pointer px-10'
                          )}
                          aria-current={tab.current ? 'page' : undefined}
                        >
                          {
                            currentLanguage == 'ar' ? <span>{tab.name.ar}</span> : <span> {tab.name.en}</span>
                          }
                        </p>
                      ))}
                    </nav>
                  </div>
                </div>
              </div>
            </div>
            <div className='w-full md:p-6 p-2'>
              {/* Conditionally render content based on the selected tab */}
              {selectedTab === 'Description' ? (
                <p className='text-gray-dark font-[600]'>
                  {selectedVariationDetails.description?.en || product?.description?.en}
                </p>
              ) : selectedTab === 'Questions' ? (
                <div>
                  Questions data
                </div>
              ) : selectedTab === 'About Vendor' ? (
                <RenderVendorInfo />
              ) :
                <Reviews reviewData={reviewData} />
              }

            </div>
            {
              isView == !true && <>

                {/* related products */}

                {
                  product?.related_products.length > 0 && <p className='text-secondary-color font-[600] text-md mb-[30px] sm:ms-5 mt-5'>Customers also purchased</p>
                }
                <RelatedProducts product={product} />

                <BottomAdvertisement />
              </>
            }

          </>
      }

    </div >
  )
}

export default ProductDetails