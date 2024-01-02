import { writable } from 'svelte/store';

export const user = writable(false);
export const usertype = writable({
    isVendor: false,
    isCustomer: false,
    isRider: false
})