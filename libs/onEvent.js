onEvent = {}

const listeners = {}

onEvent.on = function (name, callback) {
    listeners[name] = [callback, false]
}

onEvent.once = function (name, callback) {
    listeners[name] = [callback, true]
}
onEvent.removeListener = function (name) {
    delete listeners[name]
}

onEvent.event = function (name, event, data) {
    if (typeof listeners[name] !== "undefined") {
        let callback = listeners[name][0]
        if (listeners[name][1]) {
            delete listeners[name]
        }
        callback(event, data);
    }
}
onEvent.exist = function (name) {
    return (typeof listeners[name] !== "undefined");
}
module.exports = exports = onEvent;