<script lang="ts">
	import '../app.pcss';
	import { AppShell } from '@skeletonlabs/skeleton';
	import type { ModalComponent } from '@skeletonlabs/skeleton';
	import { Modal, getModalStore, initializeStores } from '@skeletonlabs/skeleton';
	import Nav from '../lib/components/Nav.svelte';
	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	import ModalStock from '$lib/components/ModalStock.svelte';
	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });
	initializeStores();
	import ModalCoef from '$lib/components/ModalCoef.svelte';

	const modalRegistry: Record<string, ModalComponent> = {
		modalStock: { ref: ModalStock },
		modalCoeficiente: { ref: ModalCoef }
	};
	const modalStore = getModalStore();
</script>

<Modal components={modalRegistry} />
<AppShell>
	<svelte:fragment slot="pageHeader">
		<Nav></Nav>
	</svelte:fragment>
	<slot />
</AppShell>
