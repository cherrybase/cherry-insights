var localStorage = window.localStorage;
var cacheCounter = 0;

class CacheUtil {
    constructor(cacheName) {
        this.id = cacheName || cacheCounter++;
    }
    setVal(key, value) {
        return localStorage.setItem(this.id + "#" + key, JSON.stringify({ time: "0", text: value }));
    }
    saveVal(key, value) {
        if (typeof value !== "string") {
            return localStorage.setItem(this.id + "#" + key, JSON.stringify(value));
        } else {
            return localStorage.setItem(this.id + "#" + key, value);
        }
    }
    has(key) {
        var value = localStorage.getItem(this.id + "#" + key);
        return typeof value === "string";
    }
    getVal(key) {
        var xString = localStorage.getItem(this.id + "#" + key);
        var x = JSON.parse(xString);
        return x == undefined ? null : x.text;
    }
}

export default CacheUtil;
