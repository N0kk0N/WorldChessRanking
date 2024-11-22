// import adapter from '@sveltejs/adapter-auto';

// /** @type {import('@sveltejs/kit').Config} */
// const config = {
// 	kit: {
// 		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
// 		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
// 		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
// 		adapter: adapter({
// 			runtime: 'nodejs18.x'
// 		})
// 	}
// };

// export default config;

import adapterVercel from '@sveltejs/adapter-vercel';
import adapterAuto from '@sveltejs/adapter-auto';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		// Hier kun je de gewenste adapter kiezen
		adapter: adapterVercel() // Vervang dit door adapterAuto() als je de auto-adapter wilt gebruiken
	}
};

export default config;

