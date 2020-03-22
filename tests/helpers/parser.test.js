import { describe, it } from 'mocha';
import assume from 'assume';
import parse from '../../src/helpers/parser';

describe('Parser tests:', function () {
    it("- Parse simple path :: 'foo.bar.baz.42' -> [ foo, bar, baz, 42 ]", function () {
        assume(parse('foo.bar.baz.42')).eql(['foo', 'bar', 'baz', '42']);
    });

    it("- Parse escaped path :: 'foo\\.bar.\\\\.baz\\.\\..42' -> [ foo.bar, \\.baz.., 42]", function () {
        assume(parse('foo\\.bar.\\\\.baz\\.\\..42')).eql(['foo.bar', '\\', 'baz..', '42']);
    });

    it("- Parse unusual path :: '   .foo. .bar..\\..baz' -> [ '   ', foo, ' ', bar, '', '.', baz ]", function () {
        assume(parse('   .foo. .bar..\\..baz')).eql(['   ', 'foo', ' ', 'bar', '', '.', 'baz']);
    });
});
