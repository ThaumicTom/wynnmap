<script lang="ts">
	import { createMap } from './lib/MapInstance';

	import mainMapImage from './assets/maps/main-map.png';

	const mainMapData = {
		width: 4034,
		height: 6414,

		centerX: 2382,
		centerY: 6573,
	};

	// Set map instance
	const mapAction = (container: HTMLDivElement): { destroy: () => void } => {
		let map = createMap(container, mainMapImage, mainMapData);

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
