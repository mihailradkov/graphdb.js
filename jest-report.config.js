const {defaults} = require('jest-config');
const CONFIG = require('./jest.config');
const REPORT_DIR = 'coverage';

/*
 * Additional report configurations for Jest framework.
 * It enables coverage statistics and reporting.
 */
module.exports = Object.assign({

  collectCoverage: true,

  coverageDirectory: REPORT_DIR,

  coverageReporters: ['text', 'lcov'],

  reporters: ['default'],

  coveragePathIgnorePatterns: [...defaults.coveragePathIgnorePatterns, 'test/']

}, CONFIG);
