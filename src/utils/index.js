export { default as CacheUtil } from "./CacheUtil";

export function _no_op() {}

/**
 * Serialize a JSON object into a key=value pairs
 *
 * @method serializeParams
 * @private
 * @param object JSON object of parameters and their values
 * @return {string} Serialized parameters in the form of a query string
 */
export function serializeParams(params) {
    var str = "";
    for (var key in params) {
        if (params.hasOwnProperty(key)) {
            if (str !== "") str += "&";
            str += key + "=" + params[key];
        }
    }
    return str;
}

export function debounce(fn, delay) {
    var timer = null;
    return function () {
        var context = this;
        var args = arguments;

        clearTimeout(timer);
        timer = setTimeout(function () {
            fn.apply(context, args);
        }, delay);
    };
}

export const utils = {
    _no_op,
    serializeParams,
    debounce
};
