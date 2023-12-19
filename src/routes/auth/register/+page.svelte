<script>
    import { Button, Modal, Label, Input, Checkbox, Card } from 'flowbite-svelte';
    import { blur, fade } from 'svelte/transition';

    let customerImage = "../src/lib/assets/images/add-to-cart.svg"
</script>

<svelte:head>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Monoton&display=swap');
  </style>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
</svelte:head>
  
<body>
<div class="flex flex-col main-container min-h-[100%] h-[80vh] w-auto pt-[60px] pb-[100px] dark:bg-pdark-100 bg-zinc-100 lg:gap-5">
  <div class="title text-center text-black dark:text-white h-[10%] sm:text-2xl md:text-3xl lg:text-5xl pt-5 pb-5 pl-1 font-bold">REGISTRATION</div>
  <div class="flex flex-col align-middle w-[100%] h-[60%] items-center pt-8 gap-4">
    <Card href="/auth/register/customer" class=" customer-card bg-white hover:bg-orange-400 dark:hover:bg-orange-700 flex flex-row rounded-[40px] shadow w-[70%] max-w-[100%] h-[50%] justify-around items-center">
      <h1 class=" lg:text-[48px] md:text-[32px] sm:text-[24px] dark:text-white text-black text-center align-middle">Sign up as Customer</h1>
      <!-- <img src={customerImage} alt="" class=" w-[20%] h-auto overflow-hidden flex-grow-0"> -->
    </Card>
    <Card href="/auth/register/vendor" class=" bg-white hover:bg-orange-400 dark:hover:bg-orange-700 flex flex-row rounded-[40px] shadow w-[70%] max-w-[100%] h-[50%] justify-around items-center">
      <h1 class=" lg:text-[48px] md:text-[32px] sm:text-[24px] dark:text-white text-black text-center align-middle">Sign up as Vendor</h1>
      <!-- <img src={customerImage} alt="" class=" w-[20%] h-auto overflow-hidden"> -->
    </Card>
    <Card href="/auth/register/rider" class=" bg-white hover:bg-orange-400 dark:hover:bg-orange-700 flex flex-row rounded-[40px] shadow w-[70%] max-w-[100%] h-[50%] justify-around items-center">
      <h1 class=" lg:text-[48px] md:text-[32px] sm:text-[24px] dark:text-white text-black text-center align-middle">Sign up as Delivery Rider</h1>
      <!-- <img src={customerImage} alt="" class=" w-[20%] h-auto overflow-hidden"> -->
    </Card>
  </div>
</div>
</body>


<style>
  @media (max-width: 700px) {
    body{
      min-height: calc(100vh - 153px - 84px);
      height: calc(100vh - 153px - 84px);
    }
  }

</style>


