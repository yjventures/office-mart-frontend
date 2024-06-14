import { Fragment, useEffect, useRef, useState } from 'react'
import { Dialog } from '@headlessui/react'
import icon from '../../assets/global/sonbola.svg'
import textIcon from 'assets/constant/logo/textSonbola.svg'
import searchIcon from '../../assets/global/search.svg'
import userIcon from '../../assets/global/user.svg'
import wishlistIcon from '../../assets/global/wishlist.svg'
import { CiHeart } from "react-icons/ci";
import cartIcon from '../../assets/global/cart.svg'
import { HiXMark } from "react-icons/hi2";
import { HiBars3 } from "react-icons/hi2";
import { IoLogoTwitter } from "react-icons/io";
import { FaArrowRightLong, FaFacebook } from "react-icons/fa6";
import { FaPinterestP } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { generalData, socialLinks } from 'src/lib/helper/dynamicData'
import i18next from 'i18next'
import { useTranslation } from 'react-i18next'
import { searchValueAtom, tokenAtom, userAtom, userNewMessageAtom } from 'src/lib/jotai'
// import {dynamicData} from 'src/lib/helper/dynamicData'
import { topBarData } from 'src/lib/helper/dynamicData'
import { FaHeadphonesAlt } from "react-icons/fa";
import { IoChatboxOutline } from 'react-icons/io5'
import HeaderLoader from './HeaderLoader'
import { TbBellRingingFilled } from 'react-icons/tb'


export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigate = useNavigate()
  const path = window.location.pathname;
  const user = JSON.parse(localStorage.getItem('user'))
  const token = JSON.parse(localStorage.getItem('token'))
  const setUserAtom = useSetAtom(userAtom)
  const setTokenAtom = useSetAtom(tokenAtom)
  const [userNewMessage, setUserNewMessage] = useAtom(userNewMessageAtom)

  // console.log(path)
  // const { isPending, data, isError, error } = useQuery({
  //   queryKey: ['header_count', user?._id],
  //   queryFn: async () => {
  //     const response = await axios.get(`${import.meta.env.VITE_API_PATH}/customer-orders/get-infos?${user?.type === 'customer' ? `userId=${user?._id}` : `shopId=${user?.vendor_info?.shop?._id}`}`, {
  //       headers: {
  //         Authorization: `Bearer ${token?.accessToken}`
  //       }
  //     })
  //     console.log(response.data.status)
  //     return response?.data?.info;
  //   }
  // })
  const [toggle, setTogggle] = useState(false)

  const { isPending, data, isError, error } = useQuery({
    queryKey: ['header_count', user?._id, toggle],
    queryFn: async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_PATH}/customer-orders/get-infos?${user?.type === 'customer' ? `userId=${user?._id}` : `shopId=${user?.vendor_info?.shop?._id}`}`, {
          headers: {
            Authorization: `Bearer ${token?.accessToken}`
          }
        });
        return response.data.info;
      } catch (error) {
        if (error.response && error.response.status === 401) {
          // Handle unauthorized access error
          // console.error('Unauthorized access');
          if (token.refreshToken) {
            const errorResponse = await axios.post(`${import.meta.env.VITE_API_PATH}/auth/login`, {
              "type": "refresh",
              "refreshToken": token.refreshToken
            });
            setTokenAtom({
              accessToken: errorResponse.data?.data?.user?.accessToken,
              refreshToken: errorResponse.data?.data?.user?.refreshToken
            })
            setUserAtom(errorResponse?.data?.data?.user);
            setTogggle(!toggle)
          }


        } else {
          // Handle other errors
          console.error('An error occurred:', error.message);
        }

      }
    }
  });
  // console.log(data, 'data')
  const [language, setLanguage] = useState(localStorage.getItem('lang') || 'en')
  const handleLanguageChange = (event) => {
    const newLanguage = event.target.value;
    setLanguage(newLanguage);
    localStorage.setItem('lang', newLanguage)
    i18next.changeLanguage(newLanguage); // For i18next or similar library
  };

  const location = useLocation()
  const { t } = useTranslation()
  const HeaderButtons = ({ text, link, icon }) => {
    return (
      <button
        onClick={() => {
          window.open(link, '_blank')
        }}
        className={text !== 'All Category' ? 'py-3 px-5 text-primary-color text-[13px] flex items-center justify-center gap-2 hover:bg-[#5F6C72] transition rounded-sm' :
          'bg-gray-100 transition rounded-sm gap-1 py-3 px-5 text-primary-color text-[13px] flex items-center justify-center font-semibold mr-1'
        }  >
        <img src={icon} alt="icon" className='w-[22px] h-[22px]' />
        <p>
          {text}
        </p>
        {/* for category button */}
        {
          text == 'All Category' &&
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M12.7659 6.24585L8.14616 10.8656L3.52637 6.24585" stroke="#364253" strokeWidth="1.38594" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        }
      </button>
    )
  }

  // upper part for social links
  const HeaderUpperPart = () => {
    return (
      <div className='hidden md:flex md:justify-between md:items-center md:mx-auto max-w-7xl text-primary-color px-3 py-2 text-[13px] font-main' >
        <p className='p-1.5'>
          {
            topBarData?.left?.map((button, index) =>
              <HeaderButtons key={index} text={button.name} link={button.link} icon={button.icon} />
            )
          }
        </p>
        {/* social media and language */}
        <div className='p-1.5 flex justify-between items-center'>

          <div className='flex justify-center items-center pr-2 border-r-2 border-r-gray-500'>
            {/* border-r-2 border-r-gray-500  */}
            <a dir='ltr' href={`tel:${topBarData?.right?.phone}`} className='mx-1.5 flex gap-1 text-primary-color items-center '>
              <FaHeadphonesAlt className='w-4 h-3 mb-[1px]' />
              <span >
                {topBarData?.right?.phone}
              </span>
            </a>
          </div>
          {/* last part */}
          <div className='flex justify-center items-center px-3'>
            {/* border-r-2 border-r-gray-500 */}
            {/* language dropwdown */}
            <select
              className='bg-header-background focus:outline-none cursor-pointer px-1'
              onChange={handleLanguageChange}
              value={language}
            >
              {
                ['en', 'ar'].map(item => (
                  <option
                    key={item}
                    value={item}
                  >
                    {
                      item === 'en' ? 'ENGLISH' : 'ARABIC'
                    }
                  </option>
                ))
              }
            </select>
          </div>

          {/* <div className='flex justify-center items-center px-3'>
            <select
              onChange={(e) => {
                console.log(e.target.value)
              }}
              className='bg-header-background focus:outline-none cursor-pointer px-1'>
              {
                // 'USD', 
                ['USD'].map((item, index) => {
                  return <option
                    key={index}
                    value={item}>
                    {
                      item
                    }
                  </option>
                })
              }
            </select>
          </div> */}
          {/* if in user home page */}
          {/* {
            (path == '/home' || path == '/') && <NavLink to='/signup?type=vendor' className='px-3 py-1.5'>
              Become a supplier
            </NavLink>
          } */}
          {/* {
            !user &&
            <NavLink to='/vendor-home' className='px-3 py-1.5'>
              {t('header.become_supplier')}
            </NavLink>
          } */}

        </div>
      </div>
    )
  }

  const [searchValue, setSearchValue] = useAtom(searchValueAtom);
  const [showSearchBar, setShowSearchBar] = useState(false)
  const [products, setProducts] = useState([])
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      const response = await axios.post(`${import.meta.env.VITE_API_PATH}/products/filter`, {

        ...(searchValue.length !== 0 && {
          name: {
            en: searchValue
          }
        })
      })
      setProducts(response.data.products)
    }, 1000)

    return () => clearTimeout(timeoutId)
  }, [searchValue])

  // console.log(products)
  const searchInputRef = useRef(null)
  const handleClearInput = () => {
    setSearchValue('');
    setShowSearchBar(false);
    searchInputRef.current.focus(); // Focus on the input after clearing
  };


  // main function
  return (
    <header className="bg-header-background" onClick={() => {
      if (showSearchBar == true) {
        setShowSearchBar(false)
      }
    }}>
      {/* upper part for social links */}
      <HeaderUpperPart />
      {/* help links and number */}
      {/* <DownHeader /> */}
      {/* main nav */}
      <nav className={`mx-auto flex max-w-7xl items-center ${user ? 'justify-between' : 'justify-center sm:justify-between'} py-6 md:px-4 font-main`} aria-label="Global">
        <div className="flex mr-6">
          <Link to={user?.type === 'vendor' && user?.is_approved == true ? `/vendor-page?name=${user?.vendor_info?.shop?.name.en}` : user?.type === 'vendor' ? '/vendor-home' : '/'} className="-m-1.5 p-1.5 flex gap-2">
            <span className="sr-only">{generalData?.name}</span>
            <div className='flex items-center gap-2 '>
              <img src={generalData?.logo ? generalData?.logo : icon} alt="logo" className='h-10 w-auto' />
              <img src={generalData?.textLogo ? generalData?.textLogo : textIcon} alt="sonbola" className={`h-10 w-32 ${generalData?.textLogo && 'object-contain'}`} />
            </div>
          </Link>
        </div>
        {/* search bar */}
        <div className='hidden md:block relative w-[100%] max-w-[700px] mx-3'>
          <input
            type="text"
            name="search"
            ref={searchInputRef}
            className='w-[100%] p-[10px] rounded-sm focus:outline-none'
            placeholder={t('header.search_placeholder')}
            autoComplete='off'
            value={searchValue}
            onChange={(e) => {
              setShowSearchBar(true)
              setSearchValue(e.target.value)
            }}
          />
          <img
            src={searchIcon} alt="search-icon"
            className={`w-[18px] h-[18px] absolute top-[13px] text-secondary-color ${language == 'ar' ? 'left-[14px]' : 'right-[14px]'}`}
          />
          {
            showSearchBar === true && <div className='absolute mt-1 bg-white w-full rounded-md z-20 border-[2px] border-slate-200'>
              {
                products?.length === 0 && <div
                  className='w-full py-3 border-b-[1px] px-4 flex justify-between cursor-pointer bg-red-100 transition'
                  onClick={handleClearInput}
                >
                  <p >No product available with this name, try something different</p>
                </div>
              }
              {
                products?.slice(0, 7)?.map((item) => {
                  return <div key={item._id}
                    className='bg-white w-full py-3 border-b-[1px] px-4 flex justify-between cursor-pointer hover:bg-slate-100 transition'
                    onClick={() => {
                      setSearchValue('')
                      setShowSearchBar(false)
                      navigate(`product/${item._id}`)
                    }}
                  >
                    <p>{item.name.en}</p>
                    <p>$ {item.price} </p>
                  </div>
                })
              }
            </div>
          }
        </div>

        <div className='flex'>
          {
            user?.type !== 'vendor' &&
            <div className={`hidden md:flex md:flex-1 md:justify-end gap-4 ${!user && 'me-3 mt-1'}`}>
              {/* cart */}
              <div onClick={() => {
                navigate('/cart')
              }}
                className="text-sm font-semibold leading-6 cursor-pointer relative">
                <img src={cartIcon} alt="cart-icon" className='min-w-[22px] min-h-[22px] mt-[2px]' />
                {
                  user && <p className='absolute top-0 -right-1 bg-white text-black rounded-full text-[10px] w-4 h-4 text-center flex justify-center items-center'>
                    {
                      isPending ? <HeaderLoader /> : data?.cart_count ? data?.cart_count : 0
                    }
                  </p>
                }
              </div>


              {/* wishlist */}
              <div onClick={() => {
                navigate('/wishlist')
              }}
                className="text-sm font-semibold leading-6 cursor-pointer relative"
              >
                {/* <img src={wishlistIcon} alt="wishlist-icon" className='min-w-[18px] min-h-[18px]' /> */}
                <CiHeart className='min-w-[28px] min-h-[26px] mt-[2px] text-primary-color font-bold' />
                {
                  user && <p className='absolute top-0 -right-1 bg-white text-black rounded-full text-[10px] w-4 h-4 text-center flex justify-center items-center'>
                    {
                      isPending ? <HeaderLoader /> : data?.wishlist_count ? data?.wishlist_count : 0
                    }
                  </p>
                }

              </div>

              {/* chat */}
              <div onClick={() => {
                navigate('/user-chats')
              }}
                className="text-sm font-semibold leading-6 cursor-pointer relative">
                {/* <img src={cartIcon} alt="user icon" className='min-w-[24px] min-h-[24px] mt-[2px]' /> */}
                <IoChatboxOutline className='min-w-[26px] min-h-[25px] mt-[2px] text-primary-color' />
                {
                  userNewMessage && <p className='absolute top-0 -right-1 bg-white text-tertiary-800 rounded-full text-[10px] w-4 h-4 text-center flex justify-center items-center'>
                    <TbBellRingingFilled className='ms-[1px]' />
                  </p>
                }
              </div>


            </div>
          }
          {/* profile */}
          {
            !user ?
              <button
                onClick={() => {
                  navigate('/signin')
                }}
                className='bg-buttons text-nowrap text-buttons-color text-[12px] font-[700] px-4 py-2 uppercase hidden md:flex items-center gap-2 transition hover:bg-tertiary-500'>
                {t('header.signin')}
              </button> :
              <div
                onClick={() => {
                  if (user.type == 'vendor') {
                    if (user.is_approved == true) {
                      navigate('/vendor-dashboard')
                    } else {
                      navigate('/vendor-await-verificaiton')
                    }
                  } else {
                    navigate('/profile')
                  }
                }}
                className="text-sm font-semibold cursor-pointer hidden md:block ms-2">
                <img src={userIcon} alt="user icon" className='w-[28px] h-[28px]' />
              </div>
          }

          {/* mobile burger */}
          {
            user && <div className="md:hidden ">
              <button
                type="button"
                className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                onClick={() => {
                  localStorage.clear();
                  navigate('/')
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="white" class="size-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
                </svg>
                <span className="sr-only">Logout</span>
              </button>
            </div>
          }

        </div>


      </nav>
      {/* search bar for mobile device */}
      <div className='px-4 pb-6'>
        <div className='sm:block md:hidden relative w-[100%] max-w-[700px]'>
          <input
            type="text"
            name="search"
            ref={searchInputRef}
            className='w-[100%] p-[10px] rounded-sm focus:outline-none'
            placeholder={t('header.search_placeholder')}
            autoComplete='off'
            value={searchValue}
            onChange={(e) => {
              setShowSearchBar(true)
              setSearchValue(e.target.value)
            }}
          />
          <img
            src={searchIcon} alt="search-icon"
            className={`w-[18px] h-[18px] absolute top-[13px] text-secondary-color ${language == 'ar' ? 'left-[14px]' : 'right-[14px]'}`}
          />
          {
            showSearchBar === true && <div className='absolute mt-1 bg-white w-full rounded-md z-20 border-[2px] border-slate-200'>
              {
                products?.length === 0 && <div
                  className='w-full py-3 border-b-[1px] px-4 flex justify-between cursor-pointer bg-red-100 transition'
                  onClick={handleClearInput}
                >
                  <p >No product available with this name, try something different</p>
                </div>
              }
              {
                products?.slice(0, 7)?.map((item) => {
                  return <div key={item._id}
                    className='bg-white w-full py-3 border-b-[1px] px-4 flex justify-between cursor-pointer hover:bg-slate-100 transition'
                    onClick={() => {
                      setSearchValue('')
                      setShowSearchBar(false)
                      navigate(`product/${item._id}`)
                    }}
                  >
                    <p>{item.name.en}</p>
                    <p>$ {item.price} </p>
                  </div>
                })
              }
            </div>
          }
        </div>
      </div>
      {/* mobile version */}
      <Dialog as="div" className="md:hidden font-main" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <div className="fixed inset-0 z-10" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto px-6 py-6 bg-header-background sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 p-1.5">
              {/* <span className="sr-only">Sonbola</span> */}
              <img
                className="h-8 w-auto"
                src={generalData.textLogo ? generalData.textLogo : textIcon}
                alt="logo"
              />
            </a>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-primary-color"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <HiXMark className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y text-primary-color">
              <div className="py-6 flex flex-col gap-2 " >
                <NavLink to={'/profile'} className="-mx-3 block rounded-sm px-3 py-2.5 text-base font-semibold leading-7 border-b-[2px]" onClick={() => setMobileMenuOpen(false)}>
                  {t('mobile_header.profile')}
                </NavLink>

                <NavLink to={'/wishlist'} className="-mx-3 block rounded-sm px-3 py-2.5 text-base font-semibold leading-7 border-b-[2px]" onClick={() => setMobileMenuOpen(false)}>
                  {t('mobile_header.wishlist')}
                </NavLink>

                <NavLink to={'/cart'} className={`-mx-3 block rounded-sm px-3 py-2.5 text-base font-semibold leading-7 border-b-[2px]`} onClick={() => setMobileMenuOpen(false)}>
                  {t('mobile_header.cart')}
                </NavLink>
                {/* <NavLink to={'/vendor-home'} className={`-mx-3 block rounded-sm px-3 py-2.5 text-base font-semibold leading-7 border-b-[2px]`} onClick={() => setMobileMenuOpen(false)}>
                  {t('mobile_header.become_supplier')}
                </NavLink> */}
                <div className={`-mx-3 rounded-sm px-3 py-2.5 text-base font-semibold leading-7 flex  justify-between border-b-[2px]`}>
                  {/* language dropwdown */}
                  <p>
                    {t('mobile_header.language')}
                  </p>
                  <select
                    className='bg-header-background focus:outline-none cursor-pointer px-1'
                    onChange={handleLanguageChange}
                    value={language}
                  >
                    {
                      ['en', 'ar'].map(item => (
                        <option
                          value={item}
                        >
                          {
                            item === 'en' ? 'ENGLISH' : 'ARABIC'
                          }
                        </option>
                      ))
                    }
                  </select>
                </div>
                {/* currency */}
                <div className={`-mx-3 rounded-sm px-3 py-2.5 text-base font-semibold leading-7 flex  justify-between ${!user && 'border-b-[2px]'}`}>
                  {/* language dropwdown */}
                  {/* <p>
                    {t('mobile_header.currency')}
                  </p> */}
                  {/* <select
                    onChange={(e) => {
                      console.log(e.target.value)
                    }}
                    className='bg-header-background focus:outline-none cursor-pointer px-1'>
                    {
                      // 'USD'
                      ['USD'].map((item, index) => {
                        return <option
                          key={index}
                          value={item}>
                          {
                            item
                          }
                        </option>
                      })
                    }
                  </select> */}
                </div>
                {
                  user ?
                    <div className='flex justify-center items-center w-[95%] absolute bottom-24 left-1/2 transform -translate-x-1/2 '>
                      <button
                        onClick={() => {
                          localStorage.clear();
                          setMobileMenuOpen(false)
                        }}
                        className='bg-buttons py-2 w-full rounded-sm text-buttons-color'
                      >
                        {t('mobile_header.logout')}
                      </button>
                    </div>
                    :
                    <>
                      {/* make this conditional depending on user state */}
                      <NavLink to='/signin' className="-mx-3 block rounded-sm px-3 py-2.5 text-base font-semibold leading-7 border-b-[2px]" onClick={() => setMobileMenuOpen(false)}>
                        {t('mobile_header.signin')}
                      </NavLink>

                      <NavLink to='/signup' className="-mx-3 block rounded-sm px-3 py-2.5 text-base font-semibold leading-7" onClick={() => setMobileMenuOpen(false)}>
                        {t('mobile_header.signup')}
                      </NavLink>
                    </>
                }

                <div className='absolute bottom-10 '>


                  <div className='flex justify-start items-center mt-4 gap-3'>
                    <span>{t('header.follow_us')}</span>
                    {
                      socialLinks?.map((media, index) => (
                        <div
                          onClick={() => {
                            window.open(media.link, '_blank')
                          }}
                          key={index}
                          className='cursor-pointer'
                        >
                          {
                            media.name.toLowerCase() == 'facebook' ? <FaFacebook className='w-[26px] h-[18px]' /> :
                              media.name.toLowerCase() == 'twitter' ? <IoLogoTwitter className='w-[24px] h-[18px]' /> :
                                media.name.toLowerCase() == 'youtube' ? <FaYoutube className='w-[18px] h-[18px]' /> : null
                          }
                        </div>
                      ))
                    }

                  </div>
                </div>



              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  )
}
