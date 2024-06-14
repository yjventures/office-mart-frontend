import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import ReactStars from 'react-stars';
import flashSale from 'assets/global/home/flashSale.svg'
import { showToast } from '../../Toastify/Toastify';
import { useNavigate } from 'react-router-dom';
import { CiHeart } from "react-icons/ci";
import Slider from "react-slick";
import ProductCardNormal from '../../Product/ProductCard/ProductCardNormal';
import { useTranslation } from 'react-i18next';
import { BsArrowLeft, BsArrowRight } from 'react-icons/bs';
import ProductCardWishlist from '../../Product/ProductCard/ProductCardWishlist';
import { calculateTotalPrice } from 'src/lib/helper/calculateTotalPrice';
import { calculateUnitPrice } from 'src/lib/helper/calculateUnitPrice';
import Sideover from 'src/components/User/Cart/Sideover/Sideover';

const FlashSale = () => {
    const { t, i18n } = useTranslation()
    const currentLanguage = i18n.language;
    const [open, setOpen] = useState(false);
    const user = JSON.parse(localStorage.getItem('user'))?._id
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { isPending, isError, error, data } = useQuery({
        queryKey: ['flash_sale_products'],
        queryFn: async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_PATH}/products/get-all?tags=flash_sale&is_published=true&draft=false`)
                // console.log(response.data)
                return response?.data?.product_info
            } catch (error) {
                console.error(`Error fetching data`);
            }
        },
    });

    let sliderRef = useRef(null);
    const next = () => {
        sliderRef.slickPrev();
    };
    const previous = () => {
        sliderRef.slickNext();
    };

    const RenderArrows = () => {
        return (
            <div className={`flex gap-2 absolute top-1 ${currentLanguage == 'ar' ? 'left-2' : 'right-2'} `}> { /*  absolute top-0 right-2 */}
                <button
                    onClick={next}
                >
                    <BsArrowLeft className={`w-8 h-8 border-2 p-2 rounded-full hover:bg-slate-400 transition hover:text-white ${currentLanguage == 'ar' && 'rotate-180'} `} />
                </button>
                <button
                    onClick={previous}
                >
                    <BsArrowRight className={`w-8 h-8 border-2 p-2 rounded-full hover:bg-slate-400 transition hover:text-white ${currentLanguage == 'ar' && 'rotate-180'} `} />
                </button>
            </div>
        );
    };
    // const [sliderSettings, setSliderSettings] = useState();
    const [sliderSettings, setSliderSettings] = useState({
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 4, // default value
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
    });

    useEffect(() => {
        const updateSliderSettings = () => {
            const width = window.innerWidth;
            let slidesToShow = 4;
            // let autoplay = false;

            if (width < 768) { // Small devices
                slidesToShow = 1;
            } else if (width >= 768 && width < 1024) { // Medium devices
                slidesToShow = 2;
            } else { // Large devices and above
                slidesToShow = 4;
            }

            setSliderSettings(prevSettings => ({
                ...prevSettings,
                slidesToShow,
            }));
        };

        updateSliderSettings(); // Call once initially to set the correct value based on the current screen size
        window.addEventListener('resize', updateSliderSettings);

        // Cleanup listener on component unmount
        return () => window.removeEventListener('resize', updateSliderSettings);
    }, []);

    // add to wishlist
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
                // showToast('Product added to wishlist', 'success')
            } else {
                showToast('Error adding product to wishlist', 'error')
            }

        } catch (error) {
            showToast('Error adding product to wishlist', 'error')
        }
    }

    const { isPending: isPendingWishlist, isError: isErrorWishlist, error: errorWishlist, data: wishlist } = useQuery({
        queryKey: ['userWishlist'],
        queryFn: async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_PATH}/wishlists/wishlist/${user}`, {
                    headers: {
                        Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))?.accessToken}`,
                    },
                });

                const jsonData = await response.json();

                return jsonData?.wishlist;
            } catch (error) {
                console.error(error)
            }
        },
    });


    // console.log(data)
    const [uniqueToken, setUniqueToken] = useState(localStorage.getItem('unique_token') || null)
    const handleAddToCart = async (product) => {
        // setIsLoadingCart(true)
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
        // setIsLoadingCart(false)
        queryClient.invalidateQueries({ queryKey: ['header_count'] })
    }

    return (
        <div className='mt-6 pb-10 font-main relative' dir={currentLanguage == 'ar' && 'rtl'} >
            <Sideover open={open} setOpen={setOpen} />
            <div className='flex gap-2 items-center'>
                <img src={flashSale} alt="icon" />
                <p className='text-[20px] font-[600] text-secondary-color'>{t('titles.flash_sale')}</p>
            </div>
            {
                isPending && <p>Loading...</p>
            }
            {
                isError && <p>Something went wrong</p>
            }
            {
                data?.length == 0 && <p>No products found</p>
            }
            <Slider {...sliderSettings}
                ref={slider => {
                    sliderRef = slider;
                }}
            >
                {
                    data?.map((product, index) => (
                        <div key={index} className={`sm:pe-4 my-3`}>
                            <ProductCardWishlist
                                key={index}
                                productItem={product}
                                handleRemoveFromWishlist={handleAddtoWishlist} // toggle wihslist
                                handleAddToCart={handleAddToCart}
                            />

                        </div>
                    ))
                }
            </Slider>
            <RenderArrows />

        </div >
    )
}

export default FlashSale