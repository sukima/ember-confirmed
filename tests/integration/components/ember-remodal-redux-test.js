import { moduleForComponent, test } from 'ember-qunit';
import { run } from '@ember/runloop';
import hbs from 'htmlbars-inline-precompile';
import Confirmer, { CONFIRMED, REJECTED, CANCELLED } from 'confirmer';

moduleForComponent('ember-remodal-redux', 'Integration | Component | ember remodal redux', {
  integration: true
});

test('registers a modalManager', function(assert) {
  this.render(hbs`{{ember-remodal-redux registerModalManager=(action (mut modalManager))}}`);
  let modalManager = this.get('modalManager');
  assert.ok(modalManager.getModal, 'expected modalManager to have a getModal method');
  assert.ok(modalManager.open, 'expected modalManager to have a open method');
  assert.ok(modalManager.confirm, 'expected modalManager to have a confirm method');
  assert.ok(modalManager.cancel, 'expected modalManager to have a cancel method');
  assert.ok(modalManager.reject, 'expected modalManager to have a reject method');
  assert.ok(modalManager.error, 'expected modalManager to have a error method');
});

test('#open method returns a confirmer', function(assert) {
  this.render(hbs`{{ember-remodal-redux registerModalManager=(action (mut modalManager))}}`);
  let modalManager = this.get('modalManager');
  let confirmer = run(() => modalManager.open());
  assert.ok(confirmer instanceof Confirmer, 'expected open() to return a Confirmer');
});

test('#getModal method returns a modal object', function(assert) {
  this.render(hbs`{{ember-remodal-redux registerModalManager=(action (mut modalManager))}}`);
  let modalManager = this.get('modalManager');
  run(() => modalManager.open());
  assert.ok(modalManager.getModal, 'expected getModal() to return a modal object');
});

test('#confirm method resolves the confirmer', async function(assert) {
  this.render(hbs`{{ember-remodal-redux registerModalManager=(action (mut modalManager))}}`);
  let modalManager = this.get('modalManager');
  let confirmer = run(() => modalManager.open());
  run(() => modalManager.confirm('test-value'));
  let { reason, value } = await confirmer;
  assert.equal(reason, CONFIRMED);
  assert.equal(value, 'test-value');
});

test('#cancel method resolves the confirmer', async function(assert) {
  this.render(hbs`{{ember-remodal-redux registerModalManager=(action (mut modalManager))}}`);
  let modalManager = this.get('modalManager');
  let confirmer = run(() => modalManager.open());
  run(() => modalManager.cancel('test-value'));
  let { reason, value } = await confirmer;
  assert.equal(reason, CANCELLED);
  assert.equal(value, 'test-value');
});

test('#reject method resolves the confirmer', async function(assert) {
  this.render(hbs`{{ember-remodal-redux registerModalManager=(action (mut modalManager))}}`);
  let modalManager = this.get('modalManager');
  let confirmer = run(() => modalManager.open());
  run(() => modalManager.reject('test-value'));
  let { reason, value } = await confirmer;
  assert.equal(reason, REJECTED);
  assert.equal(value, 'test-value');
});

test('#error method errors the confirmer', async function(assert) {
  this.render(hbs`{{ember-remodal-redux registerModalManager=(action (mut modalManager))}}`);
  let modalManager = this.get('modalManager');
  let confirmer = run(() => modalManager.open());
  run(() => modalManager.error(new Error('Test Error')));
  try {
    await confirmer;
    assert.ok(false, 'expected confirmer to be errored');
  } catch (error) {
    assert.ok(error, 'expected confirmer to be errored');
  }
});
