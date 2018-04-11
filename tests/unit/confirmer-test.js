import Ember from 'ember';
import { module, test } from 'qunit';
import Confirmer from 'confirmer';

const { run: { next }, RSVP } = Ember;

module('Unit | Confirmer');

test('is imported correctly', function (assert) {
  assert.ok(Confirmer, 'it exists');
});

test('pants are on', function(assert) {
  let done = assert.async();
  assert.expect(1);
  new Confirmer(resolver => next(resolver.confirm))
    .onConfirmed(() => assert.ok(true, 'confirmation confirmed'))
    .onDone(done);
});

test('Uses RSVP as Promise implementation', function(assert) {
  assert.equal(Confirmer.Promise, RSVP.Promise);
});
