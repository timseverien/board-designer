import { ImageLoader } from 'three-full';

export default (url, onProgressCallback = undefined) => new Promise((resolve, reject) => {
	new ImageLoader().load(url, resolve, onProgressCallback, reject);
});
