<script>

  import { goto } from '$app/navigation';

function goToVendorReport() {
  goto('/client/dashboard/manager/vendorreport/vendorlist');
}
function goToDeliveryReport() {
  goto('/client/dashboard/manager/deliveryreport/riderlist');
}
function goToRefund() {
  goto('/client/dashboard/manager/refund');
}
function goToCustomerReport() {
  goto('/client/dashboard/manager/customerreport/customerlist');
}

</script>
  
<div class="page-container min-h-[100vh] overflow-x-hidden bg-white dark:bg-stone-500">
  <div class="header h-30 bg-gray-900">  
    <div class="dashboard">
      <div class="text-white mt-6">
          <h1>Welcome back, System Manager</h1><!--add system manager name-->
      </div>

      <div class="text-white mb-8">
          <h1>What would you like to do today?</h1>
      </div>
    </div>  
  </div>

  <div class= "buttons mt-12">
    <button on:click={goToVendorReport}>View Vendor Sales Report</button>
    <button on:click={goToDeliveryReport}>View Delivery Report</button>
    <button on:click={goToRefund}>Refund Undelivered/Rejected Order</button>
    <button on:click={goToCustomerReport}>View Customer Order History</button>
  </div>

</div>
      
<style>
  .dashboard {
    font-size: 30px;
    font-family: 'Molengo', sans-serif;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 3rem;
  }

  .buttons {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
  }
    
  button {
    padding: 30px 50px;
    font-size: 20px;
    font-family: 'Inria Sans', sans-serif;
    background-color: #EF562F;
    border-radius: 10px; 
    border: none;
    color: white;
    cursor: pointer;
  }
</style>
    