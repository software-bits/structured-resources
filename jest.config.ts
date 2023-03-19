import type { Config } from 'jest';

const config: Config = {
  testEnvironment: "node",
  roots: [
    "<rootDir>/test",
    "<rootDir>/examples/cdk-stack/test",
    "<rootDir>/examples/smart-home/test",
  ],
  testMatch: ["**/*.test.ts"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  resetMocks: true,
  coveragePathIgnorePatterns: ["test", "examples"],
  collectCoverage: true,
};

export default config;