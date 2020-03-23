import { describe, it } from 'mocha';
import assume from 'assume';
import accessor from '../../src/core/accessor';

const { hasValue, setValue } = accessor;

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

    describe("'setValue' tests:", function () {
        it("- Must correctly set prop :: { hello: 'world' } & 'hello' = 42 -> { hello: 42 }", function () {
            assume(setValue({ hello: 'world' }, 'hello', 42)).eql({ hello: 42 });
        });

        it('- Must correctly set nested props', function () {
            assume(setValue({
                foo: {
                    bar: 'baz'
                }
            }, 'foo.bar', 'hello')).eql({
                foo: {
                    bar: 'hello'
                }
            });

            assume(setValue({ foo: {} }, 'foo.bar.baz', 42)).eql({ foo: { bar: { baz: 42 } } });

            assume(setValue({}, '.hello', 'world')).eql({ '': { hello: 'world' } });

            assume(setValue({}, 'foo\\.bar', 'baz')).eql({ 'foo.bar': 'baz' });
        });

        it('- Must correctly set values in arrays', function () {
            assume(setValue([], '0', 12)).eql([12]);

            assume(setValue([], '1.baz', 42)).eql([undefined, { baz: 42 }]);

            assume(setValue({ foo: [] }, 'foo.0', null));
        });

        it('- Must NOT set value to non-object values without force === true', function () {
            assume(setValue({ foo: 42 }, 'foo.bar', 42, false)).eql({ foo: 42 });
        });

        it('- Must overwrite value with force === true', function () {
            assume(setValue({ foo: 42 }, 'foo.bar', 42, true)).eql({ foo: { bar: 42 } });
        });
    });
});
