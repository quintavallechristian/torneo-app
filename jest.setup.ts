import '@testing-library/jest-dom';

import { TextEncoder, TextDecoder } from 'util';

Object.assign(global, { TextEncoder, TextDecoder });

// Polyfill for Request if not present
if (typeof global.Request === 'undefined') {
	// @ts-ignore
	global.Request = class Request {
		input: any;
		init?: any;
		constructor(input: any, init?: any) {
			this.input = input;
			this.init = init;
		}
	};
}
