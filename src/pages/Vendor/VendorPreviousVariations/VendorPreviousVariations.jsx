import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import InputField from 'src/components/Vendor/VendorInputs/InputField';
import { IoMdArrowRoundBack } from "react-icons/io";


const VendorPreviousVariations = () => {
    const navigate = useNavigate()
    const [previousVariations, setPreviousVariations] = useState([])

    useEffect(() => {
        setPreviousVariations(JSON.parse(localStorage.getItem('newProduct'))?.variations)
    }, [])
    const { t, i18n } = useTranslation()
    const currentLanguage = i18n.language;


    return (
        <div className='font-main'>
            <p
                className='font-[500] text-lg mb-4 flex items-center gap-4 cursor-pointer'
                onClick={() => {
                    navigate('/vendor-variations')
                }}
            >
                <IoMdArrowRoundBack />
                Go back
            </p>
            {previousVariations.map((variation, index) => (
                <div key={index}>
                    {/* variation products div */}
                    <p className='font-[500] text-md'>{t('new_product.variation_products')} {index + 1} ({variation.name.en} )</p>
                    {/* SKU Generator */}
                    <div className='flex justify-between items-center relative my-6'>
                        <label
                            htmlFor={`SKU-${index}`}
                            className={`absolute -top-2 bg-white px-2 text-xs font-medium text-gray-900 ${currentLanguage == 'ar' ? 'right-2' : 'left-2'}`}
                        >
                            SKU*
                        </label>
                        <input
                            type={'text'}
                            id={`SKU-${index}`}
                            name='name'
                            min={0}
                            value={variation.sku}
                            readOnly
                            className='block w-full rounded-md border-0 p-3 text-gray-900 shadow-sm ring-1 outline-none ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
                            placeholder={t('new_product.sku_placeholder')}
                        />
                    </div>
                    {/* image upload field */}
                    <div
                        className='bg-gray-100 cursor-pointer relative p-2 h-[220px] rounded-md flex justify-center items-center gap-3 border-dashed border-gray-300 border-[1px]'
                    >
                        {variation?.images?.map((image, i) => (
                            <img
                                key={i}
                                src={image}
                                alt={`selected-product-${i}`}
                                className='w-[150px] h-[150px] rounded-lg object-contain mb-2'
                            />
                        ))}
                    </div>
                    {/* description and price */}
                    {/* onChange={(value) => handleVariationPriceChange(index, value)} */}
                    <InputField label={t('new_product.description')} type='textField' placeholder={'Samsung Galaxy-M1 Desc'} value={variation?.description?.en} />
                    <InputField label={t('new_product.descriptionAr')} type='textField' placeholder={'Arabic description'} value={variation?.description?.ac} />
                    <InputField label={t('new_product.price')} type='number' placeholder={'200 USD'} value={variation.price} />
                    {/* On Sale pricing and featured */}
                    <div className='flex justify-start items-center gap-5 my-4'>
                        <div className='flex justify-center items-center '>
                            <input
                                type="checkbox"
                                checked={variation.onSale}
                                className='w-[15px] h-[15px] border-[1px] border-gray-300 rounded-md'
                            // onChange={(e) => handleOnSaleCheckbox(index, e.target.checked)}
                            />
                            <p className='text-[11px] text-gray-900 ml-[5px]'>{t('new_product.on_sale')}</p>
                        </div>
                    </div>
                    {/* if on sale is clicked */}
                    {variation.onSale &&
                        <InputField
                            label={`Sales price`}
                            type='number'
                            value={variation.salePrice}
                        // onChange={(value) => handleSalePriceChange(index, value)}
                        />
                    }
                    {/* stock management */}
                    <div className='flex justify-start items-start mb-6 flex-col md:flex-row gap-2'>
                        <p className='text-sm font-[600]'>
                            {t('new_product.stock_management')}
                        </p>
                        <div className='flex justify-center items-center md:ml-[35px]'>
                            <input
                                type="checkbox"
                                checked={variation.trackStock}
                                className='w-[15px] h-[15px] border-[1px] border-gray-300 rounded-md'
                            // onChange={(e) => handleStockCheckbox(index, e.target.checked)}
                            />
                            <p className='text-sm text-gray-600 ml-[5px]'>{t('new_product.track_stock_management')}</p>
                        </div>
                    </div>
                    <InputField label={t('new_product.quantity')} type='number' value={variation.quantity} onChange={(value) => handleQuantityChange(index, value)} />
                    {variation.trackStock &&
                        // onChange={(value) => handleLowStockChange(index, value)}
                        <InputField label={t('new_product.low_stock')} type='number' value={variation.lowStockThreshold} />
                    }
                    {/* sold individually */}
                    <div className='flex justify-start items-start mb-6 flex-col md:flex-row gap-2'>
                        <p className='text-sm font-[600]'>
                            {t('new_product.sold_individually')}
                        </p>
                        <div className='flex justify-center items-center md:ml-[35px]'>
                            <input
                                type="checkbox"
                                checked={variation.soldIndividually}
                                className='w-[15px] h-[15px] border-[1px] border-gray-300 rounded-md'
                            // onChange={(e) => handleSoldIndividuallyCheckbox(index, e.target.checked)}
                            />
                            <p className='text-sm text-gray-600 ml-[5px]'>{t('new_product.limit_purchase')}</p>
                        </div>
                    </div>
                    {/* {!variation.soldIndividually &&
                        // onChange={(value) => handleMinimumOrderChange(index, value)}
                    } */}
                    <InputField label={t('new_product.minimum_order')} type='number' value={variation.minimumOrder} />
                    {/* bulk pricing */}
                    <p className='text-[12px] font-[600] my-[20px]'>
                        {t('new_product.setup_bulk')}
                    </p>
                    <div className='flex justify-start items-center'>
                        <p className='text-[12px] font-[600]'>
                            {t('new_product.bulk_purchase')}
                        </p>
                        <div className='flex justify-center items-center ml-[35px]'>
                            <input type="checkbox"
                                checked={variation.bulkPricing}
                                className='w-[15px] h-[15px] border-[1px] border-gray-300 rounded-md'
                            // onChange={(e) => handleBulkPricingCheckbox(index, e.target.checked)}
                            />
                            <p className='text-[11px] text-gray-900 ml-[5px]'> {t('new_product.allow_bulk_purchase')}</p>
                        </div>
                    </div>
                    {/* fields for bulk pricing */}
                    {variation.bulkPricing &&
                        variation.bulkPriceRanges.map((range, i) => (
                            <div key={i} className='grid grid-cols-12 gap-5'>
                                <div className='col-span-5 flex justify-between gap-5'>
                                    <InputField
                                        label={`Lower Range ${i + 1}`}
                                        type='number'
                                        placeholder={'1'}
                                        value={range.lowRange}
                                    // onChange={(value) => handleBulkInputChange(index, i, 'lowRange', value)}
                                    />
                                    <InputField
                                        label={`Upper Range ${i + 1}`}
                                        type='number'
                                        placeholder={'99'}
                                        value={range.highRange}
                                    // onChange={(value) => handleBulkInputChange(index, i, 'highRange', value)}
                                    />
                                </div>
                                <p className='col-span-7'>
                                    <InputField
                                        label={`Bulk Price ${i + 1}`}
                                        type='number'
                                        placeholder={'250 USD'}
                                        value={range.price}
                                    // onChange={(value) => handleBulkInputChange(index, i, 'price', value)}
                                    />
                                </p>
                            </div>
                        ))
                    }
                    {/* add more bulk pricing */}
                    {/* {variation.bulkPricing && (
                        <div className='flex justify-end items-center gap-3'>
                            {variation.bulkPriceRanges.length > 0 && (
                                <p
                                    className='text-[12px] font-[600] bg-header-background text-primary-color px-4 h-[34px] rounded-sm cursor-pointer flex justify-center items-center'
                                    onClick={() => handleRemoveBulkRange(index)}
                                >
                                    {t('new_product.remove')}
                                </p>
                            )}
                            <p
                                className='text-[12px] font-[600] bg-[#4E97FD] text-primary-color px-4 h-[34px] rounded-sm cursor-pointer flex justify-center items-center'
                                onClick={() => handleAddBulkRange(index)}
                            >
                                {t('new_product.add_another_range')}
                            </p>
                        </div>
                    )} */}
                    {/* drop down for color */}
                    {/* <InputField
                        label={`Color for filtering *`}
                        type='color'
                        placeholder={'99'}
                        value={variation.color}
                        onChange={(value) => handleColorChange(index, value)}
                    /> */}
                    {variation.color}
                    {/* dimensions */}
                    <p className='font-600 text-[14px] mt-6'>{t('new_product.dimension')}</p>
                    <div className='w-full grid grid-cols-12 gap-3'>
                        <div className='lg:col-span-11 col-span-10'>
                            {/* onChange={(value) => handleWeightChange(index, value)}  */}
                            <InputField label={t('new_product.weight')} type='text' value={variation.weight} />
                        </div>
                        <select
                            style={{ appearance: 'none' }}
                            className='py-3.5 ps-[5px] lg:ps-[20px] cursor-pointer self-center col-span-2 lg:col-span-1 block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset outline-none ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
                            value={variation.weightUnit}
                        // onChange={(e) => handleWeightUnitChange(index, e.target.value)}
                        >
                            <option value='kg'>KG</option>
                            <option value='lb'>LB</option>
                        </select>
                    </div>
                    <div className='grid grid-cols-1 lg:grid-cols-3 gap-5'>
                        <div className='relative'>
                            {/* onChange={(value) => handleLengthChange(index, value)} */}
                            <InputField label={t('new_product.length')} type='text' value={variation.length} />
                            <select
                                className='absolute top-[38px] right-2 border-none outline-none'
                                value={variation.lengthUnit}
                            // onChange={(e) => handleLengthUnitChange(index, e.target.value)}
                            >
                                <option value='cm'>cm</option>
                                <option value='in'>in</option>
                                <option value='ft'>ft</option>
                            </select>
                        </div>
                        <div className='relative'>
                            {/* onChange={(value) => handleWidthChange(index, value)}  */}
                            <InputField label={t('new_product.width')} type='text' value={variation.width} />
                            <select
                                className='absolute top-[38px] right-2 border-none outline-none'
                                value={variation.widthUnit}
                            // onChange={(e) => handleWidthUnitChange(index, e.target.value)}
                            >
                                <option value='cm'>cm</option>
                                <option value='in'>in</option>
                                <option value='ft'>ft</option>
                            </select>
                        </div>
                        <div className='relative'>
                            {/* onChange={(value) => handleHeightChange(index, value)} */}
                            <InputField label={t('new_product.height')} type='text' value={variation.height} />
                            <select
                                className='absolute top-[38px] right-2 border-none outline-none'
                                value={variation.heightUnit}
                            // onChange={(e) => handleHeightUnitChange(index, e.target.value)}
                            >
                                <option value='cm'>cm</option>
                                <option value='in'>in</option>
                                <option value='ft'>ft</option>
                            </select>
                        </div>
                    </div>
                </div>
            ))}
        </div>

    )
}

export default VendorPreviousVariations