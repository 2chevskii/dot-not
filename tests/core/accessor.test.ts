import { describe, it } from 'mocha';
import assume from 'assume';
import accessor from '../../src/core/accessor';

const {
    hasValue,
    setValue,
    getValue,
    removeProperty,
    copyProperty,
    moveProperty
} = accessor;

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
            const obj = { hello: 'world' };
            assume(setValue(obj, 'hello', 42)).is.true();
            assume(obj).eql({ hello: 42 });
        });

        it('- Must correctly set nested props', function () {
            const obj = {
                foo: {
                    bar: 'baz'
                }
            };
            assume(setValue(obj, 'foo.bar', 'hello')).is.true();
            assume(obj).eql({
                foo: {
                    bar: 'hello'
                }
            });

            // ========================================================

            const obj2 = { foo: {} };

            assume(setValue(obj2, 'foo.bar.baz', 42)).is.true();
            assume(obj2).eql({ foo: { bar: { baz: 42 } } });

            // ========================================================

            const obj3 = {};

            assume(setValue(obj3, '.hello', 'world')).is.true();
            assume(obj3).eql({ '': { hello: 'world' } });

            // ========================================================

            const obj4 = {};

            assume(setValue(obj4, 'foo\\.bar', 'baz')).is.true();
            assume(obj4).eql({ 'foo.bar': 'baz' });
        });

        it('- Must correctly set values in arrays', function () {
            const arr = [];

            assume(setValue(arr, '0', 12)).is.true();
            assume(arr).eql([12]);

            // ========================================================

            const arr2 = [];

            assume(setValue(arr2, '1.baz', 42)).is.true();
            assume(arr2).eql([undefined, { baz: 42 }]);

            // ========================================================

            const obj = { foo: [] };

            assume(setValue(obj, 'foo.0', null, false)).is.true();
            assume(obj).eql({ foo: [null] });
        });

        it('- Must NOT set value to non-object values without force === true', function () {
            const obj = { foo: 42 };
            assume(setValue(obj, 'foo.bar', 42, false)).is.false();
            assume(obj).eql({ foo: 42 });
        });

        it('- Must overwrite value with force === true', function () {
            const obj = { foo: 42 };
            assume(setValue(obj, 'foo.bar', 42, true)).is.true();
            assume(obj).eql({ foo: { bar: 42 } });
        });
    });

    describe("'getValue' tests:", function () {
        it('- Must correctly return values', function () {
            assume(getValue({ foo: { bar: 42 } }, 'foo.bar')).eq(42);

            assume(getValue({ 'rab.oof': { '': { zab: 24 } } }, 'rab\\.oof.')).eql({ zab: 24 });
        });

        it('- Must return undefined when value is... undefined', function () {
            assume(getValue({ foo: 42 }, 'foo.42')).eq(undefined);
        });

        it('- Must set and return default value while it is supplied', function () {
            const obj = { foo: {} };
            assume(getValue(obj, 'foo.bar.baz', 'I love ducks')).eq('I love ducks');
            assume(obj).eql({ foo: { bar: { baz: 'I love ducks' } } });
        });
    });

    describe("'removeProperty' tests:", function () {
        it('- Must remove existing property and return true', function () {
            const obj = { foo: { bar: 'baz' } };

            assume(removeProperty(obj, 'foo.bar')).is.true();
            assume(obj).eql({ foo: {} });

            const arr = [1, 2, 3];

            assume(removeProperty(arr, '1')).is.true();
            assume(arr).eql([1, undefined, 3]);
        });

        it('- Must return false if property does not exist', function () {
            const obj = { obj: { foo: 55 } };
            assume(removeProperty(obj, 'obj.foo.bar')).is.false();
            assume(obj).eql({ obj: { foo: 55 } });

            const arr = [1, 2];
            assume(removeProperty(arr, '3')).is.false();
            assume(arr).eql([1, 2]);
        });
    });

    describe("'copyProperty' tests:", function () {
        it('- Must copy property from one object to another and return true', function () {
            const source = {
                hello: {
                    foo  : 42,
                    world: { bar: 'baz' }
                }
            };
            const target = {};
        });
    });
});
