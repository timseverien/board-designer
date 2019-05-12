import { CanvasTexture, Vector2 } from 'three-full';

import CanvasFactory from '../factories/canvas';

export default class DeckTextureModel {
	constructor(texture, graphicImageBox) {
		this.context = CanvasFactory
			.createFromImage(texture)
			.getContext('2d');

		this.graphicImageBox = graphicImageBox;
		this.graphicImageBoxSize = this.graphicImageBox
			.getSize(new Vector2())
			.multiply(new Vector2(this.context.canvas.width, this.context.canvas.height));

		this.texture = new CanvasTexture(this.context.canvas);
	}

	drawGraphicImage(image) {
		this.context.drawImage(
			image,
			this.graphicImageBox.min.x,
			this.graphicImageBox.min.y,
			this.graphicImageBoxSize.x,
			this.graphicImageBoxSize.y,
		);

		this.texture.needsUpdate = true;
	}
}
