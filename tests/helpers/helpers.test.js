/* eslint-disable no-new-object */
import { describe, it } from 'mocha';
import assume from 'assume';
import helpers from '../../src/helpers/helpers';

const { isArray, isArrayKey, isObject } = helpers;

describe('Helpers tests:', () => {
    it('- Must correctly determine arrays (isArray)', function () {
        assume(isArray([])).is.true();
        assume(isArray({})).is.false();
        assume(isArray(null)).is.false();
    });

    it('- Must correctly determine keys compatible with arrays (isArrayKey)', function () {
        assume(isArrayKey('')).is.false();
        assume(isArrayKey(' hello-world')).is.false();
        assume(isArrayKey('123')).is.true();
    });

    it('- Must correctly determine objects (isObject)', function () {
        assume(isObject({})).is.true();
        assume(isObject(Object())).is.true();
        assume(isObject(new Object())).is.true();

        assume(isObject([])).is.false();
        assume(isObject(Array(5))).is.false();
        assume(isObject('{}')).is.false();
        assume(isObject(559)).is.false();
        assume(isObject(/.*/gmi)).is.false();
    });
});
