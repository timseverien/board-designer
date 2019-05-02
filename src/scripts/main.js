import { PerspectiveCamera, GLTFLoader, Scene, WebGLRenderer } from 'three-full';

const camera = new PerspectiveCamera(45, 1, 1, 1024);
const renderer = new WebGLRenderer({ antialias: true });
const scene = new Scene();

camera.position.set(0, 0, -512);
renderer.setSize(window.innerWidth, window.innerHeight);

new GLTFLoader().load('/assets/models/landyachtz-drop-hammer.glb', (gltf) => {
	console.log(gltf.scene);

	gltf.scene.scale.set(1 / 1000, 1 / 1000, 1 / 1000);

	scene.add(gltf.scene);
}, (xhr) => {
	console.log('progress', xhr.loaded / xhr.total);
}, (error) => {
	console.log('error', error);
});

document.body.appendChild(renderer.domElement);
renderer.render(scene, camera);
