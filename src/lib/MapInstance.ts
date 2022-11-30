import * as L from 'leaflet';

interface MapData {
	width: number;
	height: number;
	centerX: number;
	centerY: number;
}

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

export const createMap = (container: HTMLElement, image: string, mapData: MapData): L.Map => {
	const map = L.map(container, {
		crs: CRSPixel,
		minZoom: -3,
	});

	const imageOverlay = L.imageOverlay(image, calculateBounds(mapData));

	imageOverlay.addTo(map);

	map.setView([-1750, 0], 0);

	return map;
};
