# [![](/logo.png?raw=true)](https://github.com/manaflair/redux-batch)

> Enhance your Redux store to support batched actions

[![](https://img.shields.io/npm/v/@manaflair/redux-batch.svg)]() [![](https://img.shields.io/npm/l/@manaflair/redux-batch.svg)]()

[Check out our other OSS projects!](https://manaflair.github.io)

## Installation

```
$> npm install --save @manaflair/redux-batch
```

## Usage

```js
import { reduxBatch }  from '@manaflair/redux-batch';
import { createStore } from 'redux';

let store = createStore(reducer, reduxBatch);

store.dispatch([

  // Store listeners will only be called once all of these actions
  // have been dispatched to the store.

  { type: `INCREMENT_COUNTER` },
  { type: `INCREMENT_COUNTER` },

]);
```

## Usage w/ extra middlewares

```js
import { reduxBatch }                            from '@manaflair/redux-batch';
import { put, takeEvery }                        from 'redux-saga/effects';
import createSagaMiddleware                      from 'redux-saga';
import { applyMiddleware, compose, createStore } from 'redux';

let sagaMiddleware = createSagaMiddleware();
let store = createStore(reducer, compose(reduxBatch, applyMiddleware(sagaMiddleware), reduxBatch));

sagaMiddleware.run(function* () {
  yield takeEvery(`*`, function* (action) {

    // Duplicate any event dispatched, and once again, store
    // listeners will only be fired after both actions have
    // been resolved/

    yield put([ action, action ]);

  });
});
```

Notice how we duplicate the reduxBatch enhancer. We do this because we want our sagas to be able to emit batch actions as well. Without the first reduxBatch enhancer, any batch action emitted from our sagas would cascade into the standard dispatch method, and wouldn't get a chance to be flattened. Similarly, without the second one, any action dispatched wouldn't be flattened before being passed to our sagas, which wouldn't know how to deal with these curiously formed actions.

## Differences with other libraries

- [redux-batched-actions](https://github.com/tshelburne/redux-batched-actions) use a specific action type in order to support batched actions. It works fine, but unfortunately it's unpractical with enhancers, because they aren't aware of this action semantic, and won't flatten it (unless they add a specific support for this action type).

- [redux-batched-subscribe](https://github.com/tappleby/redux-batched-subscribe) features advanced mechanisms to defer notifying store listeners (for example by debouncing these notifications), but doesn't deal per-se with batch actions. We share a similar name, but a completely different purpose.

## Thanks

Most of this code has been originally designed by [Mark Erikson](https://github.com/markerikson) on the [following thread](https://github.com/reactjs/redux/pull/1813#issuecomment-227623481). We mainly packaged it into an easy-to-use module.

## License (MIT)

> **Copyright © 2016 Manaflair & Mark Erikson**
>
> Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
>
> The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
>
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
