<script>
	export let data;
</script>

<h1>
	{ #each data.menuitem as menuitem (menuitem.itemid) }
		<img src={menuitem.itemimage} alt={menuitem.itemname} class=" h-20 w-auto"/>
		{menuitem.itemname}
		<br />
		Price: {menuitem.itemprice}
		<br />
		<br />
	{/each}
</h1>
