/*
 * @Descripttion:
 * @version:
 * @Author: Yanzengyong
 * @Date: 2020-09-15 18:07:31
 * @LastEditors: Yanzengyong
 * @LastEditTime: 2021-03-02 15:12:43
 */
/* config-overrides.js */
const path = require('path')
const rewirePostcss = require('react-app-rewire-postcss')
const px2rem = require('postcss-px2rem')
const { override, addWebpackAlias, useEslintRc, addDecoratorsLegacy, adjustStyleLoaders, addWebpackExternals } = require('customize-cra')
const IpConfig = require('./public/ipConfig')

module.exports = override(
	//路径别名
	addWebpackAlias({
		'@': path.resolve(__dirname, 'src'),
	}),
	// 添加全局变量
	addWebpackExternals({
		'IpConfig': JSON.stringify(IpConfig)
	}),
	// 不需要将eslint的报错抛到浏览器上，在控制台即可
	// useEslintRc(path.resolve(__dirname, './.eslintrc.js')),
	//添加装饰器
	addDecoratorsLegacy(),
	// 配置全局主题变量颜色
	adjustStyleLoaders(rule => {
    if (rule.test.toString().includes('scss')) {
      rule.use.push({
        loader: require.resolve('sass-resources-loader'),
        options: {
          resources: './src/themeStyle/index.scss'
        }
      });
    }
  }),
	(config, env) => {
		// 重写postcss
		rewirePostcss(config, {
			plugins: () => [
				require('postcss-flexbugs-fixes'),
				require('postcss-preset-env')({
					autoprefixer: {
						flexbox: 'no-2009',
					},
					stage: 3,
				}),
				//关键:设置px2rem
				// px2rem({
				// 	remUnit: 180,
				// 	exclude: /node-modules/,
				// }),
			],
		})
		return config
	}
)
