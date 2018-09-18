import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    showDialog() {
      this.get('modalManager').open()
        .onConfirmed(() => this.set('confirmed', true))
        .onCancelled(() => this.set('confirmed', false));
    }
  }
});
