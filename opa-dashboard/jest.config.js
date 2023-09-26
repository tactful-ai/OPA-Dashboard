module.exports = {
  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
  testPathIgnorePatterns: ['/node_modules/', './tests/unit/example.spec.ts'],
  transform: {
    '^.+\\.tsx?$': 'babel-jest'
  }
}
