<script lang="ts">
	import { AppBar } from '@skeletonlabs/skeleton';
	import BurgerBar from './BurgerBar.svelte';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import SideMenu from './SideMenu.svelte';
	import { loadingStore, sideBarStatus } from '../stores/loadingStore.js';
	import { gsrStore } from '../stores/articles.store.js';
	import { filterStore } from '$lib/stores/filter.js';
	let user = $page.data.user;
	$: user = $page.data.user;
	const token = $page.data.token;

	let sr: { id: string; descripcion: string; gsr_id: string }[] = [];
	let gsr: { id: string; descripcion: string }[] = [];
	let rubros: any[] = [];
	loadingStore.set(true);

	onMount(async () => {
		const res = await fetch('https://casasonia.procomisp.com.ar/v5/rubros?limit=2000', {
			headers: {
				Authorization: `${token}`
			}
		});

		rubros = (await res.json()).data;
		rubros = rubros.filter((rubro) => {
			return (
				rubro.codigogruposuperrubro !== '001' &&
				rubro.codigogruposuperrubro !== '002' &&
				rubro.codigogruposuperrubro !== 'LB' &&
				rubro.codigogruposuperrubro !== 'LM' &&
				rubro.codigogruposuperrubro !== 'UN'
			);
		});
		rubros.sort((a, b) => {
			return a.descripcion.localeCompare(b.descripcion);
		});
		rubros.forEach((rubro) => {
			const existsInSr = sr.some((item) => item.id === rubro.codigosuperrubro);
			if (!existsInSr) {
				sr.push({
					id: rubro.codigosuperrubro,
					descripcion: rubro.superrubro.descripcion,
					gsr_id: rubro.codigogruposuperrubro
				});
			}
			const existsInGsr = gsr.some((item) => item.id === rubro.codigogruposuperrubro);
			if (!existsInGsr) {
				gsr.push({
					id: rubro.codigogruposuperrubro,
					descripcion: rubro.gruposuperrubro.descripcion
				});
			}
		});
		gsr.sort((a, b) => a.descripcion.localeCompare(b.descripcion));
		sr.sort((a, b) => a.descripcion.localeCompare(b.descripcion));
		gsrStore.set(gsr);
		loadingStore.set(false);
	});
</script>

<AppBar
	background="primary"
	gridColumns="grid-cols-3"
	slotDefault="place-self-center"
	slotTrail="place-content-end"
>
	<svelte:fragment slot="lead">
		{#if !$loadingStore}
			<div class="">
				<a
					class="h-10"
					href="/"
					on:click|preventDefault={() => {
						$sideBarStatus = !$sideBarStatus;
					}}
				>
					<div class="flex items-center">
						<span class="icon-[game-icons--hamburger-menu] w-10"></span><span>Menu</span>
					</div>
				</a>
				<SideMenu {gsr} {sr} {rubros}></SideMenu>
			</div>
		{/if}
	</svelte:fragment>
	<svelte:fragment slot="default"
		><a
			href="/"
			on:click={() => {
				$filterStore = '';
			}}><img class="logo" src="/QUIVER.svg" alt="logo" /></a
		></svelte:fragment
	>
	<svelte:fragment slot="trail">
		<BurgerBar {user} />
	</svelte:fragment>
</AppBar>

<style>
	.logo {
		width: 8em;
		height: 4em;
	}
</style>
