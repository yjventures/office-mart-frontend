import React, { useEffect, useState } from 'react'
import VendorHeader from '../../../components/Vendor/VendorHeader/VendorHeader'
import { useNavigate, useParams } from 'react-router-dom'
import InputField from '../../../components/Vendor/VendorInputs/InputField';
import mobileImage from 'assets/vendor/mobile.svg'
import blackCamera from 'assets/vendor/black-camera.svg'
import NextAndDraft from 'components/Vendor/NextAndDraft/NextAndDraft';
import { TiDeleteOutline } from "react-icons/ti";
import { useAtomValue, useSetAtom } from 'jotai';
import { newProductAtom, userAtom } from 'src/lib/jotai';
import { showToast } from 'src/components/Common/Toastify/Toastify';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

const VendorNewProduct = () => {
  // for editing product
  const navigate = useNavigate();
  // product atom
  const setProductAtom = useSetAtom(newProductAtom)
  const productAtom = useAtomValue(newProductAtom)
  const user = useAtomValue(userAtom)
  // console.log(productAtom)
  const [onSale, setOnSale] = useState(productAtom?.on_sale || false);
  const [isFeatured, setIsFeatured] = useState(productAtom?.featured || false);
  const [selesPrice, setSelesPrice] = useState(productAtom?.sales_price || '');
  const [is_published, setIs_published] = useState(productAtom?.is_published || false);
  const [bulkCheckbox, setBulkCheckbox] = useState(productAtom?.allow_bulk || false);
  const [bulkFields, setBulkFields] = useState(1);
  const [bulkPricing, setBulkPricing] = useState([{}]);
  const [productName, setProductName] = useState(productAtom?.name?.en || '');
  const [productNameAr, setProductNameAr] = useState(productAtom?.name?.ac || '');
  const [productBrand, setProductBrand] = useState(productAtom?.brand || '');
  const [productDescription, setproductDescription] = useState(productAtom?.description?.en || '');
  const [productDescriptionAr, setproductDescriptionAr] = useState(productAtom?.description?.ac || '');
  const [productPrice, setProductPrice] = useState(productAtom?.price || '');
  const [productImages, setProductImages] = useState(productAtom?.images || []); //productAtom?.images removed as new bug arrives
  const [productColors, setProductColors] = useState(productAtom?.color || [])
  const [searchValue, setSearchValue] = useState('');
  const [selectedTags, setSelectedTags] = useState(productAtom?.tags || []);
  const [categories, setCategories] = useState(productAtom?.main_category?.name || productAtom?.main_category || '')
  const [sku, setSku] = useState(productAtom?.sku || '')
  const [newTags, setNewTags] = useState([]);
  const allTags = ["Air Freshner", "Light", "Fan", "Mini fan"];
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [progress, setProgress] = useState(0);
  const [imageLinks, setImageLinks] = useState(productAtom?.images || []); // Store the uploaded image links
  const [selectedProducts, setSelectedProducts] = useState(productAtom?.related_product || []);
  const { t, i18n } = useTranslation()
  const currentLanguage = i18n.language;

  const filteredCategories = allTags.filter(category =>
    category.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleSearchChange = (value) => {
    setSearchValue(value);
    setNewTags([]);
  };

  const handlTagChange = (category) => {
    // Handle existing categories
    setSelectedTags(prevSelectedCategories => [...prevSelectedCategories, category]);
    setSearchValue('');
    setNewTags([]);
  };

  // console.log(productImage)
  const handleBulkInputChange = (index, field, value) => {
    // Update the bulk pricing array based on the input changes
    const updatedBulkPricing = [...bulkPricing];
    updatedBulkPricing[index] = {
      ...updatedBulkPricing[index],
      [field]: value,
    };
    setBulkPricing(updatedBulkPricing);
  };

  const handleRemoveBulkRange = () => {
    // Remove the last bulk range
    if (bulkFields === 1 && bulkCheckbox === true) {
      setBulkFields(0)
      setBulkCheckbox(false)
    }
    setBulkFields(bulkFields - 1);
    setBulkPricing(bulkPricing.slice(0, bulkPricing.length - 1));
  };

  const handleAddBulkRange = () => {
    // Add a new bulk range
    setBulkFields(bulkFields + 1);
    setBulkPricing([...bulkPricing, {}]);
  };

  const handleBulkPricingCheckbox = () => {
    if (bulkCheckbox == false && bulkFields == 0) {
      setBulkFields(1)
      setBulkPricing([{}])
    }
    setBulkCheckbox(!bulkCheckbox)
  };

  const handleOnSaleCheckbox = () => {
    setOnSale(!onSale)
  };

  const uploadFile = async (file) => {
    try {
      // S3 Bucket Name & region
      const S3_BUCKET = import.meta.env.VITE_AWS_S3_BUCKET;
      const REGION = import.meta.env.VITE_AWS_REGION;

      // S3 Credentials
      AWS.config.update({
        accessKeyId: import.meta.env.VITE_AWS_ACCESSKEYID,
        secretAccessKey: import.meta.env.VITE_AWS_SECRETACCESSKEY,
      });

      const s3 = new AWS.S3({
        params: { Bucket: S3_BUCKET },
        region: REGION,
      });

      // Files Parameters
      const timeStamp = Math.floor(Date.now() / 1000);
      const params = {
        Bucket: S3_BUCKET,
        Key: timeStamp + user._id + file.name,
        Body: file,
      };

      // Uploading file to s3
      setLoadingUpload(true);

      await s3.putObject(params).promise();
      // get real time progress of file upload
      s3.upload(params, function (err, data) {
        if (err) {
          console.error("Error uploading file: ", err);
        }
        // console.log("File uploaded successfully: ", data);
      }).on('httpUploadProgress', function (progress) {
        setProgress(Math.round((progress.loaded / progress.total) * 100));
      });

      // set progress to 100 after uploading
      const imageLink = `https://sonbolabucket.s3.ap-southeast-2.amazonaws.com/${timeStamp + user._id + file.name}`;
      // console.log("Image link:", imageLink);

      setLoadingUpload(false);

      return imageLink; // Returning the image link
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error; // Rethrow the error
    }
  };

  // const uploadImages = async () => {
  //   if (productImages.length === 0) {
  //     // No images to upload
  //     return;
  //   }
  //   setLoadingUpload(true);

  //   try {
  //     for (const file of productImages) {
  //       const link = await uploadFile(file);
  //       setImageLinks((prevLinks) => [...prevLinks, link]);
  //     }
  //     showToast('Images uploaded successfully', 'success');
  //     // setProductImages([]);
  //   } catch (error) {
  //     console.error('Error uploading images:', error);
  //     showToast('Error uploading images', 'error');
  //   } finally {
  //     setLoadingUpload(false);
  //   }
  // };
  const uploadImages = async () => {
    if (productImages.length === 0) {
      // No images to upload
      return [];
    }
    setLoadingUpload(true);

    try {
      const links = [];
      for (const file of productImages) {
        if (file.type) {
          const link = await uploadFile(file);
          links.push(link);
        } else {
          links.push(file);
        }
      }
      showToast('Images uploaded successfully', 'success');
      return links;
    } catch (error) {
      console.error('Error uploading images:', error);
      showToast('Error uploading images', 'error');
    } finally {
      setLoadingUpload(false);
    }
  };

  // console.log(imageLinks)
  // console.log(bulkPricing);
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = e.dataTransfer.files;
    setProductImages((prevImages) => [...prevImages, ...droppedFiles]);
  };

  const handleImageClick = () => {
    document.getElementById('fileInput').click();
  };

  const handleFileInputChange = (e) => {
    const selectedFiles = e.target.files;
    setProductImages((prevImages) => [...prevImages, ...selectedFiles]);
  };

  const removeImage = (index) => {
    const updatedImages = [...productImages];
    updatedImages.splice(index, 1);
    setProductImages(updatedImages);
    setImageLinks((prevLinks) => prevLinks.filter((link, i) => i !== index));
  };
  // console.log(imageLinks)
  // save for next page
  const handleSave = async () => {
    let imageLinks = await uploadImages();
    if (imageLinks?.length < 1) return showToast('Please upload images', 'error')
    // return;
    if (!productName || !productNameAr || !productDescription || !productDescriptionAr || !productPrice || categories == '' || !productBrand) { // || productColors?.length < 1
      console.log(
        productName,
        productNameAr,
        productDescription,
        productDescriptionAr,
        productPrice,
        productImages.length,
        categories,
        productBrand,
        productColors
      )
      return showToast('Please fill all required fields', 'error')
    }
    // if (productColors?.length < 1) {
    //   return showToast('Please add a colour(s) in your product', 'error')
    // }
    if (bulkCheckbox === true) {
      for (let i = 0; i < bulkPricing.length; i++) {
        if (!bulkPricing[i].low_range || !bulkPricing[i].high_range || !bulkPricing[i].price) return showToast(`Bulk pricing can't be empty`, 'error')
      }
    }
    // Save the product to the database
    const product = {
      ...productAtom,
      name: {
        en: productName,
        ac: productNameAr
      },
      images: imageLinks,
      description: {
        en: productDescription,
        ac: productDescriptionAr
      },
      price: productPrice,
      on_sale: onSale,
      sales_price: selesPrice,
      featured: isFeatured,
      brand: productBrand,
      main_category: categories,
      tags: selectedTags,
      allow_bulk: bulkCheckbox,
      bulk_prices: bulkPricing,
      color: productColors,
      is_published: is_published,
      related_products: selectedProducts,
    };
    setProductAtom(product)
    navigate('/vendor-inventory')
  }

  // for saving draft
  const [product_id, setProduct_id] = useState(productAtom?._id || '')

  const handleSaveDraft = async () => {
    // Save the product to the database
    const imageLinks = await uploadImages();
    if (!productName) {
      showToast('At least provide product name', 'error')
      return;
    }
    const data = {
      'is_published': false,
      'draft': true,
    };

    if (productName) data.name = { en: productName }
    if (productNameAr) data.name = { ...data.name, ac: productNameAr }
    if (productDescription) data.description = { en: productDescription }
    if (productDescriptionAr) data.description = { ...data.description, ac: productDescriptionAr }
    if (productPrice) data.price = Number(productPrice)
    if (onSale) data.on_sale = onSale
    if (selesPrice) data.sales_price = Number(selesPrice)
    if (isFeatured) data.featured = isFeatured
    if (productBrand) data.brand = productBrand
    if (categories) data.main_category = categories
    if (selectedTags) data.tags = selectedTags
    if (bulkCheckbox) data.allow_bulk = bulkCheckbox
    if (bulkPricing) data.bulk_prices = bulkPricing
    if (productColors) data.color = productColors[0]
    if (sku) data.sku = sku
    if (imageLinks) data.images = imageLinks
    // update draft product
    if (product_id) {
      // console.log('updating draft product')
      const res = await axios.put(`${import.meta.env.VITE_API_PATH}/products/update/${product_id}`, data, {
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
      return;
    }

    // 'shop': user?.vendor_info?.shop?._id,
    data.shop = user?.vendor_info?.shop?._id
    // create a new draft product
    if (selectedProducts) data.related_products = selectedProducts
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

  const handleSaveDraftAndNext = async () => {
    // Save the product to the database
    if (!productName) {
      showToast('At least provide product name', 'error')
      return;
    }
    const data = {
      'is_published': false,
      'draft': true,
    };

    if (productName) data.name = { en: productName }
    if (productNameAr) data.name = { ac: productNameAr }
    if (productDescription) data.description = { en: productDescription }
    if (productDescriptionAr) data.description = { ac: productDescriptionAr }
    if (productPrice) data.price = Number(productPrice)
    if (onSale) data.on_sale = onSale
    if (selesPrice) data.sales_price = Number(selesPrice)
    if (isFeatured) data.featured = isFeatured
    if (productBrand) data.brand = productBrand
    if (categories) data.main_category = categories
    if (selectedTags) data.tags = selectedTags
    if (bulkCheckbox) data.allow_bulk = bulkCheckbox
    if (bulkPricing) data.bulk_prices = bulkPricing
    if (productColors) data.color = productColors[0]
    if (sku) data.sku = sku
    if (imageLinks) data.images = imageLinks

    // // update draft product
    if (product_id) {
      // console.log('updating draft product')
      const res = await axios.put(`${import.meta.env.VITE_API_PATH}/products/update/${product_id}`, data, {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('token')).accessToken}`
        }
      })
      if (res.status === 200) {
        navigate('/vendor-inventory')
      } else {
        showToast('Error adding product, try again', 'error')
      }
      return;
    }

    // 'shop': user?.vendor_info?.shop?._id,
    data.shop = user?.vendor_info?.shop?._id
    // create a new draft product
    const res = await axios.post(`${import.meta.env.VITE_API_PATH}/products/create`, data, {
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('token')).accessToken}`
      }
    })

    if (res.status === 200) {
      navigate('/vendor-inventory')
    } else {
      showToast('Error adding product, try again', 'error')
    }
  }


  return (
    <div className='h-full md:p-3  font-main lg:-ms-10'>
      {/* file upload progress */}
      {
        loadingUpload && (
          <div className='fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center z-10'>
            <div className='bg-white p-5 rounded-md'>
              <p className='text-center'>{t('new_product.uploading')}{progress}%</p>
              <div className='w-full h-2 bg-gray-300 rounded-md'>
                <div className='w-[50%] h-full bg-[#4E97FD] rounded-md'></div>
              </div>
            </div>
          </div>
        )
      }
      <VendorHeader text={t('new_product.title')} />
      <div>
        {/* product name */}
        <InputField label={t('new_product.name')} type='text' placeholder={'Samsung Galaxy-M1'} value={productName} onChange={setProductName} />
        <InputField label={t('new_product.nameAr')} type='text' placeholder={'Arabic Name here'} value={productNameAr} onChange={setProductNameAr} />
        {/* image upload field */}
        <div
          className='bg-gray-100 cursor-pointer relative p-2 h-[220px] rounded-md flex justify-center items-center flex-col border-dashed border-gray-300 border-[1px]'
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => {
            // if (!productImages.length) {
            //   handleImageClick();
            // }
            handleImageClick();
          }}
        >
          {/* <button
            onClick={() => uploadImages()}
            className='bg-[#4E97FD] text-primary-color px-4 py-2 rounded-sm text-[10px] absolute right-2 bottom-2'
          >
            Cofirm Image Upload
          </button> */}
          {/* Display selected images */}

          {
            productImages.length ? (
              <div className='mt-3 flex flex-wrap overflow-x-auto'>
                {productImages.map((image, index) => (
                  <div key={index} className='relative mr-2 mb-2'>
                    <img
                      src={typeof (image) == 'string' ? image : URL.createObjectURL(image)}
                      alt={`selected-product-${index}`}
                      className='w-[150px] h-[150px] rounded-md object-contain mb-2'
                    />
                    <TiDeleteOutline
                      className='absolute w-7 h-7 text-gray-400 border-sky-100 top-0 right-0 cursor-pointer'
                      onClick={(e) => {
                        e.stopPropagation()
                        removeImage(index)
                      }}
                    />
                  </div>
                ))}

              </div>
            ) : (
              <>
                <p className='text-[12px] font-[600]'>{t('new_product.drag_drop')}</p>
                {/* or */}
                <div className='flex justify-center items-center w-[150px]'>
                  <div className='w-[100%] h-[1px] bg-gray-300'></div>
                  <p className='text-sm text-gray-400 mx-2 mb-1'>or</p>
                  <div className='w-[100%] h-[1px] bg-gray-300'></div>
                </div>
                <div className='relative -mt-2'>
                  <img src={mobileImage}
                    alt="mobile-icon"
                    className='w-[100px] h-[100px] '
                  />
                  <img src={blackCamera}
                    alt="mobile-icon"
                    className='w-[25px] h-[25px] absolute bottom-2 left-[37%]'
                  />
                </div>
              </>
            )}
          {/* input field for image upload handling */}
          <input
            type='file'
            id='fileInput'
            className='hidden'
            multiple
            onChange={handleFileInputChange}
          />
          <p className='text-[11px] text-gray-900'>
            {productImages.length
              ? 'Click again to add more images or remove existing ones'
              : `${t('new_product.image_ratio')}`}
          </p>
        </div>
        {/* description */}
        <InputField label={t('new_product.description')} type='textField' placeholder={'Samsung Galaxy-M1 Desc'} value={productDescription} onChange={setproductDescription} />
        <InputField label={t('new_product.descriptionAr')} type='textField' placeholder={'Arabic description here'} value={productDescriptionAr} onChange={setproductDescriptionAr} />
        {/* price */}
        <InputField label={t('new_product.price')} type='number' placeholder={'200 USD'} value={productPrice} onChange={setProductPrice} />
        {/* On Sale pricing and featured */}
        <div className='flex justify-start items-center gap-5'>
          <div className='flex justify-center items-center '>
            <input
              type="checkbox"
              checked={onSale}
              className='w-[15px] h-[15px] border-[1px] border-gray-300 rounded-md'
              // checkbox state handling for bulk pricing
              onChange={handleOnSaleCheckbox}
            />
            <p className='text-[11px] text-gray-900 ml-[5px]'>{t('new_product.on_sale')}</p>
          </div>
          {/* featured check box */}
          <div className='flex justify-center items-center '>
            <input
              type="checkbox"
              checked={isFeatured}
              className='w-[15px] h-[15px] border-[1px] border-gray-300 rounded-md'
              // checkbox state handling for bulk pricing
              onChange={() => {
                setIsFeatured(!isFeatured)
              }}
            />
            <p className='text-[11px] text-gray-900 ml-[5px]'>{t('new_product.featured')}</p>
          </div>
        </div>
        {/* if on sale is clicked */}
        {
          onSale &&
          <InputField
            label={`Sales price`}
            type='number'
            // placeholder={'1'}
            value={selesPrice}
            onChange={setSelesPrice}
          />
        }
        {/* brand */}
        <InputField label={t('new_product.brand')} type='text' placeholder={'Samsung'} value={productBrand} onChange={setProductBrand} />
        {/* main category */}
        <InputField label={t('new_product.main_category')} type='category' value={categories} placeholder={categories} onChange={setCategories} />
        {/* tags */}
        <div className='relative'>
          <label
            htmlFor="name"
            className={`absolute -top-2 bg-white px-2 text-xs font-medium text-gray-900 ${currentLanguage == 'ar' ? 'right-2' : 'left-2'}`}
          >
            {t('new_product.tags')}
          </label>
          <div className="">
            <input
              type="text"
              name="category*"
              value={searchValue}
              onChange={(e) => {
                handleSearchChange(e.target.value);
              }}
              className="block w-full rounded-md border-0 p-3 text-gray-900 shadow-sm ring-1 ring-inset outline-none ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
              placeholder={selectedTags.length === 0 && "Search categories..."}
            />
            {searchValue && filteredCategories.length > 0 && (
              <div className="border rounded-b-md">
                <ul className="cursor-pointer ">
                  {filteredCategories.map((category, index) => (
                    <li
                      className='hover:bg-slate-100 py-1 px-3 transitionc'
                      key={index}
                      onClick={() => handlTagChange(category)}>
                      {category}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {
              searchValue.length > 0 &&
              <p
                className='p-3 cursor-pointer bg-slate-100'
                onClick={() => {
                  setNewTags((prevNewTags) => [...prevNewTags, searchValue]);
                  // this is for tags
                  handlTagChange(searchValue);
                }}
              >
                <span className="selected-category rounded-full bg-tertiary-700 px-3 py-1 mr-1 text-primary-color">
                  Add : {searchValue}
                </span>

              </p>
            }
            <div className="flex flex-wrap gap-2 my-2">
              {[...selectedTags, ...newTags]?.map((category, index) => (
                <span key={index} className="selected-category rounded-full bg-tertiary-700 px-3 py-1 mr-1 text-primary-color">
                  {category}
                  <span
                    className="ml-2 cursor-pointer p-y"
                    onClick={() => {
                      setSelectedTags((prevSelectedCategories) =>
                        prevSelectedCategories.filter(
                          (prevCategory) => prevCategory !== category
                        )
                      );
                      setNewTags((prevNewTags) =>
                        prevNewTags.filter((newTag) => newTag !== category)
                      );
                    }}
                  >
                    x
                  </span>
                </span>
              ))}
            </div>
          </div>
        </div>
        {/* drop down for color */}
        <div className='relative'>
          <label
            className={`text-sm absolute -top-3 bg-white z-10 ${currentLanguage == 'ar' ? 'right-2' : 'left-2'}`}
          >
            If product have color variation please add them
          </label>
          <InputField
            type='color'
            value={productColors}
            onChange={setProductColors}
          />
        </div>
        {/* bulk pricing */}
        <p className={`text-[12px] font-[600] mb-[20px] md:mt-4`}>
          {t('new_product.setup_bulk')}
        </p>
        <div className='flex justify-start md:items-center flex-col md:flex-row gap-2'>
          <p className='text-[12px] font-[600]'>
            {t('new_product.bulk_purchase')}

          </p>
          <div className='flex justify-start md:items-center md:ml-[35px]'>
            <input type="checkbox"
              checked={bulkCheckbox}
              className='w-[15px] h-[15px] border-[1px] border-gray-300 rounded-md'
              // checkbox state handling for bulk pricing
              onChange={handleBulkPricingCheckbox}
            />
            <p className='text-[11px] text-gray-900 ml-[5px]'>{t('new_product.allow_bulk_purchase')}</p>
          </div>
        </div>
        {/* fields for bulk pricing */}
        {bulkCheckbox &&
          bulkPricing.map((range, index) => (
            <div key={index} className='grid grid-cols-12 sm:gap-5 gap-1 '>
              <div className='sm:col-span-5 col-span-12 flex justify-between sm:gap-5 gap-2'>
                <InputField
                  label={`Lower Range ${index + 1}`}
                  type='number'
                  placeholder={'1'}
                  onChange={(value) => handleBulkInputChange(index, 'low_range', value)}
                />
                <InputField
                  label={`Upper Range ${index + 1}`}
                  type='number'
                  placeholder={'99'}
                  onChange={(value) => handleBulkInputChange(index, 'high_range', value)}
                />
              </div>
              <p className='sm:col-span-7 col-span-12'>
                <InputField
                  label={`Bulk Price ${index + 1}`}
                  type='number'
                  placeholder={'250 USD'}
                  onChange={(value) => handleBulkInputChange(index, 'price', value)}
                />
              </p>
            </div>
          ))
        }

        {/* add more bulk pricing */}
        {bulkCheckbox && (
          <div className='flex justify-end items-center gap-3'>
            {bulkFields > 0 && (
              <p
                className='text-[12px] font-[600] bg-header-background text-primary-color px-4 h-[34px] rounded-sm cursor-pointer flex justify-center items-center'
                onClick={handleRemoveBulkRange}
              >
                {t('new_product.remove')}
              </p>
            )}
            <p
              className='text-[12px] font-[600] bg-[#4E97FD] text-primary-color px-4 h-[34px] rounded-sm cursor-pointer flex justify-center items-center'
              onClick={handleAddBulkRange}
            >
              {t('new_product.add_another_range')}
            </p>
          </div>
        )}
        {/* <button
          className='mt-2 bg-blue-500 text-primary-color px-4 py-2 rounded-md'
          onClick={uploadImages}
          disabled={loadingUpload || !productImages.length}
        >
          Upload Images
        </button> */}
        <InputField label={t('new_product.related_product')} placeholder={'Search related products...'} type='relatedProducts' value={selectedProducts} onChange={setSelectedProducts} filterId={productAtom?._id} />
        {/* next and save draft button */}
        <div div className='flex justify-start items-center mt-[20px] gap-3' >
          <p
            // next button navigate to inventory page
            onClick={handleSave}
            className='text-[12px] font-[600] bg-[#4E97FD] py-2 text-primary-color px-4 rounded-sm cursor-pointer flex justify-center items-center'>
            {t('new_product.next')}
          </p>

          <p
            onClick={handleSaveDraft}
            className='text-[12px] font-[600] bg-header-background py-2 text-center text-primary-color px-4 rounded-sm cursor-pointer flex justify-center items-center'>
            {t('new_product.save_draft')}
          </p>
          {/* <p
            onClick={handleSaveDraftAndNext}
            className='text-[12px] font-[600] bg-header-background py-2 text-center text-primary-color px-4 rounded-sm cursor-pointer flex justify-center items-center'>
            {t('new_product.save_n_go')}
          </p> */}
        </div >
      </div>
    </div >
  )
}

export default VendorNewProduct