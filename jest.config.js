module.exports = {
    preset: 'ts-jest',
    collectCoverage: true,
    coverageDirectory: 'coverage',
    testEnvironment: 'node',
    watchPlugins: [
      "jest-watch-typeahead/filename",
      "jest-watch-typeahead/testname"
    ]
};
