(function() {
  function vendorModule(RSVP) {
    'use strict';

    var confirmer = self['confirmer'];
    confirmer.default.Promise = RSVP.default.Promise;
    return confirmer;
  }

  define('confirmer', ['rsvp'], vendorModule);
})();
