import axios from 'axios';
import { useAtomValue, useSetAtom } from 'jotai';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { showToast } from 'src/components/Common/Toastify/Toastify';
import NextAndDraft from 'src/components/Vendor/NextAndDraft/NextAndDraft';
import VendorHeader from 'src/components/Vendor/VendorHeader/VendorHeader';
import InputField from 'src/components/Vendor/VendorInputs/InputField';
import { newProductAtom, userAtom } from 'src/lib/jotai';

const VendorInventory = () => {
    // product atom
    const { t, i18n } = useTranslation()
    const currentLanguage = i18n.language;
    const setProductAtom = useSetAtom(newProductAtom)
    const productAtom = useAtomValue(newProductAtom)
    const user = useAtomValue(userAtom)
    // console.log(productAtom)
    // console.log(productAtom?.track_stock)
    const navigate = useNavigate();
    const [productName, setProductName] = useState({ en: '' });
    const [track_stock, setTrack_stock] = useState(productAtom?.track_stock || false);
    const [stockQuantity, setStockQuantity] = useState(productAtom?.quantity || 0);
    const [limit_to_one, setLimit_to_one] = useState(productAtom?.limit_to_one || false);
    const [lowStockThreshold, setLowStockThreshold] = useState(productAtom?.low_stock_threshold || 0);
    const [minimumOrder, setMinimumOrder] = useState(productAtom?.minimum_order || 1);
    const [sku, setSku] = useState(productAtom?.sku || '')

    const [weight, setWeight] = useState(0);
    const [length, setLength] = useState(0);
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const [weightUnit, setWeightUnit] = useState('kg');
    const [lengthUnit, setLengthUnit] = useState('cm');
    const [widthUnit, setWidthUnit] = useState('cm');
    const [heightUnit, setHeightUnit] = useState('cm');

    const handleWeightChange = (value) => {
        setWeight(value);
    };

    const handleLengthChange = (value) => {
        setLength(value);
    };

    const handleWidthChange = (value) => {
        setWidth(value);
    };

    const handleHeightChange = (value) => {
        setHeight(value);
    };

    const handleWeightUnitChange = (unit) => {
        setWeightUnit(unit);
    };

    const handleLengthUnitChange = (unit) => {
        setLengthUnit(unit);
    };

    const handleWidthUnitChange = (unit) => {
        setWidthUnit(unit);
    };

    const handleHeightUnitChange = (unit) => {
        setHeightUnit(unit);
    };

    const dimensions = {
        weight,
        length,
        width,
        height,
        length_unit: lengthUnit,
        weight_unit: weightUnit,
        width_unit: widthUnit,
        height_unit: heightUnit,
    };
    // console.log(dimensions)
    // console.log(productName)
    const generateSKU = (productNameNew) => {
        // console.log(productNameNew)
        const formattedName = productNameNew?.replace(/\s/g, '-')?.toUpperCase();
        const randomPart = Math.floor(Math.random() * 1000);
        const generatedSKU = 'SBL-' + formattedName + '-' + randomPart;
        return generatedSKU;
    };

    const handleGenerateSKU = () => {
        if (productName?.en?.trim() !== '') {
            // console.log(productName?.en)
            const generatedSKU = generateSKU(productName?.en);
            setSku(generatedSKU);
            return;
        }
        // generate own sku
        setSku(generateSKU(productAtom?.brand?.slice(0, 3) + '-' + productAtom?.name?.en?.slice(0, 3)));
    };

    // for saving draft
    const [product_id, setProduct_id] = useState(productAtom?._id || '')

    const handleSaveDraft = async (goNext) => {
        if (track_stock && lowStockThreshold == 0) return showToast('Please enter low stock threshold', 'error')
        if (!limit_to_one && minimumOrder == 0) return showToast('Please enter minimum order', 'error')

        // console.log(goNext)
        // return
        // Save the product to the database
        const product = {
            ...productAtom,
            'is_published': false,
            'draft': true,

        };

        if (sku) product.sku = sku;
        if (track_stock) product.track_stock = track_stock;
        if (stockQuantity) product.quantity = stockQuantity;
        if (lowStockThreshold) product.low_stock_threshold = lowStockThreshold;
        if (limit_to_one) product.limit_to_one = limit_to_one;
        if (minimumOrder) product.minimum_order = minimumOrder;
        if (dimensions) product.dimensions = dimensions;
        // update draft product
        if (product_id) {
            // console.log('updating draft product')
            const res = await axios.put(`${import.meta.env.VITE_API_PATH}/products/update/${product_id}`, product, {
                headers: {
                    Authorization: `Bearer ${JSON.parse(localStorage.getItem('token')).accessToken}`
                }
            })
            if (res.status === 200) {
                // check if next page or not
                if (goNext) {
                    navigate('/vendor-variations')
                } else {
                    showToast('Product drafted successfully', 'success')
                    navigate('/vendor-products')
                }
            } else {
                showToast('Error adding product, try again', 'error')
            }
            return;
        }

        data.shop = user?.vendor_info?.shop?._id
        // create a new draft product
        const res = await axios.post(`${import.meta.env.VITE_API_PATH}/products/create`, data, {
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
    // save for next page
    const handleSave = () => {
        if (!sku) return showToast('Please generate a SKU', 'error');
        if (track_stock && lowStockThreshold == 0) return showToast('Please enter low stock threshold', 'error')
        if (!limit_to_one && minimumOrder == 0) return showToast('Please enter minimum order', 'error')
        if (stockQuantity == 0) return showToast('Please enter product quantity', 'error')


        // Save the product to the database
        const product = {
            ...productAtom,
            sku,
            track_stock: track_stock,
            quantity: stockQuantity,
            low_stock_threshold: lowStockThreshold,
            limit_to_one: limit_to_one,
            minimum_order: minimumOrder,
            dimensions,
        };
        setProductAtom(product)
        navigate('/vendor-variations')
    }

    // console.log(productAtom)


    // main return
    return (
        <div className='h-full p-3 font-main lg:-ms-10'>
            <VendorHeader text={t('new_product.inventory_n_shipment')} />
            <div className='lg:ms-5 mt-4'>
                <p className='font-600 text-[14px]'>{t('new_product.inventory')}</p>
                {/* SKU Generator */}
                <div className='flex justify-between items-center relative my-6'>
                    <label
                        htmlFor='SKU'
                        className={`absolute -top-2 bg-white px-2 text-xs font-medium text-gray-900 `}
                    >
                        SKU *
                    </label>
                    {/* <input
                        type={'text'}
                        name='name'
                        min={0}
                        value={productName?.en?.toUpperCase()}
                        onChange={(e) => setProductName(e.target.value)}
                        className='block w-full rounded-md border-0 p-3 text-gray-900 shadow-sm ring-1 outline-none ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
                        placeholder={'Write a SKU or generate one'}
                    /> */}
                    <input
                        type={'text'}
                        name='name'
                        disabled={sku ? true : false}
                        min={0}
                        value={productName?.en?.toUpperCase()}
                        onChange={(e) => setProductName({ en: e.target.value })}
                        className='block w-full rounded-md border-0 p-3 text-gray-900 shadow-sm ring-1 outline-none ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
                        placeholder={t('new_product.sku_placeholder')}
                    />
                    <button
                        onClick={() => {
                            if (!sku) handleGenerateSKU()
                        }}
                        className={`bg-[#4E97FD] text-primary-color px-4 py-2 rounded-sm text-[10px] absolute right-2 ${sku ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    >

                        {
                            sku ? 'SKU Generated Already' : `${t('new_product.generate_sku')}`
                        }
                    </button>
                </div>
                {sku && (
                    <p className='text-sm text-gray-700 mb-4 -mt-2 '>
                        {t('new_product.generated_sku')} : <span className='font-medium'>{sku}</span>
                    </p>
                )}
                {/* stock management */}
                <div className='flex justify-start items-center mb-6'>
                    <p className='text-sm font-[600]'>
                        {t('new_product.stock_management')}
                    </p>
                    <div className='flex justify-center items-center ml-[35px]'>
                        <input
                            type="checkbox"
                            checked={track_stock}
                            className='w-[15px] h-[15px] border-[1px] border-gray-300 rounded-md'
                            // checkbox state
                            onChange={() => setTrack_stock(!track_stock)}
                        />
                        <p className='text-sm text-gray-600 ml-[5px]'>{t('new_product.track_stock_management')}</p>
                    </div>
                </div>
                {/* quantity */}
                <InputField label={t('new_product.quantity')} type='number' value={stockQuantity} onChange={setStockQuantity} />
                {
                    track_stock &&
                    <InputField label={t('new_product.low_stock')} type='number' value={lowStockThreshold} onChange={setLowStockThreshold} />

                }
                {/* sold indivisual */}
                <div className='flex justify-start items-center mb-6'>
                    <p className='text-sm font-[600]'>
                        {t('new_product.sold_individually')}
                    </p>
                    <div className='flex justify-center items-center ml-[35px]'>
                        <input
                            type="checkbox"
                            checked={limit_to_one}
                            className='w-[15px] h-[15px] border-[1px] border-gray-300 rounded-md'
                            // checkbox state
                            onChange={() => { setLimit_to_one(!limit_to_one) }}
                        />
                        <p className='text-sm text-gray-600 ml-[5px]'> {t('new_product.limit_purchase')}</p>
                    </div>
                </div>
                {
                    !limit_to_one &&
                    <InputField label={t('new_product.minimum_order')} type='number' value={minimumOrder} onChange={setMinimumOrder} />
                }

                {/* dimensions */}
                <p className='font-600 text-[14px] mt-6'> {t('new_product.dimension')}</p>

                <div className='w-full grid grid-cols-12 gap-3'>
                    <div className='lg:col-span-11 col-span-10'>
                        <InputField label={t('new_product.weight')} type='text' value={weight} onChange={handleWeightChange} />
                    </div>
                    <select
                        style={{ appearance: 'none' }}
                        className='py-3.5 ps-[5px] lg:ps-[20px] cursor-pointer self-center col-span-2 lg:col-span-1 block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset outline-none ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
                        value={weightUnit}
                        onChange={(e) => handleWeightUnitChange(e.target.value)}
                    >
                        <option value='kg'>KG</option>
                        <option value='lb'>LB</option>
                        <option value='gm'>GM</option>
                    </select>
                </div>
                <div className='grid grid-cols-1 lg:grid-cols-3 gap-5'>
                    <div className='relative'>
                        <InputField label={t('new_product.length')} type='text' value={length} onChange={handleLengthChange} />
                        <select
                            className='absolute top-[38px] right-2 border-none outline-none'
                            value={lengthUnit}
                            onChange={(e) => handleLengthUnitChange(e.target.value)}
                        >
                            <option value='cm'>cm</option>
                            <option value='in'>in</option>
                            <option value='ft'>ft</option>
                        </select>
                    </div>
                    <div className='relative'>
                        <InputField label={t('new_product.width')} type='text' value={width} onChange={handleWidthChange} />
                        <select
                            className='absolute top-[38px] right-2 border-none outline-none'
                            value={widthUnit}
                            onChange={(e) => handleWidthUnitChange(e.target.value)}
                        >
                            <option value='cm'>cm</option>
                            <option value='in'>in</option>
                            <option value='ft'>ft</option>
                        </select>
                    </div>
                    <div className='relative'>
                        <InputField label={t('new_product.height')} type='text' value={height} onChange={handleHeightChange} />
                        <select
                            className='absolute top-[38px] right-2 border-none outline-none'
                            value={heightUnit}
                            onChange={(e) => handleHeightUnitChange(e.target.value)}
                        >
                            <option value='cm'>cm</option>
                            <option value='in'>in</option>
                            <option value='ft'>ft</option>
                        </select>
                    </div>
                </div>
                {/* next and save draft button */}
                <div div className='flex justify-start items-center mt-[20px] gap-3' >
                    <p
                        // next button navigate to inventory page
                        onClick={handleSave}
                        className='text-[12px] font-[600] bg-[#4E97FD] text-primary-color px-4 h-[34px] rounded-sm cursor-pointer flex justify-center items-center'>
                        {t('new_product.next')}
                    </p>

                    <p
                        onClick={() => handleSaveDraft(false)}
                        className='text-[12px] font-[600] bg-header-background text-primary-color px-4 h-[34px] rounded-sm cursor-pointer flex justify-center items-center'>
                        {t('new_product.save_draft')}
                    </p>
                    {/* <p
                        onClick={() => handleSaveDraft(true)}
                        className='text-[12px] font-[600] bg-header-background text-primary-color px-4 h-[34px] rounded-sm cursor-pointer flex justify-center items-center'>
                        {t('new_product.save_n_go')}

                    </p> */}
                </div >
            </div>
        </div>
    );
};

export default VendorInventory;
