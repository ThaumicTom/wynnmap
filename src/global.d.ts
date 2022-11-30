interface Vector2 {
	x: number;
	y: number;
}

interface MapData {
	imagePath: string;

	dimensions: Vector2;
	centerPosition: Vector2;
	initPosition: Vector2;

	initZoom: number;
	minZoom: number;
	maxZoom: number;
}
