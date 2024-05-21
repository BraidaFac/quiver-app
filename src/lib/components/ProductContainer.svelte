<script lang="ts">
	import { gsrStore } from '$lib/stores/articles.store.js';
	import { createSearchStore, searchHandler, filterStore } from '$lib/stores/filter.js';
	import type { Article } from '$lib/utils/types.utils.js';
	import { onDestroy } from 'svelte';
	export let articulos: Article[];
	import { getModalStore, type ModalSettings } from '@skeletonlabs/skeleton';

	const modalStock: ModalSettings = {
		type: 'component',
		component: 'modalStock',
		meta: {}
	};
	const modalStore = getModalStore();

	let filter;
	//filter
	filterStore.subscribe((value) => {
		filter = value;
	});
	export const searchStore = createSearchStore(articulos);

	const unsubscribe = searchStore.subscribe((model: any) => searchHandler(model));

	onDestroy(() => {
		unsubscribe();
	});

	function addThousandSeparator(price: number) {
		return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
	}

	$: {
		if (filter.length > 0) {
			$searchStore.search = filter;
			$filterStore = filter;
		} else {
			$searchStore.search = undefined;
			$filterStore = '';
		}
	}

	function truncarACentena(numero) {
		return Math.round(numero / 100) * 100;
	}
	function orderProducts(products) {
		products.sort(function (a, b) {
			if (a.DESCRIPCIONGRUPOSUPERRUBRO > b.DESCRIPCIONGRUPOSUPERRUBRO) {
				return 1;
			}
			if (a.DESCRIPCIONGRUPOSUPERRUBRO < b.DESCRIPCIONGRUPOSUPERRUBRO) {
				return -1;
			}
			if (a.DESCRIPCIONSUPERRUBRO > b.DESCRIPCIONSUPERRUBRO) {
				return 1;
			}
			if (a.DESCRIPCIONSUPERRUBRO < b.DESCRIPCIONSUPERRUBRO) {
				return -1;
			}
			if (a.DESCRIPCIONRUBRO > b.DESCRIPCIONRUBRO) {
				return 1;
			}
			if (a.DESCRIPCIONRUBRO < b.DESCRIPCIONRUBRO) {
				return -1;
			}
			return 0;
		});

		return products;
	}
</script>

<div class="px-3 md:mx-auto md:w-1/2">
	<label class="mb-3 text-center text-lg" for="">Ingrese codigo o descripción del articulo</label>
	<input type="search" class="input" placeholder="Buscar" bind:value={filter} />
</div>
{#if $searchStore.filtered.length === 0 && filter.length === 0}
	<div class="mt-5 px-3">
		<p class="mb-4 text-center text-2xl">Sugerencias</p>
		<ul class="flex h-32 flex-col flex-wrap gap-1">
			{#each $gsrStore as gsr}
				<li class="text-center">
					<a
						href="/"
						on:click|preventDefault={() => {
							$filterStore = gsr.descripcion;
						}}>{gsr.descripcion}</a
					>
				</li>
			{/each}
		</ul>
	</div>
{/if}
<div class="table-container p-2 md:p-4">
	{#if $searchStore.filtered.length !== 0}
		<table class="table table-hover md:table-fixed">
			<thead>
				<tr>
					<th>Codigo</th>
					<th>Descripcion</th>
					<th>Marca</th>
					<th>Precio Efectivo</th>
					<th>Precio tarjeta</th>
					<th>Talles</th>
					<th>Rubro</th>
					<th>Stock</th>
				</tr>
			</thead>
			<tbody>
				{#each orderProducts($searchStore.filtered) as prod}
					<tr>
						<td>{prod.CODIGO_PRODUCTO}</td>
						<td>{prod.NOMBRE}</td>
						<td>{prod.DESCRIPCION_MARCA}</td>
						<td>${addThousandSeparator(truncarACentena(+prod.PRECIOEFECTIVO.toFixed(0)))}</td>
						<td>${addThousandSeparator(truncarACentena(+prod.PRECIOVENTA.toFixed(0)))}</td>
						<td>{prod.TALLES}</td>
						<td>{prod.DESCRIPCIONRUBRO}</td>
						<td
							><button
								class="variant-filled-warning btn h-6"
								on:click={() => {
									modalStock.meta = { prod };
									modalStore.trigger(modalStock);
								}}>Stock</button
							></td
						>
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}
</div>

<style>
	.table {
		width: 100%;
	}

	td:nth-child(4),
	td:nth-child(5) {
		font-weight: bold;
	}

	@media (min-width: 768px) {
		td:nth-child(1) {
			width: 30% !important;
			white-space: nowrap;
			overflow: auto;
			text-align: left;
		}
		td:nth-child(2) {
			width: 20% !important;
		}
		td:nth-child(3) {
			width: 20% !important;
		}
		td:nth-child(4) {
			width: 30% !important;
		}
	}
	@media (max-width: 768px) {
		.table thead tr {
			text-align: left;
		}
		.table tbody tr td {
			font-size: small !important;
		}
	}
</style>
