import { writable } from 'svelte/store';

export const confirmed = writable({
    bag: false,
    fuel: false,
    battery: false
})
