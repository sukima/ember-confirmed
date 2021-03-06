import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { bool } from '@ember/object/computed';
import { guidFor } from '@ember/object/internals';
import { tryInvoke } from '@ember/utils';
import Confirmer from 'confirmer';
import layout from '../templates/components/ember-remodal-redux';
import { deprecate } from '@ember/application/deprecations';
import { assert } from '@ember/debug';

export default Component.extend({
  remodal: service(),

  layout,
  tagName: '',

  closeOnOutsideClick: true,
  closeOnEscape: true,
  closeOnCancel: true,
  closeOnConfirm: '',
  modifier: true,
  hashTracking: false,

  showModal: bool('modalResolver'),

  modalName: computed(function() {
    return `${guidFor(this)}-modal`;
  }),

  modal: computed('modalName', function() {
    return this.get(`remodal.${this.get('modalName')}.modal`);
  }).volatile(),

  openModal() {
    const remodal = this.get('remodal');
    let modalName = this.get('modalName');
    return new Confirmer(resolver => {
      this.set('modalResolver', resolver);
      let promise = remodal.open(modalName);
      resolver.dispose(() => {
        // https://github.com/sethbrasile/ember-remodal/issues/3
        return promise
          .then(() => {
            let modalState = tryInvoke(this.get('modal'), 'getState');
            // https://github.com/vodkabears/Remodal/issues/291
            if (modalState !== 'opened') { return; }
            return remodal.close(modalName);
          })
          .then(() => this.set('modalResolver', null));
      });
    });
  },

  didInsertElement() {
    this._super(...arguments);
    let registerModalController = this.get('registerModalController');
    let registerModalManager = this.get('registerModalManager') || registerModalController;
    assert(`Missing required action 'registerModalManager'`, registerModalManager);
    deprecate(
      'use registerModalManager instead of registerModalController',
      !registerModalController,
      { id: 'ember-redux-remodal.registerModalController', until: '3.0' }
    );
    registerModalManager({
      getModal: () => this.get('modal'),
      open: () => this.openModal(),
      confirm: (v) => this.send('resolve', 'confirm', v),
      cancel: (v) => this.send('resolve', 'cancel', v),
      reject: (v) => this.send('resolve', 'reject', v),
      error: (v) => this.send('resolve', 'error', v)
    });
  },

  actions: {
    opened() {
      tryInvoke(this, 'onOpen');
    },

    resolve(method, value) {
      tryInvoke(this.get('modalResolver'), method, [value]);
    }
  }
});
