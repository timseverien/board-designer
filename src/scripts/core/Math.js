export default {
	lerp(a, b, t) {
		return a + t * (b - a);
	},

	floorEvery(n, step) {
		return Math.floor(n / step) * step;
	},
};
