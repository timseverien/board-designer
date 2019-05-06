import {
	DRACOLoader,
	GLTFLoader,
	DirectionalLight,
	PerspectiveCamera,
	Scene,
	WebGLRenderer,
	AmbientLight,
	Mesh,
	CanvasTexture,
} from 'three-full';

import loadImage from '../loaders/image';

export default class DeckRenderer {
	constructor() {
		this.camera = new PerspectiveCamera(60, 1, 1, 1024);
		this.renderer = new WebGLRenderer({ antialias: true });
		this.scene = new Scene();

		this.camera.position.set(0, 0, 128);

		this.textureImage = null;

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

		const ambient = new AmbientLight(0xc9eeff, 0.2);
		this.scene.add(ambient);

		const sunlight = new DirectionalLight(0xfff2ed, 0.8);
		sunlight.position.set(-0.125, 1, 0.25);
		this.scene.add(sunlight);

		this.deckCanvas = DeckRenderer.createDeckCanvas(textureImage);
		this.deckContext = this.deckCanvas.getContext('2d');
		this.deckTexture = new CanvasTexture(this.deckCanvas);

		this.model = await DeckRenderer.loadModel(this.deckTexture, onProgressCallback);
		this.model.rotation.x = 0.5 * Math.PI;
		this.model.rotation.z = Math.PI;
		this.scene.add(this.model);
	}

	setDeckDesign() {
		this.deckContext.fillStyle = `hsl(${360 * Math.random()}, 100%, 50%)`;
		this.deckContext.fillRect(0, 0, 479, this.deckCanvas.height);
		this.deckTexture.needsUpdate = true;
	}

	setSize(width, height) {
		this.camera.aspect = width / height;
		this.camera.updateProjectionMatrix();

		this.renderer.setSize(width, height);
	}

	render() {
		this.renderer.render(this.scene, this.camera);
		this.model.rotation.y = 2 * Math.PI * Date.now() / 12000;
	}

	static createDeckCanvas(image) {
		const canvas = document.createElement('canvas');
		const context = canvas.getContext('2d');

		canvas.height = image.naturalHeight;
		canvas.width = image.naturalWidth;

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
