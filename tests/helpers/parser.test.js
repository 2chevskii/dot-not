import { describe, it } from 'mocha';
import assume from 'assume';
import parse from '../../src/helpers/parser';

describe('Parser tests:', function () {
    it("- Throw error when path is not a string :: typeof path !== 'string' -> Exception: Path must be a string.", function () {
        // @ts-ignore
        assume(function () { parse(null); }).throws('Path must be a string.');
        // @ts-ignore
        assume(function () { parse(undefined); }).throws('Path must be a string.');
        // @ts-ignore
        assume(function () { parse(42); }).throws('Path must be a string.');
        // @ts-ignore
        assume(function () { parse({}); }).throws('Path must be a string.');
        // @ts-ignore
        assume(function () { parse(function () { }); }).throws('Path must be a string.');
        // @ts-ignore
        assume(function () { parse([]); }).throws('Path must be a string.');
    });

    it("- Parse simple path :: 'foo.bar.baz.42' -> [ foo, bar, baz, 42 ]", function () {
        assume(parse('foo.bar.baz.42')).eql(['foo', 'bar', 'baz', '42']);
    });

    it("- Parse escaped path :: 'foo\\.bar.\\\\.baz\\.\\..42' -> [ foo.bar, \\.baz.., 42]", function () {
        assume(parse('foo\\.bar.\\\\.baz\\.\\..42')).eql(['foo.bar', '\\', 'baz..', '42']);
    });

    it("- Parse unusual path :: '   .foo. .bar..\\..baz' -> [ '   ', foo, ' ', bar, '', '.', baz ]", function () {
        assume(parse('   .foo. .bar..\\..baz')).eql(['   ', 'foo', ' ', 'bar', '', '.', 'baz']);
    });

    it("- Parse empty path :: '' -> [ '' ]; ' ' -> [ ' ' ]", function () {
        assume(parse('')).eql(['']);
        assume(parse(' ')).eql([' ']);
    });

    it("- Parse nested empty path :: '.' -> [ '', '' ]; ' .' -> [ ' ', '' ]", function () {
        assume(parse('.')).eql(['', '']);
        assume(parse(' .')).eql([' ', '']);
    });
});
