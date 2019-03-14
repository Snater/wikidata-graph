class Vector {

	/**
	 * @param {number} x
	 * @param {number} y
	 * @return {number}
	 */
	static length({x, y}) {
		return Math.sqrt(x * x + y * y);
	}

	/**
	 * @param {number} x1
	 * @param {number} y1
	 * @param {number} x2
	 * @param {number} y2
	 * @return {Object}
	 */
	static sum({x: x1, y: y1}, {x: x2, y: y2}) {
		return {x: x1 + x2, y: y1 + y2};
	}

	/**
	 * @param {number} x1
	 * @param {number} y1
	 * @param {number} x2
	 * @param {number} y2
	 * @return {Object}
	 */
	static diff({x: x1, y: y1}, {x: x2, y: y2}) {
		return {x: x1 - x2, y: y1 - y2};
	}

	/**
	 *
	 * @param {number} x
	 * @param {number} y
	 * @param scalar
	 * @return {Object}
	 */
	static prod({x, y}, scalar) {
		return {x: x * scalar, y: y * scalar};
	}

	/**
	 * @param {Object} vector
	 * @param {number} scalar
	 * @return {Object}
	 */
	static scale(vector, scalar) {
		return Vector.prod(vector, (scalar / Vector.length(vector)));
	}
}

export default Vector;
