import { writable } from 'svelte/store';

// Initialize your store with default values
export const customerProfile = writable({
  customername:'',
  customerhp:'',
});

export const uploadingFile = writable(false);
