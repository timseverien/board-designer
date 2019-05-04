import {
	DRACOLoader,
	GLTFLoader,
	DirectionalLight,
	PerspectiveCamera,
	Scene,
	WebGLRenderer,
	AmbientLight,
} from 'three-full';

export default class DeckRenderer {
	constructor() {
		this.camera = new PerspectiveCamera(60, 1, 1, 1024);
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
		const ambient = new AmbientLight(0xc9eeff, 0.2);
		this.scene.add(ambient);

		const sunlight = new DirectionalLight(0xfff2ed, 0.8);
		sunlight.position.set(-0.125, 1, 0.25);
		this.scene.add(sunlight);

		this.model = await DeckRenderer.loadModel(onProgressCallback);
		this.model.rotation.x = 0.5 * Math.PI;
		this.scene.add(this.model);
	}

	setSize(width, height) {
		this.camera.aspect = width / height;
		this.camera.updateProjectionMatrix();

		this.renderer.setSize(width, height);
	}

	render() {
		this.renderer.render(this.scene, this.camera);
		this.model.rotation.z = 2 * Math.PI * Date.now() / 12000;
	}

	static loadModel(onProgressCallback = null) {
		return new Promise((resolve, reject) => {
			const onLoadCallback = gltf => resolve(gltf.scene.children[0]);

			new GLTFLoader()
				.setDRACOLoader(new DRACOLoader())
				.load('/assets/models/landyachtz-drop-hammer.glb', onLoadCallback, onProgressCallback, reject);
		});
	}
}
