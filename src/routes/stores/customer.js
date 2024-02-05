import { writable } from 'svelte/store';

// Initialize your store with default values
export const customerProfile = writable({
  customername:'',
  customerhp:'',
  customeraddressl1:'',
  customeraddressl2:'',
  customeraddresscity:'',
  customeraddressposcode:'',
  customeraddressstate:''
});

export const uploadingFile = writable(false);
