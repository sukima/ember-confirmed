import Ember from 'ember';
import Confirmer from 'confirmer';

const { Component } = Ember;

export default Component.extend({
  actions: {
    showDialog() {
      new Confirmer(resolver => this.set('resolver', resolver))
        .onConfirmed(() => this.set('confirmed', true))
        .onCancelled(() => this.set('confirmed', false))
        .onDone(() => this.set('resolver', null));
    }
  }
});
