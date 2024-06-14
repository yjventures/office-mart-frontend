import React, { useEffect, useState } from 'react'
import VendorHeader from '../../../components/Vendor/VendorHeader/VendorHeader'
import { IoSearchOutline } from "react-icons/io5";
import { GoPlus } from "react-icons/go";
import { useAtomValue, useSetAtom } from 'jotai';
import { newProductAtom, tokenAtom, userAtom, viewVendorAtom } from '../../../lib/jotai';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import PaginationComponent from '../../../components/Admin/Pagination/PaginationComponent';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { AiFillDelete } from 'react-icons/ai';
import { MdEdit } from "react-icons/md";
import { Switch } from '@headlessui/react'
import axios from 'axios';
import { showToast } from 'src/components/Common/Toastify/Toastify';
import AdminHeader from 'src/components/Admin/AdminHeader/AdminHeader';
import DeleteVendorModal from 'src/components/Admin/DeleteVendorModal/DeleteVendorModal';


const ProductList = () => {
  const token = useAtomValue(tokenAtom)
  const [productView, setProductView] = useState({})
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [limit, setLimit] = useState(10)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [search, setSearch] = useState('')
  const newProduct = useSetAtom(newProductAtom)
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productIdToDelete, setProductIdToDelete] = useState(null);

  const handleDeleteClick = (vendorId) => {
    setProductIdToDelete(vendorId);
    setShowDeleteModal(true);
  };
  // Function to handle page change
  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
    queryClient.invalidateQueries({ queryKey: ['products'] });
  };

  const user = JSON.parse(localStorage.getItem('user'))

  const { isPending, isError, error, data } = useQuery({
    queryKey: ['products', limit, page],
    queryFn: async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_PATH}/products/get-all?limit=${limit}&page=${page}`, {
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem('token')).accessToken}`
          }
        });

        const jsonData = await response.json();
        setTotalPages(Math.ceil(jsonData?.total / limit))
        return jsonData?.product_info;
      } catch (error) {
        console.error(`Error fetching data`);
      }
    },
  });
  // console.log(data)
  // set total pages
  // useEffect(() => {
  //   setTotalPages(Math.ceil(data?.length / limit))
  // }, [data])

  // console.log(data)
  const handleDeleteProduct = (id) => async () => {

    fetch(`${import.meta.env.VITE_API_PATH}/products/delete/${id}`, {
      method: 'DELETE',
    })
      .then(response => response.json())
      .then(result => {
        if (result) {
          showToast('Product deleted successfully', 'success')
          queryClient.invalidateQueries({ queryKey: ['products'] });
        }
      })
      .catch(error => {
        showToast('Something went wrong, Please try again', 'error')
        console.error('error', error)
      });

  }


  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

  // component for table cell
  const ProductTableCell = ({ label, hiddenOnLG, type, img }) => {
    const cellClasses = classNames(
      hiddenOnLG && 'hidden lg:table-cell',
      'px-3 py-3.5 text-sm text-gray-500'
    );

    return (
      <td className={cellClasses}>
        {
          type == 'category' ?
            <p className=' bg-gray-200 px-3 py-1 rounded-full text-center text-black'>
              {label}
            </p> :
            <p className='flex gap-2 items-center'>
              {
                type == 'img' && <img src={img} alt="product" className='w-10 h-10 rounded-md' />
              }
              {label}
            </p>
        }

      </td>
    );
  };
  // Function to handle the toggle of the Switch

  const handleToggleSwitch = async (productId, isPublished, draft) => {
    // console.log(productId, isPublished, draft)
    if (draft == true && isPublished == false) {
      showToast('Please provide necessary information', 'info')
      navigate(`/new-product`)
      return;
    }
    const res = await axios.put(`${import.meta.env.VITE_API_PATH}/products/update/${productId}`, {
      is_published: !isPublished
    }, {
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('token')).accessToken}`
      }
    })
    // console.log(res)
    if (res.status == 200) {
      showToast(`Product ${isPublished == true ? 'unpublished' : 'published successfully'} `, 'info')
      queryClient.invalidateQueries({ queryKey: ['products'] });
    } else {
      showToast('Something went wrong, Please try again', 'error')
    }

  };


  return (
    <div className='font-main'>
      <AdminHeader
        browseWebsite={true}
        addNew={false}
        search={true}
        notification={true}
        profile={true}
        setSearch={setSearch}
        nameOfSearching={'products'}
      />
      {/* search bar and add new button */}
      <div className='bg-gray-100 p-4 rounded-md'>
        <p className='font-[600] px-2'>Product List</p>
        {/* table */}
        <div className="sm:px-4 lg:px-1 overflow-scroll lg:overflow-hidden">
          <div className="-mx-4 mt-10  sm:mx-0 bg-white">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th scope="col" className=" py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 lg:table-cell">
                    Name
                  </th>
                  <th
                    scope="col"
                    className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                  >
                    Category
                  </th>
                  <th
                    scope="col"
                    className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                  >
                    Brand
                  </th>
                  <th
                    scope="col"
                    className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                  >
                    {/* Wallet Balance */}
                    Price
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    {/* No of Orders */}
                    Published
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                    Action
                  </th>

                </tr>
              </thead>
              <tbody>
                {
                  isPending && (
                    <tr>
                      <td colSpan='6' className='text-center py-4'>Loading...</td>
                    </tr>
                  )
                }
                {
                  data?.length === 0 && (
                    <tr>
                      <td colSpan='6' className='text-center py-4'>No Products Found</td>
                    </tr>
                  )
                }
                {/* all products here */}
                {
                  // isPending === false &&
                  //   data === undefined ? (
                  //   <tr>
                  //     <td colSpan='6' className='text-center py-4'>Please Add New Products</td>
                  //   </tr>
                  // ) :
                  data
                    // ?.slice((page - 1) * limit, page * limit)
                    ?.filter((item) => {
                      return search.toLowerCase() === '' ? item : item?.name?.en?.toLowerCase()?.includes(search);
                    })
                    ?.map((product, productIndex) => (
                      <tr
                        onClick={() => {
                          setProductView(product)
                        }}
                        key={productIndex} className={classNames(`border-t border-gray-200 ${product._id === productView?._id && 'bg-gray-50'}`)}>
                        <ProductTableCell label={product?.name?.en} img={product?.images[0]} type='img' />
                        {/* <ProductTableCell label={product?.name.en} /> */}
                        {/* Adjust the following based on your new data structure */}
                        <ProductTableCell label={product?.main_category?.title?.en} type='category' hiddenOnLG />
                        <ProductTableCell label={product?.brand} hiddenOnLG />
                        <ProductTableCell label={product?.price} hiddenOnLG />

                        <td
                          className={classNames(
                            productIndex === 0 ? '' : 'border-t border-gray-200',
                            'px-3 py-3.5 text-sm text-gray-500'
                          )}
                        >
                          <Switch
                            checked={product.is_published}
                            onChange={() => {
                              newProduct(product)
                              handleToggleSwitch(product?._id, product?.is_published, product?.draft)
                            }}
                            className="group relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer items-center justify-center rounded-full focus:outline-none ms-3"
                          >
                            <span aria-hidden="true" className="pointer-events-none absolute h-full w-full rounded-md bg-white" />
                            <span
                              aria-hidden="true"
                              className={classNames(
                                product.is_published == true ? 'bg-buttons' : 'bg-gray-200',
                                'pointer-events-none absolute mx-auto h-4 w-9 rounded-full transition-colors duration-200 ease-in-out'
                              )}
                            />
                            <span
                              aria-hidden="true"
                              className={classNames(
                                product.is_published ? 'translate-x-5' : 'translate-x-0',
                                'pointer-events-none absolute left-0 inline-block h-5 w-5 transform rounded-full border border-gray-200 bg-white shadow ring-0 transition-transform duration-200 ease-in-out'
                              )}
                            />
                          </Switch>
                        </td>
                        <td
                          className={classNames(
                            productIndex === 0 ? '' : 'border-t border-gray-200',
                            'ms-4 relative py-3.5 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 flex justify-center items-center gap-2'
                          )
                          }
                        >
                          {/* view and delete */}
                          {/* <MdEdit
                            onClick={() => {
                              newProduct(product)
                              navigate(`/new-product`)
                            }}
                            className='mr-2 cursor-pointer w-5 h-5  text-gray-600 hover:text-tertiary-600 transition'
                          /> */}
                          <MdOutlineRemoveRedEye
                            onClick={() => {
                              navigate(`/product-details/${product?._id}`)
                            }}
                            className='mr-2 mt-2 cursor-pointer w-5 h-5 text-gray-600 hover:text-tertiary-600 transition'
                          />
                          {/* <AiFillDelete
                            onClick={handleDeleteProduct(product?._id)}
                            className='mr-2 cursor-pointer w-5 h-5 text-gray-600 hover:text-red-600 transition'
                          /> */}
                          <AiFillDelete
                            onClick={() => handleDeleteClick(product?._id)}
                            className='mr-2 mt-2 cursor-pointer w-5 h-5 text-gray-600 hover:text-red-600 transition'
                          />
                          {showDeleteModal && (
                            <DeleteVendorModal
                              setShowDeleteModal={setShowDeleteModal}
                              apiEndpoint={`${import.meta.env.VITE_API_PATH}/products/delete/${productIdToDelete}`}
                              type={`product`}
                            />
                          )}
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
            {/* pagination */}
            <PaginationComponent
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>

    </div>
  )
}

export default ProductList