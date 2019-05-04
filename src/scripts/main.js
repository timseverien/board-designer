import DeckRenderer from './core/DeckRenderer';

function createAnimationLoop(callback) {
	function update() {
		requestAnimationFrame(update);
		callback();
	}

	requestAnimationFrame(update);
}

(async () => {
	const renderer = new DeckRenderer();

	renderer.setSize(window.innerWidth, window.innerHeight);

	await renderer.load();

	document.body.appendChild(renderer.element);

	createAnimationLoop(() => {
		renderer.render();
	});
})();
