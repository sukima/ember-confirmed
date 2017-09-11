/* eslint-env node */
module.exports = {
  description: 'An Ember asynchronous confirmation addon',

  normalizeEntityName: function () {},

  afterInstall() {
    return this.addPackageToProject('confirmed');
  }
};
