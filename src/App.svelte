<script lang="ts">
	import type { Map } from 'leaflet';
	import { createMap, addLabel } from './lib/MapInstance';

	import mainMapImage from './assets/maps/main-map.png';
	import yaml from 'js-yaml';

	const mainMapData = {
		imagePath: mainMapImage,

		dimensions: {
			x: 4034,
			z: 6414,
		},

		centerPosition: {
			x: 2382,
			z: 6573,
		},

		initPosition: {
			x: 0,
			z: -1750,
		},

		initZoom: 0,

		minZoom: -3,
		maxZoom: 3,
	};

	// : Promise<LabelOptions[]>
	const getYamlFile = async (path: string): Promise<any> => {
		const response = await fetch(path);
		const text = await response.text();

		const parsedText = yaml.load(text);

		return parsedText;
	};

	const addWaypoints = (map: Map, paths: string[]) => {
		paths.map((path) =>
			getYamlFile(path).then((waypoints: ExtendedLabelOptions[]) => {
				for (const waypoint of waypoints) {
					addLabel(waypoint).addTo(map);
				}
			})
		);
	};

	// Set map instance
	const mapAction = (container: HTMLDivElement): { destroy: () => void } => {
		let map = createMap(container, mainMapData);

		addWaypoints(map, ['./assets/data/places.yaml', './assets/data/provinces.yaml']);

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
