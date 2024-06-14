import React, { useEffect, useState } from 'react'
import VendorHeader from 'src/components/Vendor/VendorHeader/VendorHeader'
import { CiTrash } from "react-icons/ci";
import { useNavigate } from 'react-router-dom';
import { GrSend } from "react-icons/gr";
import { showToast } from 'src/components/Common/Toastify/Toastify';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { generalData } from 'src/lib/helper/dynamicData';

const VendorCustomOrder = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const [searchValue, setSearchValue] = useState("");
    const [customerSearchValue, setCustomerSearchValue] = useState("");
    const { t, i18n } = useTranslation()
    const currentLanguage = i18n.language;
    const [originalProducts, setOriginalProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [customers, setCustomers] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0)

    // console.log(user.vendor_info?.shop?._id)
    const fetchProducts = () => {
        if (!user.vendor_info?.shop?._id) return;
        fetch(`${import.meta.env.VITE_API_PATH}/products/get-all?shop=${user.vendor_info?.shop?._id}&is_published=true&draft=false`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(localStorage.getItem('token')).accessToken}`
            }
        })
            .then((response) => response.json())
            .then((data) => {
                const productNames = data?.product_info?.map(product => product); // Assuming 'en' is the English language code
                setOriginalProducts(productNames);
            })
            .catch((error) => {
                console.error('Error fetching products:', error);
            });
    };

    const fetchUsers = () => {
        fetch(`${import.meta.env.VITE_API_PATH}/users/get-all?type=customer`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(localStorage.getItem('token')).accessToken}`
            }
        })
            .then((response) => response.json())
            .then((data) => {
                setCustomers(data?.users);
            })
            .catch((error) => {
                console.error('Error fetching products:', error);
            });
    };

    useEffect(() => {
        fetchProducts();
        fetchUsers();
    }, []);

    const handleProductChange = (product) => {
        // Update selected product IDs
        setSelectedProducts((prevSelectedProducts) => [
            ...prevSelectedProducts,
            product,
        ]);

        // Clear the search input but keep the filtered products
        setSearchValue('');
    };

    const handleSearchChange = (value) => {
        // console.log("Search Value:", value);
        setSearchValue(value);

        const filtered = originalProducts.filter((product) =>
            product?.name?.en.toLowerCase().includes(value.toLowerCase())
        );
        // console.log("Filtered Products:", filtered);
        setFilteredProducts(filtered);
    };

    const handleCustomerChange = (value) => {
        setCustomerSearchValue(value);
        const filtered = customers.filter((customer) =>
            customer?.email.toLowerCase().includes(value.toLowerCase())
        );
        // console.log("Filtered Customers:", filtered);
        setFilteredCustomers(filtered);
        // setSelectedCustomer(filtered);
    }
    const handleSelectCustomer = (customer) => {
        setSelectedCustomer(customer);
        setCustomerSearchValue(customer.email);
    }

    const handleProductPriceChange = (index, newPrice) => {
        setSelectedProducts((prevSelectedProducts) => {
            const updatedProducts = [...prevSelectedProducts];
            updatedProducts[index].price = newPrice;

            const totalAmount = updatedProducts.reduce((total, product) => {
                return total + (product.price * product.quantity);
            }, 0);

            // Update totalAmount state
            setTotalPrice(totalAmount);

            return updatedProducts;
        });
    };

    const handleProductQuantityChange = (index, newQuantity) => {
        setSelectedProducts((prevSelectedProducts) => {
            const updatedProducts = [...prevSelectedProducts];
            updatedProducts[index].quantity = newQuantity;

            const totalAmount = updatedProducts.reduce((total, product) => {
                return total + (product.price * product.quantity);
            }, 0);

            // Update totalAmount state
            setTotalPrice(totalAmount);

            return updatedProducts;
        });
    };

    const resetAllQuantitiesToOne = () => {
        setSelectedProducts((prevSelectedProducts) => {
            const updatedProducts = prevSelectedProducts.map(product => {
                // Set quantity to 1 for each product
                return { ...product, quantity: 1 };
            });

            const totalAmount = updatedProducts.reduce((total, product) => {
                return total + (product.price * product.quantity);
            }, 0);

            // Update totalAmount state
            setTotalPrice(totalAmount);

            return updatedProducts;
        });
    };

    useEffect(() => {
        resetAllQuantitiesToOne();
    }, [selectedProducts.length])



    const handleCustomOrder = async () => {
        if (selectedCustomer === null) {
            showToast('Select your customer', 'info');
            return;
        }
        if (selectedProducts.length === 0) {
            showToast('Please select a product', 'info');
            return;
        }

        if (isNaN(totalPrice)) {
            showToast('Please provided valid input', 'info');
            return;
        }

        const orderItems = selectedProducts.map((product) => ({
            name: {
                en: product.name.en,
            },
            product_id: product._id, // Assuming your product object has an _id field
            quantity: product.quantity || 1, // Using a default quantity of 1 if not provided
            price: product.price,
            total_price: product.quantity ? product.price * product.quantity : product.price,
            shop_id: user.vendor_info.shop._id,
        }));

        const data = {
            customer_id: selectedCustomer._id,
            vendor_id: user?._id,
            shop: user?.vendor_info.shop._id,
            order: {
                items: orderItems,
            }
        }
        // console.log(data)

        const res = await axios.post(`${import.meta.env.VITE_API_PATH}/custom-orders/create`, data, {
            headers: {
                Authorization: `Bearer ${JSON.parse(localStorage.getItem('token')).accessToken}`
            }
        });
        // console.log(res.data);

        showToast('Custom order created', 'success');
        if (res.status === 200) {
            const notificationResponse = await axios.post(`${import.meta.env.VITE_API_PATH}/auth/send-multidevice-notification`,
                {
                    userId: selectedCustomer._id,
                    message: {
                        "title": "New custom order",
                        "body": `Hey you got a custom order request. Check this out on your cart..`,
                    }
                },
            )

            if (notificationResponse.status == 200) {
                // navigate('/vendor-orders');
            } else {
                console.error('Failed to send notification')
            }

            const emailResponse = await axios.post(`${import.meta.env.VITE_API_PATH}/emails/send-text`, {
                "email": selectedCustomer.email,
                "email_text": `
                    You got a new custom order request. Please check this out on your cart. Have a nice day..
                    Best regards, 
                    The ${generalData?.name} Team 
                `,
                "email_subject": "New custom order request arrived!",
            });

            if (notificationResponse.status == 200) {
                // navigate('/vendor-orders');
            } else {
                console.error('Failed to send email')
            }
            navigate('/vendor-orders');
        }


    }

    return (
        <div className='h-full p-3 font-main lg:-ms-10' dir={currentLanguage == 'ar' && 'rtl'}>
            <VendorHeader />
            <p className='font-[500] text-md'>
                {t('orders.custom_order')}
            </p>
            <div className='relative my-6'>
                <label
                    htmlFor="name"
                    className={`absolute -top-2 bg-white px-2 text-xs font-medium text-gray-900 whitespace-nowrap ${currentLanguage == 'ar' ? 'right-2' : 'left-2'}`}
                >
                    {t('orders.add_customer')}
                </label>
                <input
                    type="text"
                    name="relatedProduct"
                    value={customerSearchValue}
                    onChange={(e) => {
                        handleCustomerChange(e.target.value);
                        // if the input is empty
                        if (e.target.value === '') {
                            setSelectedCustomer(null);
                        }
                    }}
                    // if endter and backspace is pressed
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleSelectCustomer(filteredCustomers[0]);
                        }
                        if (e.key === 'Backspace') {
                            setSelectedCustomer(null);
                        }
                    }}
                    className="block w-full rounded-md border-0 p-3 text-gray-900 shadow-sm ring-1 ring-inset outline-none ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                    placeholder={t('orders.search_by_email')}
                />
                {
                    customerSearchValue !== '' && selectedCustomer == null && (
                        <div className="border px-3 rounded-b-md">
                            <ul className="cursor-pointer py-2">
                                {filteredCustomers?.map((customer, index) => (
                                    <li key={index} className='py-2' onClick={() => handleSelectCustomer(customer)}>
                                        <div className="flex justify-between">
                                            <span>{customer?.email}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )
                }
            </div >

            {/* select products and edit quantity and price */}
            <p className='font-[500] text-sm mt-4'>{t('orders.select_order')}</p>
            <div className='relative my-6'>
                <label
                    htmlFor="name"
                    className={`absolute -top-2 bg-white px-2 text-xs font-medium text-gray-900 whitespace-nowrap ${currentLanguage == 'ar' ? 'right-2' : 'left-2'}`}

                >
                    {t('orders.add_order')}
                </label>
                <input
                    type="text"
                    name="relatedProduct"
                    value={searchValue}
                    onChange={(e) => {
                        handleSearchChange(e.target.value);
                    }}
                    className="block w-full rounded-md border-0 p-3 text-gray-900 shadow-sm ring-1 ring-inset outline-none ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                    placeholder={t('orders.search_for_products')}
                />
                {searchValue !== '' && (
                    <div className="border px-3 rounded-b-md">
                        <ul className="cursor-pointer py-2">
                            {filteredProducts?.map((product, index) => (
                                <li key={index} className='py-2' onClick={() => handleProductChange(product)}>
                                    <div className="flex justify-between">
                                        <span>{product?.name?.en}</span>
                                        <span>{product.price}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                {/* show selected products */}
                {selectedProducts?.map((product, index) => {
                    return (
                        <div key={index} className="flex items-start justify-start mr-1 mb-1 text-primary-color rounded-md mt-4 relative shadow-md pe-4 py-2 overflow-hidden">
                            {/* Product Image */}
                            {product?.images?.[0] ?
                                <img src={product?.images?.[0]} alt={product?.name?.en} className="w-[120px] h-[120px] object-contain rounded-lg mt-10 sm:mt-0" /> :
                                <div className="w-[120px] h-[120px] object-contain rounded-t-md bg-gray-300">
                                    <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-8 text-gray-400 text-2xl">No Image</span>
                                </div>
                            }
                            <div>
                                <p className='text-md text-black p-2 w-[600px]'>{product?.name?.en}</p>
                                <div className='flex mt-3 flex-col md:flex-row w-full '>
                                    {/* Editable Price */}
                                    <div className='relative w-full'>
                                        <label htmlFor="price" className='text-gray-800 text-[10px] absolute -top-[6px] left-4 bg-white px-1 me-4'>Price</label>
                                        <input
                                            type="number"
                                            value={product.price}
                                            min={1}
                                            onChange={(e) => handleProductPriceChange(index, parseFloat(e.target.value))}
                                            className="text-md text-black p-2 border rounded-md mx-2 outline-none w-[47%] md:w-[90%] "
                                        />
                                    </div>
                                    {/* Editable Quantity */}
                                    <p className='text-md text-black p-2 mx-2'>x</p>
                                    <div className='relative w-full'>
                                        <label htmlFor={`quantity-${index}`} className='text-gray-800 text-[10px] absolute -top-[6px] left-2 bg-white px-1'>Quantity</label>
                                        <input
                                            type="number"
                                            value={product.quantity}
                                            min={1}
                                            onChange={(e) => handleProductQuantityChange(index, parseInt(e.target.value))}
                                            id={`quantity-${index}`}
                                            className="text-md text-black p-2 border rounded-md outline-none me-2 w-[47%] md:w-[90%]"
                                        />
                                    </div>
                                    <div className='text-md text-black p-2'>
                                        {isNaN(product.price * product.quantity) ?
                                            <p className='text-red-600 text-nowrap'> Please enter a number</p> :
                                            <span className='flex text-bold text-nowrap'>{product.price * product.quantity} USD </span>
                                        }
                                    </div>
                                </div>
                            </div>
                            {/* Delete Button */}
                            <CiTrash
                                className="text-gray-700 w-5 h-5 cursor-pointer ms-auto mt-16 hover:text-red-700 transition duration-300 ease-in-out animate-pulse"
                                onClick={() => {
                                    setSelectedProducts((prevSelectedProducts) =>
                                        prevSelectedProducts.filter(
                                            (prevProduct, prevIndex) => prevIndex !== index
                                        )
                                    );
                                }}
                            />
                        </div>
                    );
                })}

            </div>

            <div>
                {
                    totalPrice !== 0 && <div className='flex items-center justify-end gap-2 me-2'>
                        <p>TOTAL COST</p>
                        <p className='font-bold'>USD {isNaN(totalPrice) ? 'INVALID INPUT' : totalPrice} </p>

                    </div>
                }
            </div>
            <button
                onClick={handleCustomOrder}
                className='hover:bg-buttons cursor-pointer transition text-[16px] border-2 border-[#E5E5E5] bg-buttons text-primary-color rounded-lg py-3 px-4 flex justify-center items-center gap-2 mb-4 lg:mt-0'>
                {t('orders.send_req')}
                <GrSend className='w-4 h-4' />
            </button>
        </div >
    )
}

export default VendorCustomOrder