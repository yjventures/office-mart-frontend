import {
    createBrowserRouter,
} from "react-router-dom";
import Home from "../pages/Users/Home/Home";
import Signup from "../pages/Global/Signup/Signup";
import NotFound from "../pages/Global/NotFound/NotFound";
import UserLayout from "../layout/UserLayout";
import ResetPassword from "../pages/Global/Signup/ResetPassword";
import ForgetPassword from "../pages/Global/Signup/ForgetPassword";
import EmailVerification from "../pages/Global/Signup/EmailVerification";
import ProfileLayout from "../layout/ProfileLayout";
import Profile from "../pages/Users/Profile/Profile";
import EditProfile from "../pages/Users/EditProfile/EditProfile";
import Signin from "../pages/Global/Signup/Signin";
import Authenticate from "../pages/Global/Authenticate/Authenticate";
import VendorLayout from "../layout/VendorLayout";
import VendorStepTwo from "../pages/Vendor/VendorOnBoarding/VendorStepTwo";
import VendorStepOne from "../pages/Vendor/VendorOnBoarding/VendorStepOne";
import VendorDashboard from "../pages/Vendor/VendorDashboard/VendorDashboard";
import VendorProducts from "../pages/Vendor/VendorProducts/VendorProducts";
import VendorNewProduct from "../pages/Vendor/VendorNewProducts/VendorNewProduct";
import VendorOrders from "../pages/Vendor/VendorOrders/VendorOrders";
import VendorSettings from "../pages/Vendor/VendorSettings/VendorSettings";
import VendorAwaitVerification from "../pages/Vendor/VendorOnBoarding/VendorAwaitVerification";
import VendorEditProfile from "../pages/Vendor/VendorEditProfile/VendorEditProfile";
import VendorHome from "../pages/Vendor/VendorHome/VendorHome";
import AdminLayout from "../layout/AdminLayout";
import AdminDashboard from "../pages/Admin/AdminDashboard/AdminDashboard";
import ProductList from "../pages/Admin/ProductList/ProductList";
import ProductDetails from "../pages/Admin/ProductsDetails/ProductDetails";
import VendorList from "../pages/Admin/VendorList/VendorList";
import ApproveVendor from "../pages/Admin/ApproveVendor/ApproveVendor";
import ShopSettings from "../pages/Vendor/ShopSettings/ShopSettings";
import VendorInventory from "src/pages/Vendor/VendorInventory/VendorInventory";
import VendorVariations from "src/pages/Vendor/VendorVariations/VendorVariations";
import Products from "src/pages/Users/Product/Product";
import ProductCatalog from "src/pages/Users/ProductCatalog/ProductCatalog";
import Orders from "src/pages/Users/Orders/Orders";
import Wishlist from "src/pages/Users/Wishlist/Wishlist";
import Invoice from "src/pages/Vendor/Invoice/Invoice";
import OrderDetails from "src/pages/Vendor/OrderDetails/OrderDetails";
import Cart from "src/pages/Users/Cart/Cart";
import DeliveryInfo from "src/pages/Users/DeliveryInfo/DeliveryInfo";
import Payment from "src/pages/Users/Payment/Payment";
import PaymentSuccess from "src/pages/Users/PayemntSuccess/PaymentSuccess";
import TrackOrder from "src/pages/Users/TrackOrder/TrackOrder";
import VendorCustomOrder from "src/pages/Vendor/VendorCustomOrder/VendorCustomOrder";
import VendorAllReviews from "src/pages/Vendor/VendorAllReviews/VendorAllReviews";
import RefundSettings from "src/pages/Admin/RefundSetting/RefundSettings";
import CustomerList from "src/pages/Admin/CustomerList/CustomerList";
import OrderDetailsComponent from "src/components/Vendor/OrderDetails/OrderDetailsComponent";
import RefundList from "src/pages/Admin/RefundList/RefundList";
import Category from "src/pages/Admin/Category/Category";
import AllReview from "src/pages/Admin/AllReview/AllReview";
import SupportTicket from "src/pages/Users/SupportTicket/SupportTicket";
import SupportChat from "src/pages/Users/SupportChat/SupportChat";
import VendorChats from "src/pages/Vendor/VendorChats/VendorChats";
import VendorSingleChat from "src/pages/Vendor/VendorSingleChat/VendorSingleChat";
import UserChats from "src/pages/Users/UserChats/UserChats";
import UserSingleChat from "src/pages/Users/UserSingleChat/UserSingleChat";
import VendorPage from "src/pages/Vendor/VendorPage/VendorPage";
import Address from "src/pages/Users/Address/Address";
import PrivateRoute from "./PrivateRoute";
import AllOrdersList from "src/pages/Admin/AllOrdersList/AllOrdersList";
import ErrorPage from "src/pages/Global/ErrorPage/ErrorPage";
import UsersTermsCondition from "src/pages/Users/UsersTermsCondition/UsersTermsCondition";
import AdminSignin from "src/pages/Global/Signup/AdminSignin";
import VendorPreviousVariations from "src/pages/Vendor/VendorPreviousVariations/VendorPreviousVariations";
import SupportTicketList from "src/pages/Admin/SupportTicketList/SupportTicketList";
import SuperAdmin from "src/pages/Admin/SuperAdmin/SuperAdmin";
import FavouriteShops from "src/pages/Users/FavouriteShop/FavouriteShops";
import GuestTrackOrder from "src/pages/Users/GuestTrackOrder/GuestTrackOrder";


export const routes = createBrowserRouter([
    {
        path: "/",
        element: <UserLayout />,
        children: [
            {
                // extra children for showing error page in layout
                errorElement: <ErrorPage />,
                children: [
                    {
                        path: "/",
                        element: <Home />,
                    },
                    {
                        path: "/home",
                        element: <Home />
                    },
                    {
                        path: "/signup",
                        element: <Signup />
                    },
                    {
                        path: "/signin",
                        element: <Signin />,
                    },
                    {
                        path: "/admin-signin",
                        element: <AdminSignin />,
                    },
                    {
                        path: "/reset-password",
                        element: <ResetPassword />
                    },
                    {
                        path: "/forget-password",
                        element: <ForgetPassword />
                    },
                    {
                        path: "/email-verificaiton",
                        element: <EmailVerification />
                    },
                    {
                        path: "/vendor-step-one",
                        element: <VendorStepOne />
                    },
                    {
                        path: "/vendor-step-two",
                        element: <VendorStepTwo />
                    },
                    {
                        path: '/authenticate',
                        element: <Authenticate />
                    },
                    {
                        path: '/authenticate/:token',
                        element: <Authenticate />
                    },
                    {
                        path: "/vendor-await-verificaiton",
                        element: <VendorAwaitVerification />
                    },
                    {
                        path: "/product-catalogue",
                        element: <ProductCatalog />
                    },
                    {
                        path: "/product/:id",
                        element: <Products />
                    },
                    {
                        path: "/terms-and-condition",
                        element: <UsersTermsCondition />
                    },
                    {
                        path: "/cart",
                        // element: <PrivateRoute role="customer" ><Cart /> </PrivateRoute>
                        element: <Cart />
                    },
                    {
                        path: "/delivery",
                        element: <DeliveryInfo />
                    },
                    {
                        path: "/payment",
                        element: <Payment />
                    },
                    {
                        path: "/payment-success",
                        element: <PaymentSuccess />
                    },
                    {
                        path: "/guest-track-order/:id",
                        element: <GuestTrackOrder />
                    },
                    {
                        profile: '/profile',
                        element: <PrivateRoute role="customer" > <ProfileLayout /> </PrivateRoute>,
                        errorElement: <ErrorPage />,
                        children: [
                            {
                                path: "/orders",
                                element: <Orders />
                            },
                            {
                                path: "/track-order",
                                element: <TrackOrder />
                            },
                            {
                                path: "/wishlist",
                                element: <Wishlist />
                            },
                            {
                                path: "/favourite-shops",
                                element: <FavouriteShops />
                            },
                            {
                                path: "/support-tickets",
                                element: <SupportTicket />
                            },
                            // for first message from customer to vendor 
                            {
                                path: "/support-chat",
                                element: <SupportChat />
                            },
                            {
                                path: "/profile",
                                element: <Profile />
                            },
                            {
                                path: "/edit-profile",
                                element: <EditProfile />
                            },
                            {
                                path: "/user-chats",
                                element: <UserChats />
                            },
                            {
                                path: "/user-single-chat",
                                element: <UserSingleChat />
                            },
                            {
                                path: "/user-single-chat",
                                element: <UserSingleChat />
                            },
                            {
                                path: "/address",
                                element: <Address />
                            },

                        ]
                    },
                    {
                        profile: '/vendor-dashboard',
                        element: <PrivateRoute role="vendor" > <VendorLayout /> </PrivateRoute>,
                        children: [
                            {
                                path: "/vendor-dashboard",
                                element: <VendorDashboard />
                            },
                            {
                                path: "/vendor-edit-profile",
                                element: <VendorEditProfile />
                            },
                            {
                                path: "/vendor-products",
                                element: <VendorProducts />
                            },
                            {
                                path: "/new-product",
                                element: <VendorNewProduct />
                            },
                            {
                                path: "/vendor-orders",
                                element: <VendorOrders />
                            },
                            {
                                path: "/order-details/:id",
                                element: <OrderDetails />
                            },
                            {
                                path: "/custom-order",
                                element: <VendorCustomOrder />
                            },
                            {
                                path: "/invoice/:id",
                                element: <Invoice />
                            },
                            {
                                path: "/vendor-settings",
                                element: <VendorSettings />
                            },
                            {
                                path: "/shop-settings",
                                element: <ShopSettings />
                            },
                            {
                                path: "/vendor-inventory",
                                element: <VendorInventory />
                            },
                            {
                                path: "/vendor-variations",
                                element: <VendorVariations />
                            },
                            {
                                path: "/vendor-previous-variations",
                                element: <VendorPreviousVariations />
                            },
                            {
                                path: "/all-reviews/:id",
                                element: <VendorAllReviews />
                            },
                            {
                                path: "/vendor-chats",
                                element: <VendorChats />
                            },
                            {
                                path: "/vendor-single-chat",
                                element: <VendorSingleChat />
                            },
                            {
                                path: "/vendor-support-tickets",
                                element: <SupportTicket />
                            },


                        ]
                    },
                    {
                        path: "/vendor-home",
                        element: <VendorHome />
                    },
                    {
                        path: "/vendor-page",
                        element: <VendorPage />
                    },
                    {
                        path: "/vendor-signup",
                        element: <Signup />
                    },
                    {
                        path: "/vendor-signin",
                        element: <Signin />
                    },
                    {
                        path: "*",
                        element: <NotFound />
                    }
                ]
            }
        ]

    },
    {
        path: "/",
        element: <PrivateRoute role="admin" > <AdminLayout /></PrivateRoute>,
        children: [
            {
                errorElement: <ErrorPage />,
                children: [
                    {
                        path: "/admin-dashboard",
                        element: <AdminDashboard />
                    },
                    {
                        path: "/product-list",
                        element: <ProductList />
                    },
                    {
                        path: "/product-details/:id",
                        element: <ProductDetails />
                    },
                    {
                        path: "/vendor-list",
                        element: <VendorList />
                    },
                    {
                        path: "/pending-vendor-list",
                        element: <VendorList />
                    },
                    {
                        path: "/approved-vendor-list",
                        element: <VendorList />
                    },
                    {
                        path: "/rejected-vendor-list",
                        element: <VendorList />
                    },
                    {
                        path: "/approve-vendor",
                        element: <ApproveVendor />
                    },
                    {
                        path: "/refund-settings",
                        element: <RefundSettings />
                    },
                    {
                        path: "/refund-list",
                        element: <RefundList />
                    },
                    {
                        path: "/customer-list",
                        element: <CustomerList />
                    },
                    {
                        path: "/varified-customer-list",
                        element: <CustomerList />
                    },
                    {
                        path: "/unvarified-customer-list",
                        element: <CustomerList />
                    },
                    // {
                    //     path: "/all-orders",
                    //     element: <AllOrders />
                    // },
                    {
                        path: "/all-orders-list",
                        element: <AllOrdersList />
                    },
                    {
                        path: "/pending-orders-list",
                        element: <AllOrdersList />
                    },
                    {
                        path: "/processing-orders-list",
                        element: <AllOrdersList />
                    },
                    {
                        path: "/shipped-order-list",
                        element: <AllOrdersList />
                    },
                    {
                        path: "/delivered-ordered-list",
                        element: <AllOrdersList />
                    },
                    {
                        path: "/admin-order-details/:id",
                        element: <OrderDetailsComponent />
                    },
                    {
                        path: "/category",
                        element: <Category />
                    },
                    {
                        path: "/all-review",
                        element: <AllReview />
                    },
                    {
                        path: "/support-ticket-list",
                        element: <SupportTicketList />
                    },
                    {
                        path: "/super-admin-capability",
                        element: <SuperAdmin />
                    },
                ]
            }

        ]

    },

])