<script lang="ts">
	import { getModalStore, type ModalSettings } from '@skeletonlabs/skeleton';
	const modalStore = getModalStore();
	const article = $modalStore[0].meta.prod;

	// Base Classes
	const cBase = 'card w-full p-3 shadow-xl space-y-4 bg-gray-300';
	const cHeader = 'text-2xl font-bold text-center';
	const cDiv = 'p-4 space-y-4 p-2 rounded-container-token ';

	const stock = Object.entries(article.stocks);
	stock.forEach(([key, value], i) => {
		console.log('value', value);

		const stocks_deposito = value as [];
		const newArray = Array.from({ length: 17 }, (_, index) => {
			const lote = 38 + index * 2;
			const item = stocks_deposito.find((obj) => obj.LOTE === lote.toString());
			return item ? [lote, item.STOCKDISPONIBLE] : [lote, 0];
		});
		stock[i][1] = newArray;
	});
	console.log(stock);
</script>

<div class="modal-example-form overflow-y-auto {cBase}">
	<header class={cHeader}>
		Stock <span class="text-gray-800">{article.CODIGO_PRODUCTO}</span>
	</header>
	<section class={cDiv}>
		<table class="table-hover w-full border border-gray-700">
			<thead>
				<tr class="text-yellow-700">
					<th class="border border-gray-700">Deposito</th>
					{#each Array.from({ length: 17 }, (_, index) => index * 2 + 38) as talle}
						<th class="border border-gray-700 text-center">{talle}</th>
					{/each}
				</tr>
			</thead>
			<tbody class="">
				{#each stock as [deposito, items]}
					<tr>
						<td class="border border-gray-700 p-0 text-center text-gray-950">{deposito}</td>
						{#each items as stockItem}
							<td class="border border-gray-700 p-0 text-center text-gray-950">{stockItem[1]}</td>
						{/each}
					</tr>
				{/each}
				<!-- Añadir más filas según sea necesario -->
			</tbody>
		</table>
	</section>
	<div class="flex flex-row">
		<button
			class="variant-filled-warning btn"
			on:click={() => {
				modalStore.close();
			}}>Salir</button
		>
	</div>
</div>
