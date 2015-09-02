"use strict";

import _ from "underscore";

const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
const ARGUMENT_NAMES = /([^\s,]+)/g;
class Aux {

    static requireAll(r) {
        return r.keys().map(r);
    }
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
            let hasDescriptor = false, bindMode, owner, shouldBind = true, useSelfbind = false;
            let o = arguments[i];
            if ((typeof o.isBindingDescriptor) !== "undefined" && (typeof o.object) !== "undefined") {
                hasDescriptor = true; bindMode = o.bind_mode || false; owner = o.owner || null; shouldBind = o.bind !== undefined ? o.bind : shouldBind; useSelfbind = o.useSelfbind || o.selfbind || useSelfbind; o = o.object;
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
                                            let descriptor = Object.getOwnPropertyDescriptor(o, k), sbdescriptor, val = null, get = null, set = null;
                                            if (descriptor.value != null && (typeof descriptor.value.apply) !== "undefined") {
                                                if (useSelfbind) {
                                                    val = descriptor.value;
                                                    delete descriptor.value;
                                                } else {
                                                    descriptor.value = descriptor.value.bind(owner);
                                                }
                                            }
                                            if ((typeof descriptor.get) !== "undefined") {
                                                if (useSelfbind) {
                                                    get = descriptor.get;
                                                    delete descriptor.get;
                                                } else {
                                                    descriptor.get = descriptor.get.bind(owner);
                                                }
                                            }

                                            if ((typeof descriptor.set) !== "undefined") {
                                                if (useSelfbind) {
                                                    set = descriptor.set;
                                                    delete descriptor.set;
                                                } else {
                                                    descriptor.set = descriptor.set.bind(owner);
                                                }
                                            }
                                            if (useSelfbind) {
                                                delete descriptor.writable;
                                                descriptor.get = function() {
                                                    let obj = {configurable: true, writable: true};
                                                    if (val !== null) {
                                                        const bound = val.bind(owner);
                                                        obj.value = bound;
                                                    }
                                                    if (get !== null) {
                                                        const bound = get.bind(owner);
                                                        obj.get = bound;
                                                    }
                                                    if (set !== null) {
                                                        const bound = set.bind(owner);
                                                        obj.set = bound;
                                                    }
                                                    Object.defineProperty(dest, k, obj);
                                                }
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
                                    let descriptor = Object.getOwnPropertyDescriptor(o, k), val = null, get = null, set = null;
                                    if (descriptor.value != null && (typeof descriptor.value.apply) !== "undefined") {
                                        if (useSelfbind) {
                                            val = descriptor.value;
                                            delete descriptor.value;
                                        } else {
                                            descriptor.value = descriptor.value;
                                        }
                                    }
                                    if ((typeof descriptor.get) !== "undefined") {
                                        if (useSelfbind) {
                                            get = descriptor.get;
                                            delete descriptor.get;
                                        } else {
                                            descriptor.get = descriptor.get;
                                        }
                                    }

                                    if ((typeof descriptor.set) !== "undefined") {
                                        if (useSelfbind) {
                                            set = descriptor.set;
                                            delete descriptor.set;
                                        } else {
                                            descriptor.set = descriptor.set;
                                        }
                                    }
                                    if (useSelfbind) {
                                        delete descriptor.writable;
                                        descriptor.get = function() {
                                            let obj = {configurable: true, writable: true};
                                            if (val !== null) {
                                                const bound = val.bind(this);
                                                obj.value = bound;
                                            }
                                            if (get !== null) {
                                                const bound = get.bind(this);
                                                obj.get = bound;
                                            }
                                            if (set !== null) {
                                                const bound = set.bind(this);
                                                obj.set = bound;
                                            }
                                            Object.defineProperty(this, k, obj);
                                        }
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
