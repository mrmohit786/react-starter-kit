const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const Dotenv = require('dotenv-webpack');

const isProduction = process.env.NODE_ENV === 'production';

const config = {
	entry: './src/index.jsx',
	output: {
		clean: true,
		assetModuleFilename: '[name][ext]',
		path: path.resolve(__dirname, 'build'),
		publicPath: '/',
		filename: '[name].[chunkhash].bundle.js',
		chunkFilename: '[name].[chunkhash].bundle.js',
	},
	target: 'web',

	// Do not generate source-map in production build
	devtool: !isProduction && 'source-map',

	// Running dev server
	devServer: {
		open: true,
		port: '3000',
		host: 'localhost',
		static: {
			directory: path.join(__dirname, 'public'),
		},
		hot: true,
		liveReload: true,
		https: false,
		headers: { 'Access-Control-Allow-Origin': '*' },
	},
	resolve: {
		extensions: ['.js', '.jsx', '.json'],
		modules: [path.join(__dirname, 'src'), 'node_modules'],
		alias: {
			utils: path.resolve(__dirname, 'src/utils/'),
			components: path.resolve(__dirname, 'src/components/'),
		},
	},
	plugins: [
		// Shows the progress of the build
		// https://webpack.js.org/plugins/progress-plugin/
		new webpack.ProgressPlugin(),

		// https://webpack.js.org/plugins/html-webpack-plugin/
		new HtmlWebpackPlugin({
			template: path.join(__dirname, 'public', 'index.html'),
		}),

		// Extracts CSS into separate files. It creates a CSS file per JS file which contains CSS
		// https://webpack.js.org/plugins/mini-css-extract-plugin/
		new MiniCssExtractPlugin(),

		// Load our environment configuration
		new Dotenv(),
	],
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/i,
				exclude: /node_modules/,
				use: ['babel-loader'],
			},
			{
				test: /\.(css|scss)$/,
				exclude: /node_modules/,
				use: [
					'style-loader',
					{
						loader: MiniCssExtractPlugin.loader,
						options: {
							esModule: false,
						},
					},
					'css-loader',
					'sass-loader',
				],
			},
			{
				test: /\.(woff|woff2|eot|ttf|svg|jpg|png)$/,
				exclude: /node_modules/,
				use: {
					loader: 'url-loader',
				},
			},
			{
				test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
				exclude: /node_modules/,
				type: 'asset',
			},
		],
	},
	optimization: {
		splitChunks: {
			cacheGroups: {
				styles: {
					name: 'styles',
					type: 'css/mini-extract',
					chunks: 'all',
					enforce: true,
				},
			},
		},
	},
};
module.exports = () => {
	if (isProduction) {
		config.mode = 'production';
	} else {
		config.mode = 'development';
	}
	return config;
};
