import * as L from 'leaflet';

// Extend CRS.Simple class to use image coordinates
let CRSPixel = L.Util.extend(L.CRS.Simple, {
	transformation: new L.Transformation(1, 0, 1, 0),
});

// Calculate the bounds of the image using data
const calculateBounds = (mapData: MapData) => {
	const corner1 = L.latLng({
		lat: -mapData.centerPosition.y,
		lng: -mapData.centerPosition.x,
	});

	const corner2 = L.latLng({
		lat: mapData.dimensions.y - mapData.centerPosition.y,
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
			lat: mapData.initPosition.y,
			lng: mapData.initPosition.x,
		}),
		mapData.initZoom
	);

	return map;
};
