// jest.setup.js
import '@testing-library/jest-dom';

// Polyfill TextEncoder/TextDecoder (react-router / WHATWG URLs en Node)
import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// mock matchMedia (Bootstrap / queries)
window.matchMedia = window.matchMedia || function () {
  return { matches: false, addListener: () => {}, removeListener: () => {} };
};

// Crypto (algunos libs piden webcrypto)
import { webcrypto } from 'crypto';
if (!global.crypto) global.crypto = webcrypto;

// Silenciar warnings de React Router si aparecen en tests
const originalError = console.error;
console.error = (...args) => {
  const msg = args[0] || '';
  if (typeof msg === 'string' && msg.includes('React Router Future Flags')) return;
  originalError(...args);
};
