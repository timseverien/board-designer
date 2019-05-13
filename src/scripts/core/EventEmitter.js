export default class EventEmitter {
	constructor() {
		this.eventHandlerMap = new Map();
	}

	on(event, handler) {
		if (!this.eventHandlerMap.has(event)) {
			this.eventHandlerMap.set(event, []);
		}

		this.eventHandlerMap.get(event).push(handler);
	}

	trigger(event, ...args) {
		if (!this.eventHandlerMap.has(event)) {
			return;
		}

		this.eventHandlerMap.get(event)
			.forEach(fn => Reflect.apply(fn, undefined, args));
	}
}
