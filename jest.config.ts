import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  
  // Global setup: chạy trước tất cả test để đảm bảo token hợp lệ
  globalSetup: './global.setup.ts',
  
  // Test files location
  roots: ['<rootDir>/tests'],
  testMatch: ["**/tests/**/*.test.ts"],
  
  // File extensions and transformations
  moduleFileExtensions: ['ts', 'js', 'json'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  
  // TypeScript configuration
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },

  // Test reports
  reporters: [
    "default",
    [
      "jest-allure2-reporter",
      {
        resultsDir: "./reports/allure-results",
      },
    ],
  ],

  // Import thư viện Faker trong jest
  transformIgnorePatterns: ["/node_modules/(?!@faker-js/faker)"],
};

export default config;