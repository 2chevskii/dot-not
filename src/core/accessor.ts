/* eslint-disable no-param-reassign */
import splitDottedPath from '../helpers/parser';
import helpers from '../helpers/helpers';

const {
    isObject,
    isArray,
    isArrayKey
} = helpers;

function setValue(object: any, path: string, value: any) {
    const pathParts = splitDottedPath(path);

    if (pathParts.length > 0) {
        const setObjectProp = (obj, index) => {
            const partName = pathParts[index];

            if (index === pathParts.length - 1) {
                obj[partName] = value;
                return obj;
            }

            if (!isObject(obj[partName])) {
                obj[partName] = {};
            }

            return setObjectProp(obj[partName], index + 1);
        };

        if (!isObject(object)) object = {};

        setObjectProp(object, 0);
    }

    return object;
}

function getValue(
    object: object,
    path: string,
    defaultValue: any = undefined,
    force: boolean = false
) {
    const pathParts = splitDottedPath(path);

    if (pathParts.length < 1) return defaultValue;

    const getObjectProp = (obj, index) => {
        const partName = pathParts[index];
        const nextPart = obj[partName];

        if (index === pathParts.length - 1) {
            return {
                last : true,
                value: nextPart
            };
        }

        if (!nextPart || !(isObject(nextPart) || (isArray(nextPart) && isArrayKey(partName)))) {
            return {
                last : false,
                value: nextPart
            };
        }

        return getObjectProp(obj[partName], index + 1);
    };

    if (!isObject(object)) {
        object = {};
    } else {
        const val = getObjectProp(object, 0);

        if (val.last && val.value) {
            return val.value;
        } if (!defaultValue || !force) {
            return undefined;
        }
    }

    setValue(object, path, defaultValue);
    return defaultValue;
}

export default { setValue, getValue };
