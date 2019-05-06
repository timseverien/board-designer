const lerp = (a, b, t) => a + t * (b - a);

export default class DotGraphicGenerator {
	constructor() {
		this.backgroundColor = '#000';
		this.dotSizeMin = 1 / 256;
		this.dotSizeMax = 1 / 32;
	}

	// eslint-disable-next-line class-methods-use-this
	generate(context) {
		const { height, width } = context.canvas;
		const size = Math.min(width, height);

		context.fillStyle = this.backgroundColor;
		context.fillRect(0, 0, width, height);

		for (let i = 0; i < 1024; i++) {
			const x = lerp(0, width, Math.random());
			const y = lerp(0, height, Math.random());
			const radius = size * lerp(this.dotSizeMin, this.dotSizeMax, Math.random());

			context.fillStyle = `hsl(${360 * Math.random()}, 100%, 50%)`;

			context.beginPath();
			context.arc(x, y, radius, 0, 2 * Math.PI);
			context.fill();
		}
	}
}
