import { DefaultOptions } from '@jest/types/build/Config'

module.exports = {
  preset: 'ts-jest',
  collectCoverage: true,
  coverageDirectory: 'coverage',
  testEnvironment: 'node'
} as Partial<DefaultOptions>;
