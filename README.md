# ember-confirmed

An Ember asynchronous confirmation addon

A very simple *promise-like* API for easily showing a confirmation and
resolving to the result of the user input. Its main goal is to replace or
enhance the typical `window.confirm` and many adhoc event based solutions (see
example below).

Special thanks to [FunnelCloud Inc.](http://funnelcloud.io/) for graciously
providing inspiration, R+D, and support.

License: MIT

## Installation

```
ember install ember-confirmed
```

## Usage

```
import Confirmer from 'confirmer';
```

Much like the `Promise` API the constructor for the `Confirmer` takes
a function. That function is passed a resolver object which has four functions
on it that you can use to *fulfill* the `Confirmer`.

```js
new Confirmer(function (resolver) {
  // Affirm confirmation
  resolver.confirm();
  // Reject confirmation
  resolver.reject();
  // Cancel confirmation
  resolver.cancel();
  // Reject with an Error
  resolver.error(new Error());
})
```

Each state can take an optional value. The `Confirmer` is a wrapper around
a `Promise` and can be treated as a promise. For example to capture any errors
or exceptions you may trigger you would use the `catch()` function.

```js
new Confirmer(function (resolver) { … })
  .catch(function (reason) { console.error(reason); });
```

The `then()` function will be passed the underlying data object:

```
new Confirmer(function (resolver) { … })
  .then(function (result) {
    console.log(result.reason);
    console.log(result.value);
  });
```

The `reason` being one of `rejected`, `confirmed`, or `cancelled`. And the
`value` is the value passed to one of the resolver functions.

The following methods are chainable:

#### `onCanceled`

Is called when `resolver.cancel()` is triggered. Used to denote that the
confirmation was cancelled and perhaps should do nothing.

#### `onConfirmed`

Is called when `resolver.confirm()` is triggered. Used to denote that the user
has confirmed in some way. ("OK" button, correct login credentials, etc.)

#### `onRejected`

Is called when `resolver.rejected()` is triggered. Used to denote that the user
has performed an action that denied the confirmation. ("No" button, bad
password, etc.)

#### `onDone`

Is called when **any** of the resolver functions are triggered. This is used for
clean up like closing the dialog and removing stale event handlers. This is also
called if the `resolver.error` is triggered or something throws an exception in
the initialization function (which can be captued by the `catch()` function just
like a promise).

## Examples

The following are example situations that I've run into and how this module can
help reason about them.

### Basic `window.confirm`

In this example we will wrap the `window.confirm`. Although this is **not**
asynchronous it does illustrate the API.

```js
new Confirmer(function (resolver) {
  if (confirm('Whould you like to do this?')) {
    resolver.confirm();
  } else {
    resolver.cancel();
  }
})
  .onConfirmed(function () { console.log('Ok! let\'s crack on!'); })
  .onCancelled(function () { console.log('Maybe next time then?'); })
  .onDone(function () { console.log('Confirm completed') });
```

### Example component

```hbs
<p>Result was confirmed: {{if confirmed 'YES' 'NO'}}</p>

{{#if resolver}}
  <p>Confirmation?</p>
  <button onclick={{action resolver.cancel}}>Cancel</button>
  <button onclick={{action resolver.confirm}}>Ok</button>
{{else}}
  <button onclick={{action "showDialog"}}>Show Dialog</button>
{{/if}}
```

```js
import Component from '@ember/component';
import Confirmer from 'confirmer';

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
```

### Password prompt

Maybe the resolution of the confirmation needs more logic. For example asking
for a password.

```hbs
<p>Result was confirmed: {{if confirmed 'YES' 'NO'}}</p>

{{#if resolver}}
  <label>
    Password: {{input type="password" value=password}}
  </label>
  <button onclick={{action resolver.cancel}}>Cancel</button>
  <button onclick={{action resolver.confirm password}}>Ok</button>
{{else}}
  <button onclick={{action "showDialog"}}>Show Dialog</button>
{{/if}}
```

```js
import Component from '@ember/component';
import Confirmer from 'confirmer';

const REAL_PASSWORD = 'password';

export default Component.extend({
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
```

### Auto closing message box

Here is an example of a message box that auto closes after 5 seconds.

Notice that you can call the resolver functions multiple times and only the
first one wins.

```js
import Component from '@ember/component';
import { later } from '@ember/runloop';
import Confirmer from 'confirmer';

const DIALOG_AUTO_CLOSE_DELAY = 5000;

export default Component.extend({
  actions: {
    showDialog() {
      new Confirmer(resolver => {
        later(resolver.cancel, DIALOG_AUTO_CLOSE_DELAY);
        this.set('resolver', resolver);
      })
        .onConfirmed(() => this.set('confirmed', true))
        .onCancelled(() => this.set('confirmed', false))
        .onDone(() => this.set('resolver', null));
    }
  }
});
```

### Unsaved changes confirmation on route transition

Here is an example if trapping a route transition and showing a confirmation
dialog if the data is not saved (dirty).

It shows how you can pass a Confirmer object around between each other.

#### `app/routes/index.js`

```js
import Route from '@ember/routing/route';

export default Route.extend({
  actions: {
    willTransition(transition) {
      if (!this.currentModel.get('hasDirtyAttributes')) { return; }
      transition.abort();
      this.controller.showDirtyConfirmation()
        .onConfirmed(() => {
          this.currentModel.rollbackAttributes();
          transition.retry();
        });
    }
  }
});
```

#### `app/controllers/index.js`

```js
import Controller from '@ember/controller';
import Confirmer from 'confirmer';

export default Controller.extend({
  showDirtyConfirmation() {
    return new Confirmer(resolver => {
      this.set('modalAction', resolver);
      this.set('showConfirmationModal', true);
    })
      .onDone(() => this.set('showConfirmationModal', false));
  }
});
```

#### `app/templates/index.hbs`

```hbs
{{#if showConfirmationModal}}
  <div class="modal">
    <p>You have unsaved changes. Are you sure wish to abandon them?<p>
    <button {{action (action modalActions.cancel)}}>No</button>
    <button {{action (action modalActions.confirm)}}>Yes</button>
  </div>
{{/if}}
```
