/* eslint-disable no-param-reassign */
import parsePath from '../helpers/parser';
import helpers from '../helpers/helpers';

const {
    isObject,
    isArray,
    isArrayKey
} = helpers;

function hasValue(object: object, path: string, type?: string) {
    const parts = parsePath(path);

    if (!isArray(object) && !isObject(object)) {
        throw new Error('First argument must be either object or array.');
    }

    const has = (i, obj) => {
        const part = parts[i];

        if (!((isArray(obj) && isArrayKey(part)) || isObject(obj)) || !(part in obj)) return false;

        // eslint-disable-next-line valid-typeof
        if (i === parts.length - 1) return part in obj && type ? typeof obj[part] === type : true;

        return has(i + 1, obj[part]);
    };

    return has(0, object);
}

export default hasValue;
