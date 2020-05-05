module.exports = {
  presets: [
    '@babel/preset-env',
    '@babel/preset-typescript',
    'jest',
  ],
  plugins: [
    [
      '@babel/plugin-proposal-pipeline-operator',
      {
        proposal: 'minimal',
      },
    ],
  ],
};
