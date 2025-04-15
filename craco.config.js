module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.module.rules.push({
        test: /\.(mp4|webm|ogg|avi|mov|mkv)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[hash].[ext]',
            outputPath: 'videos/',
          },
        },
      });
      return webpackConfig;
    },
  },
};