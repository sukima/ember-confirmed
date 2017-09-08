import Ember from 'ember';
import Confirmer from 'confirmer';

const DIALOG_AUTO_CLOSE_DELAY = 5000;

export default Ember.Component.extend({
  actions: {
    showDialog() {
      new Confirmer(resolver => {
        Ember.run.later(resolver.cancel, DIALOG_AUTO_CLOSE_DELAY);
        this.set('resolver', resolver);
      })
        .onConfirmed(() => this.set('confirmed', true))
        .onCancelled(() => this.set('confirmed', false))
        .onDone(() => this.set('resolver', null));
    }
  }
});
