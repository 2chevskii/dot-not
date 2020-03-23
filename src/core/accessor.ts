/* eslint-disable no-param-reassign */
import parsePath from '../helpers/parser';
import helpers from '../helpers/helpers';

const {
    isObject,
    isArray,
    isArrayKey
} = helpers;

function hasValue(object: object, path: string, type?: string): boolean {
    const parts = parsePath(path);

    const has = (i, obj) => {
        const part = parts[i];

        if (!((isArray(obj) && isArrayKey(part)) || isObject(obj)) || !(part in obj)) return false;

        // eslint-disable-next-line valid-typeof
        if (i === parts.length - 1) return part in obj && type ? typeof obj[part] === type : true;

        return has(i + 1, obj[part]);
    };

    return has(0, object);
}

function setValue(object: object, path: string, value: any, force: boolean = true): boolean {
    const parts = parsePath(path);

    const set = (i, obj) => {
        const part = parts[i];

        if (i === parts.length - 1) {
            obj[part] = value;
            return true;
        } if (isObject(obj[part]) || (isArray(obj[part]) && isArrayKey(parts[i + 1]))) {
            return set(i + 1, obj[part]);
        } if (obj[part] === undefined || force) {
            obj[part] = {};
            return set(i + 1, obj[part]);
        } return false;
    };

    return set(0, object);
}

function getValue(object: object, path: string, defaultValue?: any): any {
    const parts = parsePath(path);

    const get = (i, obj) => {
        const part = parts[i];

        if ((isObject(obj) || isArray(obj)) && part in obj) {
            if (i === parts.length - 1) return obj[part];
            return get(i + 1, obj[part]);
        } if (defaultValue !== undefined) {
            setValue(object, path, defaultValue, true);
            return defaultValue;
        } return undefined;
    };

    return get(0, object);
}

function removeProperty(object: object, path: string): boolean {
    const parts = parsePath(path);

    const remove = (i, obj) => {
        const part = parts[i];

        if ((!isObject(obj) && !(isArray(obj) && isArrayKey(part))) || !(part in obj)) return false;

        if (i === parts.length - 1) return delete obj[part];

        return remove(i + 1, obj[part]);
    };

    return remove(0, object);
}

function copyProperty(sourceObject: object, sourcePath: string, targetPath: string): boolean;
function copyProperty(
    sourceObject: object,
    sourcePath: string,
    targetPath: string,
    targetObject: object
): boolean;
function copyProperty(
    sourceObject: object,
    sourcePath: string,
    targetPath: string,
    targetObject?: object
): boolean {
    if (!targetObject) targetObject = sourceObject;

    if (!hasValue(sourceObject, sourcePath)) return false;

    const value = getValue(sourceObject, sourcePath);

    return setValue(targetObject, targetPath, value);
}

function moveProperty(sourceObject: object, sourcePath: string, targetPath: string): boolean;
function moveProperty(
    sourceObject: object,
    sourcePath: string,
    targetPath: string,
    targetObject: object
): boolean;
function moveProperty(
    sourceObject: object,
    sourcePath: string,
    targetPath: string,
    targetObject?: object
): boolean {
    if (!targetObject) targetObject = sourceObject;

    if (!copyProperty(sourceObject, sourcePath, targetPath, targetObject)) return false;

    return removeProperty(sourceObject, sourcePath);
}

export default {
    hasValue,
    setValue,
    getValue,
    removeProperty,
    copyProperty,
    moveProperty
};
