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

	const hideContextMenu = (event) => {
		if (event.composedPath().includes(document.getElementById('contextmenu'))) return;

		contextmenu = false;
	};

	let x: number = 0,
		z: number = 0,
		cursorX: number = 0,
		cursorY: number = 0,
		contextmenu: boolean = false;

	const copyCoordinates = () => {
		navigator.clipboard.writeText(`${x} ${z}`);

		contextmenu = false;
	};

	const showCoordinates = () => {
		return `${x}, ${z}`;
	};

	// Set map instance
	const mapAction = (container: HTMLDivElement): { destroy: () => void } => {
		let map = createMap(container, mainMapData);

		addWaypoints(map, ['./assets/data/places.yaml', './assets/data/provinces.yaml']);

		map.on('mousemove', (event) => {
			x = Math.round(event.latlng.lng);
			z = Math.round(event.latlng.lat);
		});

		map.on('contextmenu', (event) => {
			event.originalEvent.preventDefault();
			contextmenu = true;
			cursorX = event.containerPoint.x;
			cursorY = event.containerPoint.y;
		});

		map.on('mousedown', () => {
			contextmenu = false;
		});

		map.on('zoomstart', () => {
			contextmenu = false;
		});

		return {
			destroy: () => {
				map.remove();
				map = null;
			},
		};
	};
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<main on:click={hideContextMenu}>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div id="map" use:mapAction />
	<div class="position font-monospace">
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div on:click={copyCoordinates} class="x">{x}</div>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div on:click={copyCoordinates} class="z">{z}</div>
	</div>
	{#if contextmenu}
		<div id="contextmenu" style="top: {cursorY}px; left: {cursorX}px">
			<ul>
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<li on:click={copyCoordinates}>
					<div>
						{showCoordinates()}
					</div>
				</li>
			</ul>
		</div>
	{/if}
</main>

<style>
	#map {
		width: 100%;
		height: 100%;
	}

	main {
		width: 100%;
		height: 100%;
	}
</style>
