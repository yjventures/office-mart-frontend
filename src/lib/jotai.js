import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const userAtom = atomWithStorage('user', null);
export const vendorAtom = atomWithStorage('vendor', null);
export const tokenAtom = atomWithStorage('token', null);
export const authLoadingAtom = atom(false);
export const verifyEmailAtom = atomWithStorage('verifyEmail', null);
export const viewVendorAtom = atomWithStorage('viewVendor', null);
export const shopAtom = atomWithStorage('shop', null);
export const newProductAtom = atomWithStorage('newProduct', null);
export const cartItemsAtom = atomWithStorage('cartItems', []);
export const orderItemsAtom = atomWithStorage('orderItems', []);
export const shippingAndBillingAtom = atomWithStorage('shippingAndBillingAtom', {});
export const searchValueAtom = atom('')
export const openAdminSidebar = atom(true)
export const userDestinationCost = atom(0)
export const userDestinationVat = atom(0)
export const userNewMessageAtom = atom(false)
export const vendorNewMessageAtom = atom(false)
