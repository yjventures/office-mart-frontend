import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useSetAtom } from 'jotai'
import React, { useEffect, useState } from 'react'
import { AiFillDelete } from 'react-icons/ai'
import { MdEdit, MdOutlineRemoveRedEye } from 'react-icons/md'
import AdminHeader from 'src/components/Admin/AdminHeader/AdminHeader'
import PaginationComponent from 'src/components/Admin/Pagination/PaginationComponent'
import { useLocation, useNavigate } from 'react-router-dom';


const AllOrdersList = () => {
    const queryClient = useQueryClient()
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem('user'))
    const limit = 10;
    const [page, setPage] = React.useState(1);
    const [totalPages, setTotalPages] = React.useState(0);
    const [search, setSearch] = React.useState('');
    const [productView, setProductView] = React.useState({});
    // const [selectedFilter, setSelectedFilter] = useState('All Date');
    const navigate = useNavigate();
    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
    }
    // const path = new URL(window.location.href).pathname;
    // const [start_date, setStart_date] = useState(new Date());
    // const [end_date, setEnd_date] = useState(new Date());

    // Determine the API parameters based on the current route
    let apiParams = '';
    if (location.pathname.includes('pending-orders-list')) {
        apiParams = '&status=pending';
    } else if (location.pathname.includes('processing-orders-list')) {
        apiParams = '&status=processing';
    } else if (location.pathname.includes('shipped-order-list')) {
        apiParams = '&status=shipped';
    } else if (location.pathname.includes('delivered-ordered-list')) {
        apiParams = '&status=delivered';
    }
    // console.log(apiParams)
    const { isPending, isError, error, data } = useQuery({
        queryKey: ['orders', limit, page, apiParams],
        // start_date, end_date
        queryFn: async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_PATH}/order-items/get-all?limit=${limit}&sortBy=-createdAt&page=${page}${apiParams}`, {
                    headers: {
                        Authorization: `Bearer ${JSON.parse(localStorage.getItem('token')).accessToken}`
                    }
                });

                const jsonData = await response.json();
                setTotalPages(Math.ceil(jsonData?.total / limit))
                return jsonData?.product;
            } catch (error) {
                console.error(`Error fetching data`);
            }
        },
        // refetchInterval: 10000,
    });


    // useEffect(() => {
    //     queryClient.invalidateQueries({ queryKey: ['orders'] })
    // }, [])

    // console.log(data)
    const handlePageChange = (pageNumber) => {
        setPage(pageNumber);
        // queryClient.invalidateQueries({ queryKey: ['products'] });
        // queryClient.invalidateQueries({ queryKey: ['products'] });
    };
    // const handleDeleteOrder = (id) => async () => {

    //     fetch(`${import.meta.env.VITE_API_PATH}/products/delete/${id}`, {
    //         method: 'DELETE',
    //     })
    //         .then(response => response.json())
    //         .then(result => {    
    //             if (result) {
    //                 showToast('Product deleted successfully', 'success')
    //                 queryClient.invalidateQueries({ queryKey: ['orders'] })
    //             }
    //         })
    //         .catch(error => {
    //             showToast('Something went wrong, Please try again', 'error')
    //             console.log('error', error)
    //         });
    // }

    // component for table cell
    const ProductTableCell = ({ label, hiddenOnLG, type, img, order_id }) => {
        const cellClasses = classNames(
            hiddenOnLG && 'hidden lg:table-cell',
            'px-3 py-3.5 text-sm text-gray-500'
        );

        return (
            <td className={cellClasses}>
                {
                    type == 'category' ?
                        <p className={`px-3 py-1 rounded-sm text-center ${label == 'delivered' ? 'text-primary-color bg-tertiary-700' : label == 'shipped' ? 'text-primary-color bg-tertiary-500' : 'text-yellow-800 bg-yellow-300'}`}>
                            {
                                label.charAt(0).toUpperCase() + label.slice(1)
                            }
                        </p> :
                        <p className='flex gap-2 items-center'>
                            {
                                type == 'img' ?
                                    <>
                                        {
                                            img !== undefined ?
                                                <div className='flex items-center gap-2 '>
                                                    <img src={img} alt="product" className='w-10 h-10 rounded-md' />
                                                    {label}
                                                    
                                                    <p className='font-bold'>#{order_id && order_id?.toUpperCase()}</p>

                                                </div> :
                                                <p>
                                                    <span className='bg-red-600 text-primary-color px-2 py-1 rounded-full me-4'>Deleted product</span>
                                                    {label}
                                                </p>
                                        }
                                    </> :
                                    <p >
                                        {label}
                                    </p>
                            }

                        </p>
                }

            </td>
        );
    };


    return (
        <div className='font-main'>
            <AdminHeader
                browseWebsite={true}
                addNew={false}
                notification={true}
                profile={true}
                search={true}
                setSearch={setSearch}
                nameOfSearching={'products'}
            />
            <div className='mt-10 lg:mt-0 bg-gray-100 p-3'>

                <div className='flex justify-between items-center px-2'>
                    <p className='text-[20px] px-2'>Order List</p>
                    <div className='flex items-center gap-2'>
                        <p>Filter by</p>
                        <select
                            className='py-1 px-2 appearance-none rounded-md cursor-pointer outline-none'
                            onChange={(e) => {
                                if (e.target.value == 'pending') {
                                    navigate('/pending-orders-list')
                                } else if (e.target.value == 'processing') {
                                    navigate('/processing-orders-list')
                                } else if (e.target.value == 'shipped') {
                                    navigate('/shipped-order-list')
                                } else if (e.target.value == 'delivered') {
                                    navigate('/delivered-ordered-list')
                                } else {
                                    navigate('/all-orders-list')
                                }
                            }}
                        >
                            {
                                ['All orders', 'pending', 'processing', 'shipped', 'delivered'].map((item, index) => {
                                    return (
                                        <option value={item} key={index}>{item.charAt(0).toUpperCase() + item.slice(1)}</option>
                                    )
                                })
                            }
                        </select>
                    </div>
                </div>
                {/* table for orders */}

                <div className="lg:px-1 overflow-scroll mt-4 lg:overflow-hidden">
                    <div className="sm:mx-0 bg-white rounded-md">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead>
                                <tr>
                                    <td scope="col" className=" py-3.5 pl-4 pr-3 text-left text-sm text-gray-700 sm:pl-6 lg:table-cell">
                                        Name
                                    </td>
                                    <td
                                        scope="col"
                                        className="hidden px-3 py-3.5 text-left text-sm text-gray-700 lg:table-cell"
                                    >
                                        Qty
                                    </td>

                                    <td scope="col" className="px-3 py-3.5 text-left text-sm text-gray-700">
                                        Amount
                                    </td>
                                    <td scope="col" className="px-3 py-3.5 text-left text-sm text-gray-700">
                                        Status
                                    </td>
                                    <td scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-700">
                                        Action
                                    </td>

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
                                {data
                                    ?.filter((item) => {
                                        return search.toLowerCase() === '' ? item : item?.name?.en?.toLowerCase()?.includes(search);
                                    })
                                    ?.map((product, productIndex) => (
                                        <tr
                                            key={product._id}
                                            onClick={() => setProductView(product)}
                                            className={classNames(`border-t border-gray-200 ${product?._id === productView?._id && 'bg-gray-50'}`)}
                                        >
                                            {/* <ProductTableCell label={product?.images[0]} /> */}
                                            <ProductTableCell label={product?.name?.en} order_id={product?.order_id?._id} img={product?.product_id?.images[0]} type='img' />
                                            <ProductTableCell label={product?.quantity} />
                                            {/* <ProductTableCell label={product?.creation_date && new Date(product?.creation_date)} hiddenOnLG /> */}
                                            {/* <ProductTableCell label={product?.billingAddress} hiddenOnLG /> */}
                                            <ProductTableCell label={`$ ${product?.price}`} />
                                            <ProductTableCell label={product?.status} type='category' />
                                            {/* action cell */}
                                            <td
                                                className={classNames(
                                                    productIndex === 0 ? '' : 'border-t border-gray-200',
                                                    'ms-4 relative py-6 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 flex justify-center items-center h-full gap-2 md:flex-nowrap flex-wrap'
                                                )}
                                            >
                                                <MdEdit
                                                    onClick={() => {
                                                        navigate(`/admin-order-details/${product?._id}`)
                                                    }}
                                                    className='mr-2 cursor-pointer w-5 h-5  text-gray-600 hover:text-tertiary-600 transition'
                                                />

                                                {/* 
                                                <AiFillDelete
                                                    // onClick={handleDeleteProduct(product?._id)}
                                                    className='mr-2 cursor-pointer w-5 h-5 text-gray-600 hover:text-red-600 transition'
                                                /> */}
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

export default AllOrdersList

function CalendarIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
            <line x1="16" x2="16" y1="2" y2="6" />
            <line x1="8" x2="8" y1="2" y2="6" />
            <line x1="3" x2="21" y1="10" y2="10" />
        </svg>
    )
}


function FilterIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
        </svg>
    )
}
