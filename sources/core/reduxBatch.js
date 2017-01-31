import { isArray, isFunction } from 'lodash';

export function reduxBatch(next) {

    let nextListeners = [];
    let currentListeners = currentListeners;

    function ensureCanMutateNextListeners() {

        if (nextListeners === currentListeners) {
            nextListeners = nextListeners.slice();
        }

    }

    function subscribe(listener) {

        if (!isFunction(listener))
            throw new Error(`Invalid listener, expected a function`);

        let isSubscribed = true;

        ensureCanMutateNextListeners();
        nextListeners.push(listener);

        return function unsubscribe() {

            if (!isSubscribed)
                return;

            ensureCanMutateNextListeners();
            nextListeners.splice(nextListeners.indexOf(listener), 1);

        };

    }

    function notifyListeners() {

        let listeners = nextListeners;

        for (let t = 0; t < listeners.length; ++t) {
            currentListeners = listeners;
            listeners[t]();
        }

    }

    return function (... args) {

        let store = next(... args);

        function dispatchRecurse(action) {

            return isArray(action)
                ? action.map(subAction => dispatchRecurse(subAction))
                : store.dispatch(action);

        }

        function dispatch(action) {

            let result = dispatchRecurse(action);
            notifyListeners();

            return result;

        }

        return Object.assign({}, store, {
            dispatch, subscribe
        });

    };

}
