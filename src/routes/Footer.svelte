<script>
    import { Footer, FooterBrand, FooterCopyright, FooterIcon, FooterLink, FooterLinkGroup } from 'flowbite-svelte';
  </script>

<svelte:head>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Monoton&display=swap');
  </style>
</svelte:head>

<Footer footerType="logo" class=" rounded-none bg-gray-200 h-[100px] w-[100%] dark:bg-gray-900">
    <div class="sm:flex sm:items-center sm:justify-between">
      <FooterBrand href="/" name="Delisyok" class="logo" />
      <FooterLinkGroup ulClass="flex flex-wrap items-center mb-6 text-sm text-gray-500 sm:mb-0 dark:text-gray-400">
        <FooterLink href="/">About</FooterLink>
        <FooterLink href="/">Privacy Policy</FooterLink>
        <FooterLink href="/">Licensing</FooterLink>
        <FooterLink href="/">Contact</FooterLink>
      </FooterLinkGroup>
    </div>
  </Footer>

<style>
  .logo{
    font-family: 'Monoton', sans-serif;
    color: #F38C10;
    padding: 0px;
  }
</style>