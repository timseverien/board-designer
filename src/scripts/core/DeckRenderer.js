import {
	ACESFilmicToneMapping,
	BufferAttribute,
	BufferGeometry,
	DirectionalLight,
	HemisphereLight,
	Mesh,
	MeshBasicMaterial,
	MeshStandardMaterial,
	Object3D,
	PerspectiveCamera,
	ReinhardToneMapping,
	Scene,
	Vector2,
	Vector3,
	WebGLRenderer,
	PointsMaterial,
	Points,
} from 'three-full';

import loadModel from '../loaders/model';
import CanvasFactory from '../factories/canvas';
import DeckTextureModel from '../models/DeckTexture';
import MathUtils from './Math';

export default class DeckRenderer {
	constructor() {
		this.camera = new PerspectiveCamera(45, 1, 1, 1024);
		this.deckTexture = null;
		this.graphicContext = null;
		this.graphicGenerator = null;
		this.model = null;
		this.renderer = new WebGLRenderer({ alpha: true, antialias: true });
		this.scene = new Scene();

		this.camera.position.set(0, 0, 128);
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.physicallyCorrectLights = true;
		this.renderer.toneMapping = ACESFilmicToneMapping;
		this.renderer.toneMappingExposure = 3;

		const sunlight = new DirectionalLight(0xfff2ed, 1);
		sunlight.position.set(-1, 2, 3);
		sunlight.power = 1024;
		this.scene.add(sunlight);

		this.scene.add(new HemisphereLight(0x443333, 0x222233, 1));

		this.scene.add(DeckRenderer.createBackground());
	}

	get element() {
		return this.renderer.domElement;
	}

	async load(onProgressCallback = null) {
		const { model, region, texture } = await loadModel('landyachtz-drop-hammer', onProgressCallback);
		const regionSize = region.getSize(new Vector2());
		const aspect = regionSize.x / regionSize.y;

		this.deckTexture = new DeckTextureModel(texture, region);

		DeckRenderer.modelSetTexture(model, this.deckTexture.texture);

		this.model = model;
		this.model.rotation.x = 0.5 * Math.PI;
		this.model.rotation.z = Math.PI;
		this.scene.add(this.model);

		this.graphicContext = CanvasFactory
			.create(texture.naturalHeight * aspect, texture.naturalHeight)
			.getContext('2d');
	}

	render() {
		const t = Date.now() / 1000;
		const r = 128;
		const a = Math.PI * Math.sin(2 * Math.PI * t / 32) / 8;

		this.camera.position.x = r * Math.sin(a);
		this.camera.position.z = r * Math.cos(a);
		this.camera.lookAt(new Vector3());

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
		const material = new MeshStandardMaterial({
			color: 0xFFFFFF,
			map: texture,
			roughness: 0.25,
			metalness: 0,
		});

		model.traverse((node) => {
			if (!(node instanceof Mesh)) {
				return;
			}

			node.material.dispose();
			node.material = material;

			// node.material.map = texture;
			// node.material.needsUpdate = true;
		});
	}

	static createBackground() {
		const starList = DeckRenderer.createStarList();

		const background = new Object3D();
		const starsGeometry = new BufferGeometry();
		const starVertices = starList.reduce((vertices, star, index) => {
			vertices[3 * index + 0] = star.x;
			vertices[3 * index + 1] = star.y;
			vertices[3 * index + 2] = star.z;

			return vertices;
		}, new Float32Array(3 * starList.length));

		starsGeometry.addAttribute('position', new BufferAttribute(starVertices, 3));

		const mesh = new Points(starsGeometry, new PointsMaterial({
			color: 0x000000,
			size: 1.5,
		}));

		background.add(mesh);

		return background;
	}

	static createStarList() {
		const spread = Math.PI * 0.5;

		return Array.from({ length: 1024 }, () => {
			const a = Math.PI + MathUtils.lerp(spread, -spread, Math.random());
			const r = 256 + 512 * Math.random();

			return new Vector3(
				r * Math.sin(a),
				512 * (2 * Math.random() - 1),
				r * Math.cos(a),
			);
		});
	}
}
