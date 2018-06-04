import { moduleForComponent, test } from 'ember-qunit';
import { run } from '@ember/runloop';
import hbs from 'htmlbars-inline-precompile';
import Confirmer, { CONFIRMED, REJECTED, CANCELLED } from 'confirmer';

moduleForComponent('ember-remodal-redux', 'Integration | Component | ember remodal redux', {
  integration: true
});

test('registers a modalController', function(assert) {
  this.render(hbs`{{ember-remodal-redux registerModalController=(action (mut modalController))}}`);
  let modalController = this.get('modalController');
  assert.ok(modalController.getModal, 'expected modalController to have a getModal method');
  assert.ok(modalController.open, 'expected openController to have a open method');
  assert.ok(modalController.confirm, 'expected modalController to have a confirm method');
  assert.ok(modalController.cancel, 'expected modalController to have a cancel method');
  assert.ok(modalController.reject, 'expected modalController to have a reject method');
  assert.ok(modalController.error, 'expected modalController to have a error method');
});

test('#open method returns a confirmer', function(assert) {
  this.render(hbs`{{ember-remodal-redux registerModalController=(action (mut modalController))}}`);
  let modalController = this.get('modalController');
  let confirmer = run(() => modalController.open());
  assert.ok(confirmer instanceof Confirmer, 'expected open() to return a Confirmer');
});

test('#getModal method returns a modal object', function(assert) {
  this.render(hbs`{{ember-remodal-redux registerModalController=(action (mut modalController))}}`);
  let modalController = this.get('modalController');
  run(() => modalController.open());
  assert.ok(modalController.getModal, 'expected getModal() to return a modal object');
});

test('#confirm method resolves the confirmer', async function(assert) {
  this.render(hbs`{{ember-remodal-redux registerModalController=(action (mut modalController))}}`);
  let modalController = this.get('modalController');
  let confirmer = run(() => modalController.open());
  run(() => modalController.confirm('test-value'));
  let { reason, value } = await confirmer;
  assert.equal(reason, CONFIRMED);
  assert.equal(value, 'test-value');
});

test('#cancel method resolves the confirmer', async function(assert) {
  this.render(hbs`{{ember-remodal-redux registerModalController=(action (mut modalController))}}`);
  let modalController = this.get('modalController');
  let confirmer = run(() => modalController.open());
  run(() => modalController.cancel('test-value'));
  let { reason, value } = await confirmer;
  assert.equal(reason, CANCELLED);
  assert.equal(value, 'test-value');
});

test('#reject method resolves the confirmer', async function(assert) {
  this.render(hbs`{{ember-remodal-redux registerModalController=(action (mut modalController))}}`);
  let modalController = this.get('modalController');
  let confirmer = run(() => modalController.open());
  run(() => modalController.reject('test-value'));
  let { reason, value } = await confirmer;
  assert.equal(reason, REJECTED);
  assert.equal(value, 'test-value');
});

test('#error method errors the confirmer', async function(assert) {
  this.render(hbs`{{ember-remodal-redux registerModalController=(action (mut modalController))}}`);
  let modalController = this.get('modalController');
  let confirmer = run(() => modalController.open());
  run(() => modalController.error(new Error('Test Error')));
  try {
    await confirmer;
    assert.ok(false, 'expected confirmer to be errored');
  } catch (error) {
    assert.ok(error, 'expected confirmer to be errored');
  }
});
