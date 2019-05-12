import {
	DirectionalLight,
	PerspectiveCamera,
	Scene,
	WebGLRenderer,
	Mesh,
	Vector2,
} from 'three-full';

import loadModel from '../loaders/model';
import CanvasFactory from '../factories/canvas';
import DeckTextureModel from '../models/DeckTexture';

export default class DeckRenderer {
	constructor() {
		this.camera = new PerspectiveCamera(45, 1, 1, 1024);
		this.deckTexture = null;
		this.graphicContext = null;
		this.graphicGenerator = null;
		this.model = null;
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
		const { model, region, texture } = await loadModel('landyachtz-drop-hammer', onProgressCallback);
		const regionSize = region.getSize(new Vector2());
		const aspect = regionSize.x / regionSize.y;

		const sunlight = new DirectionalLight(0xfff2ed, 2);
		sunlight.position.set(-0.25, -1, 0.5);
		this.scene.add(sunlight);

		this.deckTexture = new DeckTextureModel(texture, region);

		DeckRenderer.modelSetTexture(model, this.deckTexture.texture);

		this.model = model;
		this.model.rotation.x = 0.5 * Math.PI;
		this.model.rotation.z = 0.95 * Math.PI;
		this.scene.add(this.model);

		this.graphicContext = CanvasFactory
			.create(texture.naturalHeight * aspect, texture.naturalHeight)
			.getContext('2d');
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
		this.graphicGenerator.generate(this.graphicContext);
		this.deckTexture.drawGraphicImage(this.graphicContext.canvas);
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
