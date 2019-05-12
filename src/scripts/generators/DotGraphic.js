import colors from 'nice-color-palettes';
import MathUtils from '../core/Math';

export default class DotGraphicGenerator {
	constructor() {
		this.backgroundColor = '#000';
		this.dotSizeMin = 1 / 256;
		this.dotSizeMax = 1 / 32;
	}

	// eslint-disable-next-line class-methods-use-this
	generate(context) {
		const { height, width } = context.canvas;
		const size = 2 * Math.min(width, height);
		const palette = colors[Math.floor(colors.length * Math.random())];

		context.fillStyle = palette.pop();
		context.fillRect(0, 0, width, height);

		for (let i = 0; i < 1024; i++) {
			const x = MathUtils.lerp(0, width, Math.random());
			const y = MathUtils.lerp(0, height, Math.random());
			const radius = size * MathUtils.lerp(this.dotSizeMin, this.dotSizeMax, Math.random());

			context.fillStyle = palette[Math.floor(palette.length * Math.random())];

			context.beginPath();
			context.arc(x, y, radius, 0, 2 * Math.PI);
			context.fill();
		}
	}
}
