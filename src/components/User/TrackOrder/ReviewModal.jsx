import React, { useState } from 'react'
import { CiCircleRemove } from 'react-icons/ci'
import { MdOutlineKeyboardArrowDown } from 'react-icons/md'
import { showToast } from 'src/components/Common/Toastify/Toastify'
import mobileImage from 'assets/vendor/mobile.svg'
import blackCamera from 'assets/vendor/black-camera.svg'
import { TiDeleteOutline } from 'react-icons/ti'
import ReactStars from 'react-stars'
import axios from 'axios'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from "react-router-dom";

const ReviewModal = ({ setShowReviewModal, selectedProduct, productItemId, isNeedToUpdate }) => {
    const [productImages, setProductImages] = useState([]);
    const [loadingUpload, setLoadingUpload] = useState(false);
    const user = JSON.parse(localStorage.getItem('user'));
    const token = JSON.parse(localStorage.getItem('token'));
    const [imageLinks, setImageLinks] = useState([]);
    const [progress, setProgress] = useState(0);
    const [review, setReview] = useState('')
    const [rating, setRating] = useState(0)
    const queryClient = useQueryClient();
    const navigate = useNavigate()
    // console.log(progress, imageLinks)
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

    const uploadImages = async () => {
        if (productImages.length === 0) {
            // No images to upload
            return;
        }
        setLoadingUpload(true);

        try {
            for (const file of productImages) {
                const link = await uploadFile(file);
                setImageLinks((prevLinks) => [...prevLinks, link]);
            }
            showToast('Images uploaded successfully', 'success');
            // setProductImages([]);
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

    const handleFeedbackSubmit = async () => {

        if (rating === 0) {
            showToast('Please provide a rating', 'error');
            return;
        }
        // console.log
        if (isNeedToUpdate == true) {
            try {
                const res = await axios.put(`${import.meta.env.VITE_API_PATH}/reviews/update/`, {
                    'rating': rating,
                    'feedback': review,
                    'images': imageLinks,
                }, {
                    headers: {
                        Authorization: `Bearer ${token.accessToken}`
                    }
                });

                if (res.status === 200) {
                    showToast('Review added successfully', 'success');
                    queryClient.invalidateQueries({ queryKey: ['orders'] })
                    setShowReviewModal(false);
                    navigate("/orders");
                } else {
                    showToast('Error adding review', 'error');
                }
            } catch (error) {
                showToast('Error adding review', 'error');
            }
        } else {
            try {
                const res = await axios.post(`${import.meta.env.VITE_API_PATH}/reviews/create`, {
                    'product_id': selectedProduct,
                    'product_item_id': productItemId,
                    'customer': user?._id,
                    'rating': rating,
                    'feedback': review,
                    'images': imageLinks,
                    'publish': true
                }, {
                    headers: {
                        Authorization: `Bearer ${token.accessToken}`
                    }
                });

                if (res.status === 200) {
                    showToast('Review added successfully', 'success');
                    queryClient.invalidateQueries({ queryKey: ['orders'] })
                    setShowReviewModal(false);
                    navigate("/orders");
                } else {
                    showToast('Error adding review', 'error');
                }
            } catch (error) {
                showToast('Error adding review', 'error');
            }
        }

    };

    return (
        <div className='fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center px-2'>
            <div className='bg-white py-4 rounded-sm flex flex-col gap-3 w-[472px]'>
                <div className='flex justify-between px-4 items-center'>
                    <p className='mb-1 uppercase font-[500]'>Leave a Rating</p>
                    <CiCircleRemove
                        className='w-6 h-6 cursor-pointer text-gray-400 hover:text-tertiary-500 transition duration-300 ease-in-out'
                        onClick={() => {
                            setShowReviewModal(false)
                        }}
                    />

                </div>
                <hr className='' />
                {/* Feedback rating */}
                <div className='flex justify-start items-center gap-5 px-4 text-[14px] relative'>
                    <p className='text-gray-600 text-start'>Rating</p>
                    <ReactStars
                        count={5}
                        size={24}
                        color1={'#cccccc'}
                        half={false}
                        value={rating}  // Pass the current rating value
                        onChange={(newValue) => {
                            setRating(newValue);  // Set the rating based on the selected value
                        }}
                    />
                    {/* <select
                        onChange={(e) => {
                            setRating(parseInt(e.target.value));
                        }}
                        className='border-2 border-gray-100 rounded-sm px-2 py-2 appearance-none outline-none cursor-pointer text-tertiary-600'>
                        {
                            [5, 4, 3, 2, 1].map((i) => (
                                <option key={i} value={i}>
                                    <ReactStars
                                        count={i}
                                        size={24}
                                        color1={'#FFFFFF'}
                                        half={false}
                                    />
                                    <span >
                                        {i} Star Rating
                                    </span>
                                </option>
                            ))

                        }
                    </select> */}

                    {/* <MdOutlineKeyboardArrowDown className='absolute right-6 bottom-2 w-5 h-6 text-gray-400' /> */}
                </div>
                {/* Feedback textarea */}
                <div className='flex justify-start gap-2 px-4 flex-col text-[14px] relative'>
                    <p className='text-gray-600 text-start'>Feedback</p>
                    <textarea
                        onChange={(e) => {
                            setReview(e.target.value)
                        }}
                        className='border-2 border-gray-100 rounded-sm px-2 py-2 appearance-none outline-none cursor-text h-28 w-full resize-none overflow-y-auto'
                        placeholder='Write down your feedback about our product & services'
                    />
                </div>


                {/* image upload field */}
                <div
                    className='bg-gray-100 cursor-pointer relative p-2 h-[220px] rounded-md flex justify-center items-center flex-col border-dashed border-gray-300 border-[1px] mx-4 mt-2'
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={() => {
                        if (!productImages.length) {
                            handleImageClick();
                        }
                    }}
                >
                    <button
                        onClick={() => uploadImages()}
                        className='bg-[#4E97FD] text-primary-color px-4 py-1 rounded-sm text-[10px] absolute right-2 bottom-2'
                    >
                        Upload
                    </button>
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
                                            onClick={() => removeImage(index)}
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <>
                                <p className='text-[12px] font-[600]'>Drag & drop product images here</p>

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
                        Upload 280*280 images
                    </p>
                </div>

                {/* cancel order button */}
                <div className='flex justify-start gap-2 px-4'>
                    <button
                        onClick={() => {
                            if (loadingUpload) {
                                showToast('Please wait, images are still uploading', 'error');
                                return;
                            }
                            handleFeedbackSubmit()
                            // navigate('/orders')
                        }}
                        className='px-3 py-1 border-2 bg-buttons rounded-[4px] text-primary-color font-[500]'
                    >
                        Publish Review
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ReviewModal