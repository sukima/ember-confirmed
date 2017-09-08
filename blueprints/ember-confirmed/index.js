/* eslint-env node */
module.exports = {
  description: 'An Ember asynchronous confirmation addon',

  // locals(options) {
  //   // Return custom template variables here.
  //   return {
  //     foo: options.entity.options.foo
  //   };
  // }

  afterInstall() {
    return this.addPackageToProject('confirmed');
  }
};
