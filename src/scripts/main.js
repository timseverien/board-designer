import * as conditioner from 'conditioner-core/conditioner-core.esm';
import componentMap from './components';

import CanvasFactory from './factories/canvas';

CanvasFactory.setPixelRatio(window.devicePixelRatio);

conditioner.addPlugin({
	moduleGetName(element) {
		return element.dataset.component;
	},

	moduleImport(name) {
		if (!componentMap.has(name)) {
			throw new Error(`Component "${name}" does not exist`);
		}

		return Promise.resolve(componentMap.get(name));
	},

	moduleGetConstructor(Component) {
		return (...args) => {
			const instance = Reflect.construct(Component, args);

			instance.create();

			return instance;
		};
	},

	moduleGetDestructor(instance) {
		return () => {
			if (!Reflect.has(instance, 'destroy') || typeof Reflect.get(instance, 'destroy') !== 'function') {
				return;
			}

			instance.destroy();
		};
	},

	moduleSelector(context) {
		return context.querySelectorAll('[data-component]');
	},
});

conditioner.hydrate(document.documentElement);
