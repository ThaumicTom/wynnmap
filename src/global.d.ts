interface Vector2 {
	x: number;
	y: number;
}

interface Vector3 {
	x: number;
	y?: number;
	z: number;
}

interface MapData {
	imagePath: string;

	dimensions: Vector3;
	centerPosition: Vector3;
	initPosition: Vector3;

	initZoom: number;
	minZoom: number;
	maxZoom: number;
}

interface LabelOptions {
	name: string;
	position: Vector3;

	filters?: string[];
	level?: number;
}

interface ExtendedLabelOptions extends LabelOptions {
	[key: string]: any;
}
