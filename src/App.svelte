<script lang="ts">
	import * as L from 'leaflet';

	// Map data
	import mapImage from './assets/maps/main-map.png';

	const mainMapData = {
		width: 4034,
		height: 6414,

		centerX: 2382,
		centerY: 6573,
	};

	// Extend CRS.Simple class to use image coordinates
	let CRSPixel = L.Util.extend(L.CRS.Simple, {
		transformation: new L.Transformation(1, 0, 1, 0),
	});

	// Calculate the bounds of the image using data
	const calculateBounds = (mapData) => {
		const corner1 = L.latLng({
			lat: -mapData.centerY,
			lng: -mapData.centerX,
		});

		const corner2 = L.latLng({
			lat: mapData.height - mapData.centerY,
			lng: mapData.width - mapData.centerX,
		});

		return L.latLngBounds(corner1, corner2);
	};

	// Create the map on container element
	const createMap = (container: HTMLElement): L.Map => {
		const map = L.map(container, {
			crs: CRSPixel,
			minZoom: -3,
		});

		const image = L.imageOverlay(mapImage, calculateBounds(mainMapData));

		image.addTo(map);

		map.setView([-1750, 0]);

		return map;
	};

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
