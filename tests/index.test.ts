import { describe, it } from 'mocha';
import assume from 'assume';
import dotnot from '../src/index';

describe('Common tests of exports:', function () {
    it('- Exported object must be an... object...', function () {
        assume(dotnot).is.an('object');
    });

    it('- Exported object must contain a set of functions', function () {
        assume(dotnot).contains('getValue');
        assume(dotnot).contains('setValue');
        assume(dotnot).contains('hasValue');
        assume(dotnot).contains('copyProperty');
        assume(dotnot).contains('moveProperty');
        assume(dotnot).contains('parsePath');
    });
});
