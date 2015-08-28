"use strict";

import _ from "underscore";

const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
const ARGUMENT_NAMES = /([^\s,]+)/g;
class Aux {

    static reflection(func) {
        let fnStr = func.toString().replace(STRIP_COMMENTS, "");
        let result = fnStr.slice(fnStr.indexOf("(") + 1, fnStr.indexOf(")")).match(ARGUMENT_NAMES);
        if(result === null) { result = []; }
        return result;
    }
    static extend(dest) {
        let l = arguments.length;
        const excl = ["$scope", "constructor"];
        if (l < 2 && dest == null) {
            return dest;
        }
        for (let i = 1; i < l; i++) {
            let hasDescriptor = false, bindMode, owner, shouldBind = true;
            let o = arguments[i];
            if ((typeof o.isBindingDescriptor) !== "undefined" && (typeof o.object) !== "undefined") {
                hasDescriptor = true; bindMode = o.bind_mode || false; owner = o.owner || null; shouldBind = o.bind !== undefined ? o.bind : shouldBind; o = o.object;
            }
            let keys = Object.getOwnPropertyNames(o);
            for (let k of keys) {
                if (excl.indexOf(k) < 0) {
                    try {
                        if (hasDescriptor) {
                            if (owner != null) {
                                if (bindMode === true || bindMode === "direct") {
                                    dest[k] = o[k].bind(owner);
                                }
                                else {
                                    if (bindMode === "descriptor") {
                                        try {
                                            let descriptor = Object.getOwnPropertyDescriptor(o, k);
                                            if (descriptor.value != null && (typeof descriptor.value.apply) !== "undefined") {
                                                descriptor.value = descriptor.value.bind(owner);
                                            }
                                            if ((typeof descriptor.get) !== "undefined") {
                                                descriptor.get = descriptor.get.bind(owner);
                                            }

                                            if ((typeof descriptor.set) !== "undefined") {
                                                descriptor.set = descriptor.set.bind(owner);
                                            }
                                            Object.defineProperty(dest, k, descriptor);
                                        } catch (e) {
                                            console.log("ERROR", e);
                                            throw e;
                                        }
                                    }
                                }
                            }
                            else {
                                if (bindMode === "descriptor") {
                                    let descriptor = Object.getOwnPropertyDescriptor(o, k);
                                    if (descriptor.value != null && (typeof descriptor.value.apply) !== "undefined") {
                                        descriptor.value = descriptor.value;
                                    }
                                    if ((typeof descriptor.get) !== "undefined") {
                                        descriptor.get = descriptor.get;
                                    }

                                    if ((typeof descriptor.set) !== "undefined") {
                                        descriptor.set = descriptor.set;
                                    }
                                    Object.defineProperty(dest, k, descriptor);
                                } else {
                                    dest[k] = o[k];
                                }
                            }
                        }
                        else { dest[k] = o[k]; }
                    } catch (e) {
                        continue;
                    }
                }
            }
        }
        return dest;
    }
    static safeApply(fn) {
        let phase = this.$root.$$phase;
        if(phase === "$apply" || phase === "$digest") {
            if(fn && ((typeof fn) === "function")) {
                fn();
            }
        } else {
            this.$apply(fn);
        }
    }

    static uncommon(...args) {
        return _.difference(_.union(...args), _.intersection(...args));
    }

    static callbackShim(value, cb = null) {
        if (!_.isNull(cb)) {
            cb(null, value);
            return true;
        } else {
            return value;
        }
    }

    static errorShim(message, cb = null) {
        let e = new Error(message);
        if (!_.isNull(cb)) {
            cb(e);
        } else {
            throw e;
        }
    }
}

export default Aux;
