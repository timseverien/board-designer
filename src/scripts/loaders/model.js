import {
	DRACOLoader,
	GLTFLoader,
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

	return response.json();
}

function loadTexture(modelName) {
	return loadImage(`${PATH_TEXTURE}/${modelName}-texture.png`);
}

export default async (modelName, onProgressCallback = null) => {
	const [
		data,
		model,
		texture,
	] = await Promise.all([
		loadModelData(modelName),
		loadModel(modelName, onProgressCallback),
		loadTexture(modelName),
	]);

	return { data, model, texture };
};
