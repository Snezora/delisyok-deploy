import { writable } from 'svelte/store';

// Initialize your store with default values
export const vendorStore = writable({
  user_id: '',
  vendorid: '',
  vendoremail: '',
  businessname: '',
  storephoto: '',
  vendorkkmlistingno: '',
  businessstarttime: '',
  businessclosingtime: '',
  vendoraddressl1: '',
  vendoraddressl2: '',
  vendoraddresscity: '',
  vendoraddressposcode: '',
  vendoraddressstate: '',
  vendorhp: '',
  vendorpicname: '',
  businessopday: '',
  storedescription: '',
  openMonday: false,
  openTuesday: false,
  openWednesday: false,
  openThursday: false,
  openFriday: false,
  openSaturday: false,
  openSunday: false,
  storephotourl: ''
});

export const uploadingFile = writable(false);
