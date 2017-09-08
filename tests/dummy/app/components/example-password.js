import Ember from 'ember';
import Confirmer from 'confirmer';

const REAL_PASSWORD = 'password';

export default Ember.Component.extend({
  actions: {
    showDialog() {
      new Confirmer(resolver => this.set('resolver', resolver))
        .onConfirmed(password => {
          this.set('confirmed', password === REAL_PASSWORD);
        })
        .onCancelled(() => this.set('confirmed', false))
        .onDone(() => this.set('resolver', null));
    }
  }
});
