import DeckRenderer from '../core/DeckRenderer';
import DotGraphicGenerator from '../generators/DotGraphic';

function createAnimationLoop(callback) {
	function update() {
		requestAnimationFrame(update);
		callback();
	}

	requestAnimationFrame(update);
}

export default class DeckRendererComponent {
	constructor(element) {
		this.element = element;
		this.renderer = new DeckRenderer();
	}

	async create() {
		this.renderer.setGraphicGenerator(new DotGraphicGenerator());
		this.renderer.setSize(window.innerWidth, window.innerHeight);

		await this.renderer.load();

		this.element.appendChild(this.renderer.element);

		createAnimationLoop(() => this.renderer.render());

		setInterval(() => this.renderer.updateDeckDesign(), 1000);
	}
}
