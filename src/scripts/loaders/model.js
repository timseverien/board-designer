import {
	DRACOLoader,
	GLTFLoader,
	Box2,
	Vector2,
} from 'three-full';

import loadImage from './image';

const PATH_MODEL = '/assets/models';
const PATH_TEXTURE = '/assets/images';

function loadModel(modelName, onProgressCallback = null) {
	return new Promise((resolve, reject) => {
		const onLoadCallback = gltf => resolve(gltf.scene.children[0]);

		new GLTFLoader()
			.setDRACOLoader(new DRACOLoader())
			.load(`${PATH_MODEL}/${modelName}.glb`, onLoadCallback, onProgressCallback, reject);
	});
}

async function loadModelData(modelName) {
	const response = await fetch(`${PATH_MODEL}/${modelName}.json`);
	const data = await response.json();

	return new Box2(
		new Vector2(data.x, data.y),
		new Vector2(data.x + data.width, data.y + data.height),
	);
}

function loadTexture(modelName) {
	return loadImage(`${PATH_TEXTURE}/${modelName}-texture.png`);
}

export default async (modelName, onProgressCallback = null) => {
	const [
		model,
		region,
		texture,
	] = await Promise.all([
		loadModel(modelName, onProgressCallback),
		loadModelData(modelName),
		loadTexture(modelName),
	]);

	return { model, region, texture };
};
