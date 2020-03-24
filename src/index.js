import parsePath from './helpers/parser';
import core from './core/accessor';

const get = core.getValue;
const set = core.setValue;
const has = core.hasValue;
const copy = core.copyProperty;
const move = core.moveProperty;
const remove = core.removeProperty;
const parse = parsePath;

export {
    get,
    set,
    has,
    copy,
    move,
    remove,
    parse
};

export default {
    get,
    set,
    has,
    copy,
    move,
    remove,
    parse
};
