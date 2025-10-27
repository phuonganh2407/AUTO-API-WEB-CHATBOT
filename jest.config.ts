import type { Config } from '@jest/types';

process.env.DOTENV_CONFIG_SILENT = 'true';
process.env.DOTENV_CONFIG_QUIET = 'true';

const useAllure = !(process.env.NO_ALLURE === '1' || process.env.NO_ALLURE === 'true');

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',

  silent: false,
  verbose: false,

  globalSetup: './global.setup.ts',

  roots: ['<rootDir>/tests'],
  testMatch: ['**/tests/**/*.test.ts'],

  moduleFileExtensions: ['ts', 'js', 'json'],
  
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.json',
        // ⭐ Tăng tốc compile
        isolatedModules: true,
        // ⭐ Bỏ qua type checking khi chạy test
        diagnostics: false,
      },
    ],
  },

  reporters: useAllure
    ? [
        'default',
        [
          'jest-allure2-reporter',
          {
            resultsDir: './reports/allure-results',
          },
        ],
      ]
    : ['default'],

  transformIgnorePatterns: ['/node_modules/(?!@faker-js/faker)'],

  // Không dùng cache theo yêu cầu
  cache: false,
  
  // Giảm workers khi chạy single test
  maxWorkers: process.env.NO_ALLURE === '1' ? 1 : '50%',
  
  // Tắt coverage mặc định
  collectCoverage: false,
  
  // Tắt clear console
  clearMocks: true,
  
  // Timeout
  testTimeout: 10000,
};

export default config;