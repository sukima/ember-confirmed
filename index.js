/* eslint-env node */
'use strict';
var path = require('path');
var Funnel = require('broccoli-funnel');
var MergeTrees = require('broccoli-merge-trees');

module.exports = {
  name: 'ember-confirmed',

  included() {
    this._super.included.apply(this, arguments);
    this.import('vendor/confirmer.js');
    this.import('vendor/shims/confirmer.js');
  },

  treeForVendor(vendorTree) {
    var confirmedPath = require.resolve('confirmed');

    if (path.basename(confirmedPath) === 'index.js') {
      confirmedPath = path.join(path.dirname(require.resolve('confirmed')), 'dist');
    } else {
      confirmedPath = path.dirname(require.resolve('confirmed'));
    }

    var confirmedTree = new Funnel(confirmedPath, { files: ['confirmer.js'] });

    return new MergeTrees([vendorTree, confirmedTree]);
  }
};
