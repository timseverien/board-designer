import {
	DRACOLoader,
	GLTFLoader,
	DirectionalLight,
	PerspectiveCamera,
	Scene,
	WebGLRenderer,
	Mesh,
	CanvasTexture,
	Box3,
	Vector3,
} from 'three-full';

import loadModel from '../loaders/model';

export default class DeckRenderer {
	constructor() {
		this.camera = new PerspectiveCamera(45, 1, 1, 1024);
		this.deckTexture = null;
		this.graphicGenerator = null;
		this.renderer = new WebGLRenderer({ antialias: true });
		this.scene = new Scene();

		this.camera.position.set(0, 0, 128);
		this.renderer.setClearColor(0xcccccc);
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.gammaOutput = true;
		this.renderer.gammaFactor = 2.2;
		this.renderer.physicallyCorrectLights = true;
	}

	get element() {
		return this.renderer.domElement;
	}

	async load(onProgressCallback = null) {
		// const textureImage = await loadImage('/assets/images/landyachtz-drop-hammer-texture.png');

		const sunlight = new DirectionalLight(0xfff2ed, 2);
		sunlight.position.set(-0.25, -1, 0.5);
		this.scene.add(sunlight);

		const { data, model, texture } = await loadModel('landyachtz-drop-hammer', onProgressCallback);
		const aspect = data.width / data.height;

		this.deckCanvas = DeckRenderer.createDeckCanvas(texture);
		this.deckContext = this.deckCanvas.getContext('2d');
		this.deckTexture = new CanvasTexture(this.deckCanvas);

		DeckRenderer.modelSetTexture(model, this.deckTexture);

		this.model = model;
		this.model.rotation.x = 0.5 * Math.PI;
		this.model.rotation.z = 0.95 * Math.PI;
		this.scene.add(this.model);

		this.graphicCanvas = DeckRenderer.createCanvas(
			texture.naturalHeight * aspect,
			texture.naturalHeight,
		);

		this.graphicContext = this.graphicCanvas.getContext('2d');
	}

	render() {
		this.model.rotation.z = Math.PI + Math.PI * Math.sin(Date.now() / 1000) / 8;
		this.renderer.render(this.scene, this.camera);
	}

	setGraphicGenerator(graphicGenerator) {
		this.graphicGenerator = graphicGenerator;
	}

	setSize(width, height) {
		this.camera.aspect = width / height;
		this.camera.updateProjectionMatrix();

		this.renderer.setSize(width, height);
	}

	updateDeckDesign() {
		const { height } = this.deckCanvas;
		// TODO: not hardcode the graphic width on texture
		// TODO: Use model data
		const width = this.deckCanvas.height / 3.6571428571428571428571428571429;

		this.graphicGenerator.generate(this.graphicContext);

		this.deckContext.drawImage(this.graphicCanvas, 0, 0, width, height);
		this.deckTexture.needsUpdate = true;
	}

	static createCanvas(width, height) {
		const canvas = document.createElement('canvas');

		canvas.height = height;
		canvas.width = width;

		return canvas;
	}

	static createDeckCanvas(image) {
		const canvas = DeckRenderer.createCanvas(image.naturalWidth, image.naturalHeight);
		const context = canvas.getContext('2d');

		context.drawImage(image, 0, 0, canvas.width, canvas.height);

		return canvas;
	}

	static loadModel(modelName) {

	}

	static modelSetTexture(model, texture) {
		model.traverse((node) => {
			if (!(node instanceof Mesh)) {
				return;
			}

			node.material.map = texture;
			node.material.needsUpdate = true;
		});
	}
}
