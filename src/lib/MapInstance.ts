import * as L from 'leaflet';

// Extend CRS.Simple class to use image coordinates
let CRSPixel = L.Util.extend(L.CRS.Simple, {
	transformation: new L.Transformation(1, 0, 1, 0),
});

// Calculate the bounds of the image using data
const calculateBounds = (mapData: MapData) => {
	const corner1 = L.latLng({
		lat: -mapData.centerPosition.z,
		lng: -mapData.centerPosition.x,
	});

	const corner2 = L.latLng({
		lat: mapData.dimensions.z - mapData.centerPosition.z,
		lng: mapData.dimensions.x - mapData.centerPosition.x,
	});

	return L.latLngBounds(corner1, corner2);
};

export const createMap = (container: HTMLElement, mapData: MapData): L.Map => {
	const map = L.map(container, {
		crs: CRSPixel,
		minZoom: mapData.minZoom,
		maxZoom: mapData.maxZoom,
	});

	const imageOverlay = L.imageOverlay(mapData.imagePath, calculateBounds(mapData));

	imageOverlay.addTo(map);

	map.setView(
		L.latLng({
			lat: mapData.initPosition.z,
			lng: mapData.initPosition.x,
		}),
		mapData.initZoom
	);

	const mapContainer = map.getContainer();

	const zoomDivisor = Math.abs(mapData.maxZoom - mapData.minZoom);
	const zoomLevel = (mapData.initZoom - mapData.minZoom) / zoomDivisor;

	mapContainer.style.setProperty('--zoom-level', zoomLevel.toFixed(2).toString());

	map.on('zoomanim', (e) => {
		const zoomLevel = (e.zoom - mapData.minZoom) / zoomDivisor;

		mapContainer.style.setProperty('--zoom-level', zoomLevel.toFixed(2).toString());
	});

	return map;
};

const parsePosition = ({ x, z }): L.LatLng => {
	return L.latLng({
		lat: z,
		lng: x,
	});
};

export const addLabel = ({ name, position, filters }: LabelOptions) => {
	const classNames = filters.map((f) => f.toLowerCase());
	const parsedPosition = parsePosition(position);

	return addWaypoint(parsedPosition, {
		className: ['label', ...classNames].join(' '),
		html: `<span>${name}</span>`,
	});
};

const addWaypoint = (position: L.LatLng, iconOptions: L.DivIconOptions = {}) => {
	return L.marker(position, {
		icon: L.divIcon(iconOptions),
	});
};
