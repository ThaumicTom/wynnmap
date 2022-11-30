<script lang="ts">
	import { createMap } from './lib/MapInstance';

	// Set map instance
	const mapAction = (container: HTMLDivElement): { destroy: () => void } => {
		let map = createMap(container);

		return {
			destroy: () => {
				map.remove();
				map = null;
			},
		};
	};
</script>

<div id="map" use:mapAction />

<style>
	#map {
		width: 100%;
		height: 100%;
	}
</style>
