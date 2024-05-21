<script lang="ts">
	import ProductContainer from '$lib/components/ProductContainer.svelte';
	import type { PageData } from './$types';
	export let data: PageData;
	import { onMount } from 'svelte';
	import { fetchWithPagination } from '$lib/utils/pagination.utils';
	import { ProgressRadial } from '@skeletonlabs/skeleton';
	import { initScanner } from '$lib/index';
	import * as SDCCore from 'scandit-web-datacapture-core';
	import { loadingStore } from '$lib/stores/loadingStore';
	import { filterStore } from '$lib/stores/filter';
	import { page } from '$app/stores';
	let { token, articulos } = data;
	$: {
		articulos = $page.data.articulos;
	}
	let loadingValue = 0;
	let loading = true;

	let showScanner = false;
	let view;
	let barcode;
	let result;
	let camera;
	let allresult;
	let flag: boolean = false;
	let interval;

	onMount(async () => {
		const response = await initScanner();
		if (response) {
			view = response.view;
			barcode = response.barcodeCapture;
			camera = response.camera;
		} else {
			alert('No se pudo inicializar el scanner');
		}
		const listener = {
			didScan: async (barcode, session) => {
				document.getElementById('data-capture-view').classList.add('hidden');
				const recognizedBarcodes = session.newlyRecognizedBarcodes;
				allresult = recognizedBarcodes;
				result = recognizedBarcodes[0]._data.match(/^\w+/)[0];
				filterStore.set(result);
				flag = !flag;
				//asynchronously turn off the camera as quickly as possible.
				await camera.switchToDesiredState(SDCCore.FrameSourceState.Standby);
				await camera.switchToDesiredState(SDCCore.FrameSourceState.Off);
				showScanner = false;
			}
		};
		barcode.addListener(listener);
		if (!articulos) {
			loading = true;
			loadingValue = 0;
			interval = setInterval(() => {
				loadingValue = loadingValue + 3;
			}, 500);
			articulos = await fetchWithPagination('productos', 1000, token);
			const res = await fetch('/api', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					articulos
				})
			});
			loading = false;
			clearInterval(interval);
			loadingValue = 0;
			if (res.status !== 200) {
				const error = await res.json();
				alert('No se pudo cargar los articulos, error:' + JSON.stringify(error));
			}
		} else {
			loading = false;
		}
	});
</script>

<div class="flex flex-col gap-10">
	<div class="mt-6 flex h-full flex-col justify-center p-3">
		<div class="fixed top-0 hidden" id="data-capture-view"></div>
		{#if showScanner && !loading}
			<button
				class="variant-filled-error btn fixed bottom-0 mx-auto my-3 w-full"
				on:click={async () => {
					await camera.switchToDesiredState(SDCCore.FrameSourceState.Off);
					document.getElementById('data-capture-view').classList.toggle('hidden');
					showScanner = !showScanner;
				}}><span class="icon-[mdi--camera-outline] text-4xl"></span>Dejar de scannear</button
			>
		{:else if !showScanner && !loading}
			<button
				class="variant-filled-warning btn top-20 mx-auto my-3 h-12 w-full"
				on:click={async () => {
					await camera.switchToDesiredState(SDCCore.FrameSourceState.On);
					showScanner = !showScanner;
					document.getElementById('data-capture-view').classList.toggle('hidden');
				}}><span class="icon-[mdi--camera-outline] text-4xl"></span>Scanee codigo de barras</button
			>
		{/if}
	</div>
	{#if articulos && !loading}
		{#key flag}
			<ProductContainer {articulos} />
		{/key}
	{:else}
		<p class="z-50 my-5 mb-4 animate-bounce text-center text-4xl">Cargando articulos</p>
		<div class=" z-40 w-full">
			<ProgressRadial
				value={loadingValue}
				class="mx-auto"
				stroke={20}
				meter="stroke-tertiary-500"
				track="stroke-tertiary-500/30"
			/>
		</div>
		<div class="absolute h-full w-full backdrop-blur-sm"></div>
	{/if}
</div>
