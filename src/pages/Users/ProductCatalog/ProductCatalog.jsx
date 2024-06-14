import { useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react'
import ReactSlider from 'react-slider'
import ReactStars from 'react-stars';
import BottomAdvertisement from 'src/components/Common/BottomAdvertisement/BottomAdvertisement';
import { CiHeart } from "react-icons/ci";
import { redirect, useNavigate, useSearchParams } from 'react-router-dom';
import { showToast } from 'src/components/Common/Toastify/Toastify';
import axios from 'axios';
import { useAtomValue } from 'jotai';
import { searchValueAtom, userAtom } from 'src/lib/jotai';
import { FaHeart } from 'react-icons/fa';
import { basicColors } from 'src/lib/helper/basicColors'
import NotFoundProduct from 'src/components/Common/Product/NotFoundProduct/NotFound';
import LoadingProduct from 'src/components/Common/Product/LoadingProduct/LoadingProduct';
import ProductCardNormal from 'src/components/Common/Product/ProductCard/ProductCardNormal';
import { useTranslation } from 'react-i18next';
import { MdModeEdit } from "react-icons/md";
import { MdOutlineDone } from "react-icons/md";
import { MdKeyboardArrowDown } from "react-icons/md";
import { MdOutlineFilterAltOff } from "react-icons/md";


const ProductCatalog = ({ singleShop, shopId, adminView = false }) => {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation()
    const currentLanguage = i18n.language;

    const user = useAtomValue(userAtom)
    const queryClient = useQueryClient();
    const [searchParams] = useSearchParams()
    // console.log(searchParams, 'params')
    // console.log(searchParams.get('tag'))
    const tag = searchParams.get('tag');
    const [showFilterbar, setShowFilterbar] = useState(true)
    const [showMinChangeInput, setShowMinChangeInput] = useState(false)
    const [showMaxChangeInput, setShowMaxChangeInput] = useState(false)
    const [minValue, setMinValue] = useState(0);
    const [maxValue, setMaxValue] = useState(100000);
    const [rangeSlider, setRangeSlider] = useState([0, 900]);
    const [currentMinValue, setCurrentMinValue] = useState(minValue);
    const [currentMaxValue, setCurrentMaxValue] = useState(maxValue);

    const [selectedBrands, setSelectedBrands] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState(searchParams.get('category') && [searchParams.get('category')] || []);
    const [displayedCategories, setDisplayedCategories] = useState(5);
    const categoriesPerLoad = 5;

    const handleLoadMore = () => {
        setDisplayedCategories(prevCount => prevCount + categoriesPerLoad);
    };

    const handleShowLess = () => {
        setDisplayedCategories(prevCount => Math.max(prevCount - categoriesPerLoad, 5));
    };

    const [displayedBrands, setDisplayedBrands] = useState(5);
    const brandsPerLoad = 5; // You can adjust this number as needed

    const handleLoadMoreBrands = () => {
        setDisplayedBrands(prevCount => prevCount + brandsPerLoad);
    };

    const handleShowLessBrands = () => {
        setDisplayedBrands(prevCount => Math.max(prevCount - brandsPerLoad, 5));
    };

    const [selectedTypes, setSelectedTypes] = useState([]);
    const [selectedRatings, setSelectedRatings] = useState([]);
    const [selectedColor, setSelectedColor] = useState(null);
    // console.log(selectedBrands, selectedTypes, selectedRatings, selectedColor)
    const userId = JSON.parse(localStorage.getItem('user'))?._id
    const searchProductText = useAtomValue(searchValueAtom)
    // console.log(tag, 'text')
    const { isPending, isError, error, data } = useQuery({
        queryKey: ['products', selectedBrands, selectedColor, selectedRatings, selectedTypes, currentMinValue, currentMaxValue, selectedCategories, singleShop, shopId, tag],
        queryFn: async () => {
            try {
                const response = await axios.post(`${import.meta.env.VITE_API_PATH}/products/filter`, {
                    low_price: currentMinValue,
                    high_price: currentMaxValue,
                    ...(selectedBrands.length !== 0 && { brands: selectedBrands }),
                    ...(selectedTypes.includes('Featured') && { featured: selectedTypes.includes('Featured') ? true : false }),
                    ...(selectedTypes.includes('In Stock') && { in_stock: selectedTypes.includes('In Stock') ? true : false }),
                    ...(selectedTypes.includes('On Sale') && { on_sale: selectedTypes.includes('On Sale') ? true : false }),
                    ...(selectedRatings.length !== 0 && { rating: selectedRatings.sort((a, b) => b - a) }),
                    ...(selectedColor && { colors: [selectedColor] }),
                    ...(selectedCategories.length !== 0 && { categories: selectedCategories }),
                    ...(singleShop === true && { shop: shopId }),
                    ...(tag && tag == "popular_products" ? { sortBy: '-weight_matrics' } : tag == "trending_products" ? { sortBy: '-order_matrics' } : { tags: tag }) // tag can be flash_sale, popular_products, trending_products
                    // ...(searchProductText.length !== 0 && {name: {
                    //     en: searchProductText
                    // }})
                })
                // console.log(response.data)
                return response?.data?.products
            } catch (error) {
                console.error(`Error fetching data`);
            }
        },
    });

    // console.log(data)

    // categories fetching
    const { isPending: isPendingCat, isError: isErrorCat, error: errorCat, data: categories } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_PATH}/categories/get-all?sortBy=-weight_matrics`)
                return response?.data?.categories
            } catch (error) {
                console.error(`Error fetching data`);
            }
        },
    });

    // brand fetching
    const { isPending: isPendingBrand, isError: isErrorBrand, error: errorBrand, data: brands } = useQuery({
        queryKey: ['brands'],
        queryFn: async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_PATH}/brands/get-all`)
                return response?.data?.brands
            } catch (error) {
                console.error(`Error fetching data`);
            }
        },
    });
    // console.log(isErrorBrand, brands, 'brand log')

    const handleColorClick = (colorName) => {
        setSelectedColor((prevSelectedColor) =>
            prevSelectedColor === colorName ? null : colorName
        );
    };

    // console.log(selectedBrands, selectedTypes, selectedRatings)
    const handleSliderChange = (values) => {

        setMinValue(values[0])
        setMaxValue(values[1])
    };


    const handleBrandChange = (event) => {
        const brandName = event.target.value;
        if (selectedBrands.includes(brandName)) {
            setSelectedBrands(selectedBrands.filter(b => b !== brandName));
        } else {
            setSelectedBrands([...selectedBrands, brandName]);
        }
    };

    const handleCategoryChange = (event) => {
        const category = event.target.innerText;
        setSelectedCategories((prevSelectedCategories) =>
            prevSelectedCategories.includes(category)
                ? prevSelectedCategories.filter((c) => c !== category)
                : [...prevSelectedCategories, category]
        );
    };

    const handleTypeChange = (event) => {
        const type = event.target.value;
        setSelectedTypes((prevSelectedTypes) =>
            prevSelectedTypes.includes(type)
                ? prevSelectedTypes.filter((t) => t !== type)
                : [...prevSelectedTypes, type]
        );
    };

    const handleRatingChange = (event) => {
        const rating = parseInt(event.target.value);
        setSelectedRatings((prevSelectedRatings) =>
            prevSelectedRatings.includes(rating)
                ? prevSelectedRatings.filter((r) => r !== rating)
                : [...prevSelectedRatings, rating]
        );
    };


    // const brands = ['Apple', 'Samsung', 'Sony', 'Nokia', 'Meril', 'Pulsar'];


    const types = ['On Sale', 'In Stock', 'Featured'];


    // Function to check the window width and update showFilterbar
    const updateFilterbarVisibility = () => {
        const isMediumOrLarger = window.matchMedia('(min-width: 768px)').matches;
        setShowFilterbar(isMediumOrLarger);
    };

    useEffect(() => {
        // Update the filter bar visibility on mount
        updateFilterbarVisibility();

        // Add resize event listener to update the filter bar visibility when the window is resized
        window.addEventListener('resize', updateFilterbarVisibility);

        // Remove the event listener on component unmount
        return () => window.removeEventListener('resize', updateFilterbarVisibility);
    }, []);
    // get user wishlist
    const [wishlist, setWishlist] = useState([])

    const fetchWishlist = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_PATH}/wishlists/wishlist/${userId}`, {
                headers: {
                    Authorization: `Bearer ${JSON.parse(localStorage.getItem('token')).accessToken}`,
                },
            });

            const jsonData = await response.json();
            queryClient.invalidateQueries({ queryKey: ['header_count'] })
            setWishlist(jsonData.wishlist);
        } catch (error) {
            console.error('Error fetching wishlist', error)
            // showToast('Error fetching wishlist', 'error')
        }
    }
    useEffect(() => {
        fetchWishlist()
    }, [])

    // console.log(wishlist)
    // console.log(userId)
    // remove from wishlist
    const handleRemoveFromWishlist = async (productId) => {
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
                showToast('Product removed from wishlist', 'info')
                fetchWishlist()
            } else {
                showToast('Error removing product from wishlist', 'error')
            }
        } catch (error) {
            showToast('Error removing product from wishlist', 'error')
        }
    };

    // add to wishlist
    const handleAddtoWishlist = async (productId) => {
        if(!user?._id){
            showToast('Please signin to access this feature!', 'info');
            navigate('/signin')
            return
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
                queryClient.invalidateQueries({ queryKey: ['userWishlist'] })
                fetchWishlist();
                showToast('Product added to wishlist', 'success')
            } else {
                showToast('Error adding product to wishlist', 'error')
            }

        } catch (error) {
            showToast('Error adding product to wishlist', 'error')
        }
    }

    return (
        <div className='max-w-7xl mx-auto mt-10 mb-3 px-3 font-main' >
            {/* for making grid */}
            <div className='grid md:grid-cols-12 grid-cols-1 gap-3 '>
                {/* filtering part */}
                <div
                    className='md:col-span-3 col-span-12 px-5 pt-5 pb-2 rounded-md text-sm relative'
                    style={{
                        boxShadow: '0px 0px 5px 0px rgba(3, 0, 71, 0.09)'
                    }}
                >
                    <p className='mb-2 font-[600] md:hidden block'>
                        {t('catalogue.apply')}
                    </p>
                    <MdKeyboardArrowDown
                        className={`absolute top-4 md:hidden block w-5 h-5 ${showFilterbar && 'rotate-180'} transition ${currentLanguage == 'ar' ? 'left-4' : 'right-4 '}`}
                        onClick={() => {
                            setShowFilterbar(!showFilterbar)
                        }}
                    />

                    {
                        showFilterbar && <div className=''>
                            <p className='font-[600] mb-2 cursor-pointer text-secondary-color' dir={currentLanguage == 'ar' && 'rtl'}>{t('catalogue.categories')}</p>
                            {
                                isPendingCat ? 'Loading...' :
                                    categories?.slice(0, displayedCategories)?.map((singleCategory, index) => (
                                        <div key={index} className='flex gap-2 justify-start items-center my-1'>
                                            <p key={index} className={`mb-1 text-[14px] cursor-pointer ${selectedCategories.includes(singleCategory.name) ? 'underline' : ''}`} onClick={handleCategoryChange}>
                                                {singleCategory.name}
                                            </p>
                                        </div>
                                    ))
                            }

                            {displayedCategories > 5 && (
                                <button onClick={handleShowLess}>Show Less</button>
                            )}

                            {categories?.length > displayedCategories && (
                                <button onClick={handleLoadMore}>Load More</button>
                            )}


                            {/* hr line */}
                            <hr className='border-b-[1px] border-gray-300 w-full my-7' />
                            {/* slider for price */}
                            <p className='font-[600] mb-14' dir={currentLanguage == 'ar' && 'rtl'}>{t('catalogue.price_range')}</p>
                            <div className="relative bg-tertiary-300">
                                {/* <ReactSlider
className="horizontal-slider bg-red-600 h-[1px] w-full cursor-pointer "
thumbClassName="example-thumb bg-red-500 rounded-full text-primary-color w-4 absolute -top-2 h-4 flex justify-center items-center shadow-md cursor-pointer border-2 border-red-500 outline-none"
trackClassName="example-track"
defaultValue={[currentMinValue, currentMaxValue]}
onChange={handleSliderChange}
ariaValuetext={state => `Thumb value ${state.valueNow}`}
// renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
pearling
minDistance={10}
// min={minValue}
// max={maxValue}
/> */}

                                <div className='absolute start-0 -top-10 flex gap-1 z-0 w-full'>
                                    <p className={`text-sm text-gray-500 dark:text-gray-400 ${showMinChangeInput ? 'hidden' : ''}`}>
                                        ${minValue.toLocaleString()}
                                    </p>
                                    {showMinChangeInput && (
                                        <div className='flex justify-start gap-2 items-center'>
                                            <span>$</span>
                                            <input
                                                className="outline-none bg-gray-100 w-20 px-1 rounded-sm py-[2px]"
                                                value={minValue}
                                                onChange={(e) => {
                                                    const amount = e.target.value;
                                                    setMinValue(amount);
                                                }}
                                                min={0}
                                                type="number"
                                            />
                                        </div>
                                    )}
                                    -
                                    <p className={`text-sm text-gray-500 dark:text-gray-400 ${showMaxChangeInput ? 'hidden' : ''}`}>
                                        ${maxValue.toLocaleString()}
                                    </p>
                                    {showMaxChangeInput && (
                                        <div className='flex justify-start gap-2 items-center'>
                                            <span>$</span>
                                            <input
                                                className="outline-none bg-gray-100 w-20 px-1 rounded-sm py-[2px]"
                                                value={maxValue}
                                                onChange={(e) => {
                                                    const amount = e.target.value;
                                                    setMaxValue(amount);
                                                }}
                                                min={0}
                                                type="number"
                                            />
                                        </div>
                                    )}
                                    {!showMinChangeInput && !showMaxChangeInput && (
                                        <MdModeEdit
                                            title='Edit price'
                                            onClick={() => {
                                                setShowMinChangeInput(true);
                                                setShowMaxChangeInput(true);
                                            }}
                                            className={` text-white w-5 h-5 cursor-pointer bg-buttons rounded-full p-[3px] ${currentLanguage == 'ar' ? 'me-auto' : 'ms-auto'}`}
                                        />
                                    )}
                                    {showMinChangeInput && showMaxChangeInput && (
                                        <MdOutlineDone
                                            title='Apply'
                                            onClick={() => {
                                                const minAmount = parseInt(minValue, 10);
                                                const maxAmount = parseInt(maxValue, 10);
                                                if (!isNaN(minAmount) && !isNaN(maxAmount) && minAmount >= 0 && maxAmount > minAmount) {
                                                    setCurrentMinValue(minAmount);
                                                    setCurrentMaxValue(maxAmount);
                                                    setShowMinChangeInput(false);
                                                    setShowMaxChangeInput(false);
                                                } else {
                                                    showToast('Invalid range. Ensure min is less than max and both are positive numbers.', 'info');
                                                }
                                            }}
                                            className={`${currentLanguage == 'ar' ? 'me-auto' : 'ms-auto'} text-white w-5 h-5 cursor-pointer bg-buttons rounded-full p-[3px]`}
                                        />
                                    )}
                                </div>
                                {/* <p className='mt-5 text-gray-700'>
Curent range : ${currentMinValue} - ${currentMaxValue}
</p> */}
                            </div>
                            {/* hr line */}
                            <hr className='border-b-[1px] border-gray-300 w-full my-7' />


                            {/* Brands */}
                            <p className='font-[600] cursor-pointer mb-3' dir={currentLanguage == 'ar' && 'rtl'}>{t('catalogue.brands')}</p>
                            {brands?.slice(0, displayedBrands).map((brand, index) => (
                                <div key={index} className='flex gap-2 justify-start items-center my-1'>
                                    <input
                                        type='checkbox'
                                        id={`brand-${index}`}
                                        name={brand.name}
                                        value={brand.name}
                                        checked={selectedBrands.includes(brand.name)}
                                        onChange={handleBrandChange}
                                        className='mb-1 cursor-pointer hover:underline w-4 h-4 text-gray-100 rounded-md'
                                    />
                                    <label htmlFor={`brand-${index}`} className='mb-1 text-[14px] cursor-pointer'>
                                        {brand.name}
                                    </label>
                                </div>
                            ))}
                            {displayedBrands > 5 && (
                                <button onClick={handleShowLessBrands}>Show Less</button>
                            )}
                            {brands?.length > displayedBrands && (
                                <button onClick={handleLoadMoreBrands}>Load More...</button>
                            )}

                            {/* hr line */}
                            <hr className='border-b-[1px] border-gray-300 w-full my-7' />
                            {types?.map((type, index) => (
                                <div key={index} className='flex gap-2 justify-start items-center my-1'>
                                    <input
                                        type='checkbox'
                                        id={index}
                                        name={type}
                                        value={type}
                                        checked={selectedTypes.includes(type)}
                                        onChange={handleTypeChange}
                                        className='mb-1 cursor-pointer hover:underline w-4 h-4 text-gray-100 rounded-md'
                                    />
                                    <p key={index} className='mb-1 text-[14px]'>
                                        {type}
                                    </p>
                                </div>
                            ))}
                            {/* hr line */}
                            <hr className='border-b-[1px] border-gray-300 w-full my-7' />
                            {/* ratings */}
                            {[1, 2, 3, 4, 5]?.reverse()?.map((item, index) => (
                                <div key={index} className='flex gap-2 justify-start items-center my-1'>
                                    <input
                                        type='checkbox'
                                        id={index}
                                        name={item}
                                        value={item}
                                        checked={selectedRatings.includes(item)}
                                        onChange={handleRatingChange}
                                        className='cursor-pointer hover:underline w-4 h-4 text-gray-100 rounded-md'
                                    />
                                    <ReactStars count={5} value={item} edit={false} size={20} color2={'#FFCD4E'} />
                                </div>
                            ))}
                            {/* hr line */}
                            <hr className='border-b-[1px] border-gray-300 w-full my-7' />
                            {/* colors */}
                            <p className='font-[600] cursor-pointer mb-3' dir={currentLanguage == 'ar' && 'rtl'}>{t('catalogue.colors')}</p>
                            <div className='flex gap-2 flex-wrap' dir={currentLanguage == 'ar' && 'rtl'} >

                                {basicColors?.map((color, index) => (
                                    <div
                                        key={index}
                                        onClick={() => handleColorClick(color.hex)}
                                        className={`flex gap-2 justify-start items-center my-1 cursor-pointer `}
                                    >
                                        <div
                                            className={`w-6 h-6 rounded-full ${selectedColor === color.hex ? 'outline outline-gray-500' : ''}`}
                                            style={{ backgroundColor: color.hex }}
                                        ></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    }
                    <hr className='border-b-[1px] border-gray-300 w-full my-7' />
                    {/* clear filtering button*/}
                    <div
                        onClick={() => {
                            // clear all states
                            setSelectedBrands([])
                            setSelectedColor(null)
                            setSelectedCategories([])
                            setSelectedRatings([])
                            setSelectedTypes([])
                            setMinValue(0)
                            setMaxValue(100000)
                            setCurrentMinValue(0)
                            setCurrentMaxValue(100000)

                        }}
                        className='flex justify-between items-center cursor-pointer py-2'
                    >
                        <p className='font-[600] cursor-pointer' dir={currentLanguage == 'ar' && 'rtl'}>{t('catalogue.clear')}</p>
                        <MdOutlineFilterAltOff className='w-4 h-4' />
                    </div>

                </div>
                {/* product showcase part */}
                <div className='md:col-span-9 col-span-12'
                    // do not let admin add fav or someting
                    onClick={() => {
                        if (adminView == true) {
                            showToast('Admin view enabled', 'info')
                            return
                        }
                    }}>
                    {
                        isPending && <LoadingProduct />
                    }
                    {
                        isError && <p>Something went wrong</p>
                    }

                    <div className={data?.length !== 0 ? `grid md:grid-cols-2 lg:grid-cols-3 grid-cols-1 gap-3` : `flex justify-center items-center`}>
                        {
                            data?.length == 0 && <NotFoundProduct />
                        }
                        {
                            data?.map((product, index) => (
                                <ProductCardNormal
                                    key={index}
                                    product={product}
                                    wishlist={wishlist}
                                    handleAddtoWishlist={handleAddtoWishlist}
                                    handleRemoveFromWishlist={handleRemoveFromWishlist}
                                    isInWishlistCheckEnabled={true}
                                />
                            ))
                        }

                    </div>

                </div>
            </div>
            <BottomAdvertisement />
        </div >
    )
}

export default ProductCatalog