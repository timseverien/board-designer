class CanvasFactory {
	constructor() {
		this.pixelRatio = 1;
	}

	create(width, height) {
		const canvas = document.createElement('canvas');

		canvas.height = this.pixelRatio * height;
		canvas.width = this.pixelRatio * width;

		return canvas;
	}

	createFromImage(image) {
		const canvas = this.create(image.naturalWidth, image.naturalHeight);
		const context = canvas.getContext('2d');

		context.drawImage(image, 0, 0, canvas.width, canvas.height);

		return canvas;
	}

	setPixelRatio(pixelRatio) {
		this.pixelRatio = pixelRatio;
	}
}

export default new CanvasFactory();
