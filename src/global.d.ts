interface Vector2 {
	x: number;
	z: number;
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

interface LabelOptions {
	name: string;
	position: Vector2;

	filters?: string[];
}

interface ExtendedLabelOptions extends LabelOptions {
	[key: string]: any;
}
