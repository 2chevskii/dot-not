function isObject(object) {
    if (!object) {
        return false;
    }

    return Object.getPrototypeOf(object) === Object.prototype;
}

function isArray(object) {
    return Array.isArray(object);
}

function isArrayKey(propName) {
    return [...propName].every(char => char >= 0 && char <= 9);
}

export default {
    isObject,
    isArray,
    isArrayKey
};
