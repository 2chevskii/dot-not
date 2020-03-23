import { describe, it } from 'mocha';
import assume from 'assume';
import hasValue from '../../src/core/accessor';

describe('Accessor tests:', function () {
    describe("'hasValue' tests:", function () {
        it('- Must return true if object contains prop (any type)', function () {
            assume(hasValue({ hello: 'world' }, 'hello')).is.true();
            assume(hasValue({
                foo: {
                    bar: {
                        baz: 42
                    },
                    hello: 'world'
                }
            }, 'foo.bar.baz')).is.true();
        });

        it('- Must return true if object contains prop (strict type)', function () {
            assume(hasValue({ hello: 'world' }, 'hello', 'string')).is.true();
            assume(hasValue({
                foo: {
                    bar: {
                        baz: 42
                    },
                    hello: 'world'
                }
            }, 'foo.bar.baz', 'number')).is.true();
        });

        it('- Must return false if object contains prop, but the type is wrong', function () {
            assume(hasValue({ hello: 'world' }, 'hello', 'object')).is.false();
            assume(hasValue({
                foo: {
                    bar: {
                        baz: 42
                    },
                    hello: 'world'
                }
            }, 'foo.bar.baz', 'string')).is.false();
        });

        it('- Must return false if object does not contain prop', function () {
            assume(hasValue({
                hi: {
                    how: 'are.you.doing'
                }
            }, 'hi.how.are.you.doing')).is.false();

            assume(hasValue({
                foo: 42
            }, 'foo.42', 'number')).is.false();
        });
    });
});
