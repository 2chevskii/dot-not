import { describe, it } from 'mocha';
import assume from 'assume';
import accessor from '../../src/core/accessor';

const { getValue, setValue } = accessor;

describe('Set value tests:', function () {
    it('- Properly set value for correct path', function () {
        assume(setValue({}, 'foo.bar', 'baz')).eql({ foo: { bar: 'baz' } });
    });

    it('- Properly set value for escaped path', function () {
        assume(setValue({}, 'foo\\.bar', 'baz')).eql({ 'foo.bar': 'baz' });
    });

    it('- Properly set value for partially incorrect path', function () {
        assume(setValue({}, 'foo....bar', 'baz')).eql({ foo: { bar: 'baz' } });
    });

    it('- Initialize object from null and set value', function () {
        assume(setValue(null, 'foo.bar', 'baz')).eql({ foo: { bar: 'baz' } });
    });

    it('- Do not set values for incorrect paths', function () { // wrong test description
        assume(setValue(null, '..', 'hello')).eq(null);
        assume(setValue({}, ' . ', 'hello')).eql({
            ' ': {
                ' ': 'hello'
            }
        });
    });
});

describe('Get value tests:', function () {
    it('- Properly retrieve values from objects', function () {
        assume(getValue({
            foo: {
                bar: 42
            }
        }, 'foo.bar')).eq(42);
    });
});
