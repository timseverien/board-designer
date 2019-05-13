import DeckRenderer from '../core/DeckRenderer';
import DotGraphicGenerator from '../generators/DotGraphic';

function createAnimationLoop(callback) {
	let animationFrame;
	let frame = 0;

	function update() {
		animationFrame = requestAnimationFrame(update);

		if (frame % 60 === 0) {
			callback(frame++);
		}
	}

	return {
		start() {
			animationFrame = requestAnimationFrame(update);
		},
		stop() {
			cancelAnimationFrame(animationFrame);
		},
	};
}

export default class DeckRendererComponent {
	constructor(element) {
		this.element = element;
		this.renderer = new DeckRenderer();

		this.animationLoop = createAnimationLoop(() => this.renderer.render());
	}

	async create() {
		this.renderer.setGraphicGenerator(new DotGraphicGenerator());
		// this.renderer.setSize(0.25 * window.innerWidth, 0.25 * window.innerHeight);
		this.renderer.setSize(this.element.clientWidth, this.element.clientHeight);

		await this.renderer.load();

		this.element.appendChild(this.renderer.element);

		this.animationLoop.start();
		// setInterval(() => this.renderer.updateDeckDesign(), 1000);
	}

	destroy() {
		this.animationLoop.stop();

		this.renderer.destroy();
	}
}
