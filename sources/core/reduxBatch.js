export function reduxBatch(next) {

    let nextListeners = [];
    let currentListeners = undefined;

    function ensureCanMutateNextListeners() {

        if (nextListeners === currentListeners) {
            nextListeners = nextListeners.slice();
        }

    }

    function subscribe(listener) {

        if (typeof listener !== `function`)
            throw new Error(`Invalid listener, expected a function`);

        let isSubscribed = true;

        ensureCanMutateNextListeners();
        nextListeners.push(listener);

        return function unsubscribe() {

            if (!isSubscribed)
                return;

            ensureCanMutateNextListeners();
            nextListeners.splice(nextListeners.indexOf(listener), 1);

            isSubscribed = false;

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

        let receivedNotification = false;
        let inDispatch = false;

        var dispatchRecurse = function(action) {

            return Array.isArray(action)
                ? action.map(subAction => dispatchRecurse(subAction))
                : store.dispatch(action);

        }

        function dispatch(action) {

            let reentrant = inDispatch;

            if (!reentrant) {
                receivedNotification = false;
                inDispatch = true;
            }

            let result = dispatchRecurse(action);
            let requiresNotification = receivedNotification && !reentrant;

            if (!reentrant) {
                receivedNotification = false;
                inDispatch = false;
            }

            if (requiresNotification)
                notifyListeners();

            return result;

        }

        store.subscribe(() => {

            if (inDispatch) {
                receivedNotification = true;
            } else {
                notifyListeners();
            }

        });

        return Object.assign({}, store, {
            dispatch, subscribe
        });

    };

}
