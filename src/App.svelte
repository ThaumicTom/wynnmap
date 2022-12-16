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

	let mapPosition: Vector3 = { x: 0, z: 0 },
		zoom: number = 0,
		mapHandlers: any,
		contextmenu: boolean = false;

	const showContextMenu = (show: boolean = true) => {
		contextmenu = show;
	};

	const tryHidingContextMenu = (event: Event) => {
		if (event.composedPath().includes(document.getElementById('contextmenu'))) return;
		showContextMenu(false);
	};

	const copyCoordinates = ({ x, z }: Vector3) => {
		navigator.clipboard.writeText(`${x} ${z}`);
		showContextMenu(false);
	};

	const centerView = ({ x, z }: Vector3) => {
		mapHandlers.setView(x, z);
		showContextMenu(false);
	};

	// Set map instance
	const mapAction = (container: HTMLDivElement): any => {
		let map = createMap(container, mainMapData);

		addWaypoints(map, ['./assets/data/places.yaml', './assets/data/provinces.yaml']);

		map.on('mousemove', (event) => {
			mapPosition.x = Math.round(event.latlng.lng);
			mapPosition.z = Math.round(event.latlng.lat);
		});

		let cursorPosition: Vector2 = { x: 0, y: 0 };

		map.on('contextmenu', (event) => {
			event.originalEvent.preventDefault();
			cursorPosition.x = event.containerPoint.x;
			cursorPosition.y = event.containerPoint.y;
			showContextMenu();
		});

		map.on('mousedown', () => {
			showContextMenu(false);
		});

		map.on('zoomstart', () => {
			showContextMenu(false);
		});

		map.on('zoomanim', (event) => {
			zoom = event.zoom;
		});

		mapHandlers = {
			zoomIn: () => {
				map.zoomIn();
			},
			zoomOut: () => {
				map.zoomOut();
			},
			getPosition: (): Vector3 => {
				return mapPosition;
			},
			getCursorPosition: (): Vector2 => {
				return cursorPosition;
			},
			setView: (x: number, z: number, zoom: number) => {
				map.setView([z, x], zoom);
			},
		};

		return {
			destroy: () => {
				map.remove();
				map = null;
			},
		};
	};

	// Icons
	import Dash from 'svelte-bootstrap-icons/lib/Dash.svelte';
	import Plus from 'svelte-bootstrap-icons/lib/Plus.svelte';
	import ContextMenu from './components/ContextMenu.svelte';
</script>

<main on:click={tryHidingContextMenu} aria-hidden="true">
	<div id="map" use:mapAction />
	<div class="zoom-control">
		<button
			on:click={mapHandlers.zoomIn}
			aria-hidden="true"
			class:disabled={zoom == mainMapData.maxZoom}><Plus /></button
		>
		<button
			on:click={mapHandlers.zoomOut}
			aria-hidden="true"
			class:disabled={zoom == mainMapData.minZoom}><Dash /></button
		>
	</div>
	<div class="position font-monospace">
		<div on:click={() => copyCoordinates(mapPosition)} aria-hidden="true" class="x">
			{mapPosition.x}
		</div>
		<div on:click={() => copyCoordinates(mapPosition)} aria-hidden="true" class="z">
			{mapPosition.z}
		</div>
	</div>
	{#if contextmenu}
		<ContextMenu
			mapPosition={mapHandlers.getPosition()}
			elementPosition={mapHandlers.getCursorPosition()}
			on:copyCoordinates={(event) => copyCoordinates(event.detail.mapPosition)}
			on:centerView={(event) => centerView(event.detail.mapPosition)}
			on:showContextMenu={(event) => showContextMenu(event.detail.show)}
		/>
	{/if}
</main>

<style>
	main,
	#map {
		width: 100%;
		height: 100%;
	}
</style>
