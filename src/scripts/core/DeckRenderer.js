import {
	DRACOLoader,
	GLTFLoader,
	DirectionalLight,
	PerspectiveCamera,
	Scene,
	WebGLRenderer,
	Mesh,
	CanvasTexture,
} from 'three-full';

import loadImage from '../loaders/image';

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
		const textureImage = await loadImage('/assets/images/landyachtz-drop-hammer-texture.png');

		const sunlight = new DirectionalLight(0xfff2ed, 2);
		sunlight.position.set(-0.25, -1, 0.5);
		this.scene.add(sunlight);

		this.deckCanvas = DeckRenderer.createDeckCanvas(textureImage);
		this.deckContext = this.deckCanvas.getContext('2d');
		this.deckTexture = new CanvasTexture(this.deckCanvas);

		// TODO: not hardcode the graphic width on texture
		this.graphicCanvas = DeckRenderer.createCanvas(447, textureImage.naturalHeight);
		this.graphicContext = this.graphicCanvas.getContext('2d');

		this.model = await DeckRenderer.loadModel(this.deckTexture, onProgressCallback);
		this.model.rotation.x = 0.5 * Math.PI;
		this.model.rotation.z = 0.95 * Math.PI;
		this.scene.add(this.model);
	}

	render() {
		this.model.rotation.z = Math.PI + Math.PI * Math.sin(Date.now() / 5000) / 16;
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
		this.graphicGenerator.generate(this.graphicContext);
		this.deckContext.drawImage(this.graphicCanvas, 0, 0);
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

	static loadModel(texture, onProgressCallback = null) {
		return new Promise((resolve, reject) => {
			const onLoadCallback = (gltf) => {
				const model = gltf.scene.children[0];

				model.traverse((node) => {
					if (!(node instanceof Mesh)) {
						return;
					}

					node.material.map = texture;
					node.material.needsUpdate = true;
				});

				resolve(model);
			};

			new GLTFLoader()
				.setDRACOLoader(new DRACOLoader())
				.load('/assets/models/landyachtz-drop-hammer.glb', onLoadCallback, onProgressCallback, reject);
		});
	}
}
