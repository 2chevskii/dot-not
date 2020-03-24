import core from './core/accessor';
import parse from './helpers/parser';

export const {
    hasValue, getValue, setValue, copyProperty, moveProperty, removeProperty
} = core;
export const parsePath = parse;

export default {
    hasValue,
    getValue,
    setValue,
    copyProperty,
    moveProperty,
    removeProperty,
    parsePath
};
