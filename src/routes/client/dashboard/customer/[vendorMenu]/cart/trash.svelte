<script>
    import { Button, Modal } from 'flowbite-svelte';
    import {TrashBinSolid} from 'flowbite-svelte-icons';
    import { ExclamationCircleOutline } from 'flowbite-svelte-icons';
    /**
	 * @type {((e: MouseEvent) => void) | null | undefined}
	 */
     export let deleteOrderItem;
    let popupModal = false;
  </script>

<div>
  <Button on:click={() => (popupModal = true)}>
    <TrashBinSolid />
  </Button>
</div>

  <Modal bind:open={popupModal} size="xs" autoclose>
    <div class="text-center">
      <ExclamationCircleOutline class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" />
      <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Are you sure you want to delete this product?</h3>
      <Button color="red" class="me-2" on:click={deleteOrderItem}>Yes, I'm sure</Button>
      <Button color="alternative">No, cancel</Button>
    </div>
  </Modal>