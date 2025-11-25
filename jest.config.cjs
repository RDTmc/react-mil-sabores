/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleFileExtensions: ['js', 'jsx', 'json'],
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  transformIgnorePatterns: [
  'node_modules/(?!react-icons|lucide-react)'
  ],
  moduleNameMapper: {
    // ✅ Corrige el regex para que Jest procese los estilos correctamente
    '^.+\\.(css|less|scss|sass)$': 'identity-obj-proxy',

    // ✅ Mock para archivos de imagen
    '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/test/__mocks__/fileMock.js',
  },
  testMatch: ['<rootDir>/src/**/*.test.(js|jsx)'],
  clearMocks: true,
};
