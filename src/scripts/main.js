import DeckRenderer from './core/DeckRenderer';

function createAnimationLoop(callback) {
	function update() {
		requestAnimationFrame(update);
		callback();
	}

	requestAnimationFrame(update);
}

(async () => {
	const deckContext = document.createElement('canvas').getContext('2d');

	const renderer = new DeckRenderer(deckContext);

	renderer.setSize(0.5 * window.innerWidth, window.innerHeight);

	await renderer.load();

	document.body.appendChild(renderer.element);

	createAnimationLoop(() => {
		renderer.render();
	});

	setInterval(() => renderer.setDeckDesign(), 1000);
})();
