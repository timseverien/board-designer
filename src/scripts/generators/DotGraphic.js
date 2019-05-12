import colors from 'nice-color-palettes';
import MathUtils from '../core/Math';

export default class DotGraphicGenerator {
	constructor() {
		this.backgroundColor = '#000';
		this.dotCount = 512;
		this.gridCount = 8;
	}

	// eslint-disable-next-line class-methods-use-this
	generate(context) {
		const { height, width } = context.canvas;
		const palette = colors[Math.floor(colors.length * Math.random())];
		const gridSize = Math.min(width, height) / this.gridCount;

		const radiusMin = gridSize / 32;
		const radiusMax = gridSize / 3;

		const offset = 0.5 * gridSize;

		context.fillStyle = palette.pop();
		context.fillRect(0, 0, width, height);

		for (let i = 0; i < this.dotCount; i++) {
			const t = (this.dotCount - 1 - i) / (this.dotCount - 1);
			const x = offset + MathUtils.floorEvery(MathUtils.lerp(0, width, Math.random()), gridSize);
			const y = offset + MathUtils.floorEvery(MathUtils.lerp(0, height, Math.random()), gridSize);
			const radius = MathUtils.lerp(radiusMin, radiusMax, t);
			const radiusRounded = MathUtils.floorEvery(radius, radiusMin);

			context.fillStyle = palette[Math.floor(palette.length * Math.random())];

			context.beginPath();
			context.arc(x, y, radiusRounded, 0, 2 * Math.PI);
			context.fill();
		}
	}
}
