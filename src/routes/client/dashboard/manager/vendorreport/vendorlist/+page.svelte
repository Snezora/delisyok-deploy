
<script>
  let searchQuery = "";
</script>

<main>
  <h1>Welcome to the Vendor Sales Report Page</h1>
  <p>Search for vendors:</p>
  <input type="text" bind:value={searchQuery} placeholder="Vendor Name/Vendor ID" />
  <button on:click={() => console.log("Search clicked")}>Search</button>
</main>

<style>

  main {
    text-align: center;
    font-family: 'Inria Sans', sans-serif;
    padding: 20px;
  }

  h1 {
    font-size: 24px;
    font-family: 'Inria Sans', sans-serif;
    margin-bottom: 10px;
  }

  p {
    font-size: 16px;
    font-family: 'Inria Sans', sans-serif;
    margin-bottom: 5px;
  }

  input {
    padding: 5px;
    font-family: 'Inria Sans', sans-serif;
    margin-bottom: 30px;
  }

  button {
    padding: 5px 10px;
    background-color: #EF562F;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }





</style>
