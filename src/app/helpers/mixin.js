import {extend} from "./util";

let _extend = (owner, file, req, bind = false) => {
    let prop = `${file}s`, obj = req(`./${file}`);
    if (bind) {
        owner[prop] = owner[prop] || {};
        extend(owner[prop], {
            object: obj,
            owner: owner,
            isBindingDescriptor: true,
            bind_mode: "descriptor",
        });
    } else {
        owner.prototype[prop] = owner.prototype[prop] || {};
        extend(owner.prototype[prop], {
            object: obj,
            isBindingDescriptor: true,
        });
    }
};

export default (req, bind) => (owner) => {
    try {
        _extend(owner, "view", req, bind);
    } catch (e) {
        console.warn(`Couldn't load views for module ${owner.name || owner.dispayName || owner}`, e);
    }

    try {
        _extend(owner, "style", req, bind);
    } catch (e) {
        console.warn(`Couldn't load styles for module ${owner.name || owner.dispayName || owner}`, e);
    }
}


// DepMan.util("aux").extend($scope, this, { object: this.constructor.prototype, owner: this, isBindingDescriptor: true, bind_mode: true });
