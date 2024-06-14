import React, { useState } from 'react'
import { LuFileEdit } from "react-icons/lu";
import { FiTrash } from "react-icons/fi";
import { showToast } from 'src/components/Common/Toastify/Toastify';
import { IoAddSharp } from "react-icons/io5";
import { BiCategory } from "react-icons/bi";
import axios from 'axios';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import AdminHeader from 'src/components/Admin/AdminHeader/AdminHeader';

export default function Category() {
    const user = JSON.parse(localStorage.getItem('user'))
    const token = JSON.parse(localStorage.getItem('token'));
    const [showAddModal, setShowAddModal] = useState(false);
    const queryClient = useQueryClient();


    const [showEditModal, setShowEditModal] = useState(false);


    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [loading, setLoading] = useState(false)
    const [loadingUpload, setLoadingUpload] = useState(false)
    const [progress, setProgress] = useState(0)
    const [limit, setLimit] = useState(5)
    const [searchValue, setSearchValue] = useState('')


    const { isPending, isError, error, data } = useQuery({
        queryKey: ['category', limit],
        queryFn: async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_PATH}/categories/get-all?sortBy=-weight_matrics`,) //&limit=${limit}
                return res.data.categories;

            } catch (error) {
                console.error('Something went wrong')
            }
        }
    })
    // console.log(isError, data, isPending, error)

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
                    console.log("Error uploading file: ", err);
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

    const AddCategoryModal = () => {
        const [name, setName] = useState('')
        const [arabicName, setArabicName] = useState('')
        const [image, setImage] = useState(null)
        const [previewImage, setPreviewImage] = useState(null)
        const handleAddCategory = async () => {
            setLoading(true);
            try {
                // Check if an image is selected
                if (!image) {
                    showToast('Please select an image', 'error');
                    return;
                }

                // Upload the single image
                const imageLink = await uploadFile(image);

                const res = await axios.post(`${import.meta.env.VITE_API_PATH}/categories/create`,
                    {
                        name: name,
                        title: {
                            en: name,
                            ac: arabicName
                        },
                        image: imageLink,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token.accessToken}`,
                        },
                    }
                );

                if (res.status === 200) {
                    showToast('Category added', 'info');
                } else {
                    showToast('Failed to add category', 'error');
                }
            } catch (error) {
                showToast('Something went wrong', 'error');
                console.error(error);
            } finally {
                queryClient.invalidateQueries({ queryKey: ['category'] });
                setLoading(false);
                setShowAddModal(false)
            }
        };



        return (
            <div className="fixed inset-0 z-40 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
                <div className="fixed inset-0 transition-opacity" >
                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                <h3 className="text-lg leading-6 font-medium text-gray-900 flex justify-start items-center gap-2 mb-2" id="modal-title">
                                    <BiCategory /> Let's make a category
                                </h3>

                                <div className="mt-2 flex justify-center items-center gap-2 flex-col">
                                    <div className='w-full '>
                                        <label className='text-gray-600 text-sm'>Name*</label>
                                        <input
                                            type="text"
                                            className='border-2 w-full rounded-md p-2 outline-none mt-1'
                                            placeholder='Name here'
                                            onChange={(e) => setName(e.target.value)}
                                            value={name}
                                        />
                                    </div>

                                    <div className='w-full '>
                                        <label className='text-gray-600 text-sm'>Arabic name*</label>
                                        <input
                                            type="text"
                                            className='border-2 w-full rounded-md p-2 outline-none mt-1'
                                            placeholder='Arabic name here'
                                            onChange={(e) => setArabicName(e.target.value)}
                                            value={arabicName}
                                        />
                                    </div>

                                    <div className='w-full '>
                                        <label className='text-gray-600 text-sm'>Select image*</label>
                                        <input
                                            type="file"
                                            className='border-2 w-full rounded-md p-2 mt-1'
                                            placeholder='Name of category'
                                            onChange={(e) => {
                                                const selectedFile = e.target.files[0];
                                                setImage(selectedFile);

                                                // Display image preview
                                                if (selectedFile) {
                                                    const reader = new FileReader();
                                                    reader.onloadend = () => {
                                                        setPreviewImage(reader.result);
                                                    };
                                                    reader.readAsDataURL(selectedFile);
                                                }
                                            }}
                                        />
                                        {previewImage && <img src={previewImage} alt="Selected Image" className='w-full h-60 rounded-sm mt-2 object-contain' />}
                                        {loadingUpload && <p> File upload progress is in progress  </p>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        {/* confirm */}

                        <button
                            onClick={() => {
                                if (loading) {
                                    showToast('Please wait', 'error')
                                } else {
                                    handleAddCategory()
                                }
                            }}
                            type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-buttons text-base font-medium text-white hover:bg-tertiary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm" >
                            {
                                loading ? 'Loading..' : 'Confirm'
                            }
                        </button>
                        {/* close */}
                        <button
                            onClick={() => setShowAddModal(false)}
                            type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm" >
                            Close
                        </button>

                    </div>
                </div>
            </div>
        )
    }

    const EditCategoryModal = () => {
        const [editedName, setEditedName] = useState('');
        const [editedArabicName, setEditedArabicName] = useState('');
        const [editedImage, setEditedImage] = useState('');
        const [editedPreviewImage, setEditedPreviewImage] = useState(null);
        const [loadingEdit, setLoadingEdit] = useState(false);
        const [loadingUploadEdit, setLoadingUploadEdit] = useState(false);
        const [editProgress, setEditProgress] = useState(0);

        const handleEditCategory = async () => {
            setLoadingEdit(true);
            try {
                // Check if an image is selected
                if (!editedImage || editedName == '' || editedArabicName == '') {
                    showToast('Please fillup all data', 'error');
                    return;
                }
                // Upload the edited image
                const editedImageLink = await uploadFile(editedImage);

                // Logic to update category with edited information
                const res = await axios.put(
                    `${import.meta.env.VITE_API_PATH}/categories/update/${selectedCategory._id}`,
                    {
                        name: editedName,
                        title: {
                            en: editedName,
                            ac: editedArabicName
                        },
                        image: editedImageLink ? editedImageLink : editedImage,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token.accessToken}`,
                        },
                    }
                );

                if (res.status === 200) {
                    showToast('Category updated', 'info');
                } else {
                    showToast('Failed to update category', 'error');
                }
            } catch (error) {
                showToast('Something went wrong', 'error');
                console.error(error);
            } finally {
                queryClient.invalidateQueries({ queryKey: ['category'] });
                setLoadingEdit(false);
                setShowEditModal(false);
            }
        };

        return (
            <div className="fixed inset-0 z-40 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
                <div className="fixed inset-0 transition-opacity" >
                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                <h3 className="text-lg leading-6 font-medium text-gray-900 flex justify-start items-center gap-2 mb-2" id="modal-title">
                                    <BiCategory /> Editing <span className='font-bold'>{selectedCategory.name}</span>
                                </h3>

                                <div className="mt-2 flex justify-center items-center gap-2 flex-col">
                                    <div className='w-full '>
                                        <label className='text-gray-600 text-sm'>Name*</label>
                                        <input
                                            type="text"
                                            className='border-2 w-full rounded-md p-2 outline-none mt-1'
                                            placeholder={selectedCategory.name}
                                            onChange={(e) => setEditedName(e.target.value)}
                                            value={editedName}

                                        />
                                    </div>

                                    <div className='w-full '>
                                        <label className='text-gray-600 text-sm'>Arabic name*</label>
                                        <input
                                            type="text"
                                            className='border-2 w-full rounded-md p-2 outline-none mt-1 rtl'
                                            placeholder={selectedCategory?.title?.ac}
                                            onChange={(e) => setEditedArabicName(e.target.value)}
                                            value={editedArabicName}
                                        />
                                    </div>

                                    <div className="w-full">
                                        <label className='text-gray-600 text-sm'>Select image*</label>
                                        <input
                                            type="file"
                                            className='border-2 w-full rounded-md p-2 mt-1'
                                            placeholder='Name of category'
                                            onChange={(e) => {
                                                const selectedFile = e.target.files[0];
                                                setEditedImage(selectedFile);
                                            }}
                                        />
                                        {!loadingEdit && (
                                            <div className='mt-2'>
                                                {editedPreviewImage ? (
                                                    <img src={editedPreviewImage} alt="Selected Image" className='w-full h-60 rounded-sm mt-2 object-contain' />
                                                ) : (
                                                    <>
                                                        <p className='mt-2'>Current image</p>
                                                        {selectedCategory.image ? (
                                                            <img src={selectedCategory.image} alt="current Image" className='w-full h-60 rounded-sm mt-2 object-contain' />
                                                        ) : (
                                                            <p>No current image available</p>
                                                        )}
                                                    </>
                                                )}

                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        {/* confirm */}

                        <button
                            onClick={() => {
                                if (loading) {
                                    showToast('Please wait', 'error')
                                } else {
                                    handleEditCategory()
                                }
                            }}
                            type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-buttons text-base font-medium text-white hover:bg-tertiary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm" >
                            {
                                loading ? 'Loading..' : 'Confirm'
                            }
                        </button>
                        {/* close */}
                        <button
                            onClick={() => setShowEditModal(false)}
                            type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm" >
                            Close
                        </button>

                    </div>
                </div>
            </div>
        )
    };

    const DeleteCategoryModal = () => {
        const [loadingDelete, setLoadingDelete] = useState(false)

        const handleDeleteCategory = async () => {
            setLoadingDelete(true);
            try {

                const res = await axios.delete(
                    `${import.meta.env.VITE_API_PATH}/categories/delete/${selectedCategory._id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token.accessToken}`,
                        },
                    }
                );

                if (res.status === 200) {
                    // console.log('Category deleted', 'info');
                } else {
                    showToast('Failed to update category', 'error');
                }
            } catch (error) {
                showToast('Something went wrong', 'error');
                console.error(error);
            } finally {
                queryClient.invalidateQueries({ queryKey: ['category'] });
                setLoadingDelete(false);
                setShowDeleteModal(false);
            }
        }

        return (
            <div className="fixed inset-0 z-40 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
                <div className="fixed inset-0 transition-opacity" >
                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                <h3 className="text-lg leading-6 font-medium text-gray-900 flex justify-start items-center gap-2 mb-2" id="modal-title">
                                    <BiCategory /> Are you sure to delete <span className='font-bold'>{selectedCategory.name} </span>Category
                                </h3>

                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        {/* confirm */}

                        <button
                            onClick={() => {
                                if (loadingDelete) {
                                    showToast('Please wait', 'error')
                                } else {
                                    handleDeleteCategory()
                                }
                            }}
                            type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2  bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm" >
                            {
                                loadingDelete ? 'Loading..' : 'Confirm Delete'
                            }
                        </button>
                        {/* close */}
                        <button
                            onClick={() => setShowDeleteModal(false)}
                            type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-buttons text-base font-medium text-white hover:bg-tertiary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm" >
                            Close
                        </button>

                    </div>
                </div>
            </div>
        )
    }

    const handleAddCategory = () => {
        setShowAddModal(true)
    }
    // main 
    return (
        <div className='mt-10 lg:mt-0 font-main'>
            <AdminHeader
                browseWebsite={true}

                addNew={true}
                addNewText={'Category'}
                handleAdd={handleAddCategory}

                notification={true}
                profile={true}

                search={true}
                setSearch={setSearchValue}
                nameOfSearching={'categories'}
            />
            <div className="grid gap-4 md:gap-8 bg-gray-100 px-1 py-4 rounded-md">


                {/* Add Category Modal */}
                {showAddModal && <AddCategoryModal />}

                {/* Edit Category Modal */}
                {showEditModal && <EditCategoryModal />}


                {/* Delete Category Modal */}
                {showDeleteModal && <DeleteCategoryModal />}
                <p className='font-[600] px-2'>Category List</p>

                <div className="grid gap-4 px-3">
                    {
                        data
                            ?.filter((cat) => cat.name.toLowerCase().includes(searchValue))
                            ?.map((catagory, index) => (
                                <div key={index} className="flex bg-white items-center gap-4 shadow-md rounded-md py-1">
                                    <img
                                        alt="Category image"
                                        className="aspect-square rounded-md object-contain mx-1"
                                        height="64"
                                        src={catagory.image !== '' ? catagory.image : `https://i0.wp.com/sunrisedaycamp.org/wp-content/uploads/2020/10/placeholder.png`}
                                        width="64"
                                    />

                                    <div className="flex-1">
                                        <div className="font-semibold mb-2">{catagory.name}</div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">{catagory.title.ac}</div>
                                    </div>

                                    <div className="flex items-center gap-2 ml-auto me-4">
                                        <button
                                            onClick={() => {
                                                setSelectedCategory(catagory)
                                                setShowEditModal(true)
                                            }}
                                            className="w-8 h-8 hover:bg-gray-100 flex items-center justify-center rounded-full transition" size="icon" variant="outline"
                                        >
                                            <LuFileEdit className="w-4 h-4" />
                                            <span className="sr-only">Edit</span>
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSelectedCategory(catagory)
                                                setShowDeleteModal(true)
                                            }}
                                            className="w-8 h-8 hover:bg-gray-100 flex items-center justify-center rounded-full transition" size="icon" variant="outline"
                                        >
                                            <FiTrash className="w-4 h-4" />
                                            <span className="sr-only">Delete</span>
                                        </button>
                                    </div>
                                </div>
                            ))
                    }
                </div>
            </div>
        </div>
    )
}