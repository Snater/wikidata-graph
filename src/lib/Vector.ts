interface Point {
	x: number
	y: number
}

export default class Vector {

	static size({x, y}: Point) {
		return Math.sqrt(x * x + y * y);
	}

	static sum({x: x1, y: y1}: Point, {x: x2, y: y2}: Point) {
		return {x: x1 + x2, y: y1 + y2};
	}

	static diff({x: x1, y: y1}: Point, {x: x2, y: y2}: Point) {
		return {x: x1 - x2, y: y1 - y2};
	}

	static prod({x, y}: Point, scalar: number) {
		return {x: x * scalar, y: y * scalar};
	}

	static scale(point: Point, scalar: number) {
		return Vector.prod(point, (scalar / Vector.size(point)));
	}
}