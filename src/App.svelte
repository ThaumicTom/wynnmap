<script lang="ts">
	import { createMap } from './lib/MapInstance';

	import mainMapImage from './assets/maps/main-map.png';

	const mainMapData = {
		imagePath: mainMapImage,

		dimensions: {
			x: 4034,
			y: 6414,
		},

		centerPosition: {
			x: 2382,
			y: 6573,
		},

		initPosition: {
			x: 0,
			y: -1750,
		},

		initZoom: 0,

		minZoom: -3,
		maxZoom: 3,
	};

	// Set map instance
	const mapAction = (container: HTMLDivElement): { destroy: () => void } => {
		let map = createMap(container, mainMapData);

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
