<script lang="ts">
	import { onMount } from 'svelte';
	import { filterStore } from '../stores/filter.js';
	import { sideBarStatus } from '../stores/loadingStore.js';
	type sr = {
		id: string;
		descripcion: string;
		gsr_id: string;
	};
	type gsr = {
		id: string;
		descripcion: string;
	};

	export let gsr: gsr[];
	export let sr: sr[];
	export let rubros: any[];
	let contentToShow: {
		contentType: 'gsr' | 'sr' | 'rubros';
		content: any[];
	} = {
		contentType: 'gsr',
		content: gsr
	};
	console.log();
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	class={`fixed  left-0 top-0 z-50 h-full w-full  transform rounded-md  bg-amber-950 shadow-md  transition-transform md:min-h-64 md:w-1/3 ${$sideBarStatus ? 'translate-x-0' : '-translate-x-full'} overflow-auto`}
>
	<div class="side-menu__header flex h-16 items-center justify-between p-3">
		<div>
			{#if contentToShow.contentType !== 'gsr'}
				<button
					on:click={() => {
						if (contentToShow.contentType === 'sr') {
							contentToShow.content = gsr;
							contentToShow.contentType = 'gsr';
						} else {
							contentToShow.content = sr.filter(
								(sr) => sr.gsr_id === contentToShow.content[0].codigogruposuperrubro
							);
							contentToShow.contentType = 'sr';
						}
					}}><span class="icon-[material-symbols--arrow-back-ios-new] h-6 w-6"></span></button
				>
			{/if}
		</div>
		<button
			on:click={() => {
				$sideBarStatus = false;
				contentToShow.contentType = 'gsr';
				contentToShow.content = gsr;
			}}><span class="icon-[ph--x-circle-fill] h-8 w-8"></span></button
		>
	</div>
	<div class="side-menu__body h-5/6 rounded-lg p-3 py-5">
		<div class="mb-3 flex items-center justify-stretch gap-3">
			<h3 class="side-menu__title text-2xl">
				{contentToShow.contentType === 'gsr'
					? 'CATEGORIAS'
					: contentToShow.contentType === 'sr'
						? `${gsr.find((gsr) => contentToShow.content[0].gsr_id === gsr.id)?.descripcion ?? 'CATEGORIA'}`
						: `${sr.find((sr) => contentToShow.content[0].codigosuperrubro === sr.id)?.descripcion ?? 'CATEGORIA'}`}
			</h3>
			{#if contentToShow.contentType !== 'gsr'}
				<button
					class="variant-outline-success btn btn-sm"
					on:click={() => {
						$filterStore =
							contentToShow.contentType === 'sr'
								? `${gsr.find((gsr) => contentToShow.content[0].gsr_id === gsr.id)?.descripcion ?? ''}`
								: `${sr.find((sr) => contentToShow.content[0].codigosuperrubro === sr.id)?.descripcion ?? ''}`;
						$sideBarStatus = false;
						contentToShow.content = gsr;
						contentToShow.contentType = 'gsr';
					}}>Ver todo</button
				>
			{/if}
		</div>
		<ul class="">
			{#each contentToShow.content as item}
				<li class="side-menu__item mb-1 mt-1">
					<a
						href="#{item.id}"
						on:click|preventDefault={() => {
							if (contentToShow.contentType === 'gsr') {
								contentToShow.content = sr.filter((sr) => sr.gsr_id === item.id);
								contentToShow.contentType = 'sr';
							} else if (contentToShow.contentType === 'sr') {
								contentToShow.content = rubros.filter(
									(rubro) => rubro.codigosuperrubro === item.id
								);
								contentToShow.contentType = 'rubros';
							} else if (contentToShow.contentType === 'rubros') {
								contentToShow.content = gsr;
								contentToShow.contentType = 'gsr';
								filterStore.set(item.descripcion);
								$sideBarStatus = false;
							} else {
								contentToShow.content = gsr;
								contentToShow.contentType = 'gsr';
							}
						}}
						class="side-menu__link text-gray-400">{item.descripcion}</a
					>
				</li>
			{/each}
		</ul>
	</div>
</div>
