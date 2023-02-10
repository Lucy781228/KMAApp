// SPDX-FileCopyrightText: Lucy Mills <ct040407@actvn.edu.vn>
// SPDX-License-Identifier: AGPL-3.0-or-later

// const { merge } = require('webpack-merge');
// const webpackConfig = require('@nextcloud/webpack-vue-config');

// module.exports = merge(webpackConfig, {
//   performance: {
//     hints: false,
//     maxEntrypointSize: 512000,
//     maxAssetSize: 512000,
//     assetFilter: function(assetFilename) {
//       return assetFilename.endsWith('.css') || assetFilename.endsWith('.js');
//     }
//   }
// });

const webpackConfig = require('@nextcloud/webpack-vue-config')

module.exports = webpackConfig