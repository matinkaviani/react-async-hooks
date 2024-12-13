/** @type {import('jest').Config} */
const config = {
  verbose: true,
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "ts-jest",
  },
  testEnvironment: "jsdom",
  roots: ["<rootDir>/tests"],
  setupFilesAfterEnv: ["<rootDir>/tests/setupTests.ts"],
};

module.exports = config;
