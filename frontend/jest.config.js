module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
  moduleNameMapper: {
    '^@/firebase-config$': '<rootDir>/__mocks__/firebase-config.js',  // Ensures firebase-config is mapped correctly
    '^@/(.*)$': '<rootDir>/src/$1',  // Maps all other @/ aliases
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy'  // Mocks CSS imports
  },
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
  }
};
