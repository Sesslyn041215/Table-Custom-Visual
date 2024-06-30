const path = require('path');

module.exports = {
  entry: './src/visual.tsx',  
  output: {
    path: path.resolve(__dirname, 'dist'), 
    filename: 'visual.js', 
    libraryTarget: 'umd',  
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'], 
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,  
        use: 'ts-loader', 
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,  
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.less$/, 
        use: ['style-loader', 'css-loader', 'less-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
    ],
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),  // Serve from 'dist' directory
    compress: true,
    port: 9000,  // Port for development server, adjust as needed
  },
};
