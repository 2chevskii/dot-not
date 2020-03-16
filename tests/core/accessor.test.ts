import { describe, it } from 'mocha';
import assume from 'assume';
import accessor from '../../src/core/accessor';

const { getValue, setValue } = accessor;

describe('Set value tests:', function () {
    it('- Properly set value', function () {
        assume(setValue({}, 'foo.bar', 'baz')).eql({ foo: { bar: 'baz' } });
    });
});

// describe('Get value tests:', function () {

// });
