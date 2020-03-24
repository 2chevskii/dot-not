import { describe, it } from 'mocha';
import assume from 'assume';
import * as dotnot from '../src/index';

describe('Common tests of exports:', function () {
    it('- Exported object must be an... object...', function () {
        assume(dotnot).is.an('object');
    });

    it('- Exported object must contain a set of functions', function () {
        assume(dotnot).contains('get');
        assume(dotnot).contains('set');
        assume(dotnot).contains('has');
        assume(dotnot).contains('copy');
        assume(dotnot).contains('move');
        assume(dotnot).contains('remove');
        assume(dotnot).contains('parse');
    });
});
