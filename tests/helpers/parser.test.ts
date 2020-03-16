import { describe, it } from 'mocha';
import assume from 'assume';
import parse from '../../src/helpers/parser';

describe('Parser tests:', function () {
    it('- Properly parse simple path', function () {
        const parseResult = parse('part1.part2.part3');
        assume(parseResult).length(3);
        assume(parseResult).eql(['part1', 'part2', 'part3']);
    });

    it('- Properly parse escaped path', function () {
        const parseResult = parse('part1\\.part2.part3');
        assume(parseResult).length(2);
        assume(parseResult).eql(['part1.part2', 'part3']);
    });

    it('- Properly parse partially incorrect paths', function () {
        const parseResult = parse('part1..part2');
        assume(parseResult).length(2);
        assume(parseResult).eql(['part1', 'part2']);
        assume(parse('..part1')).not.empty();
    });

    it('- Return empty on incorrect paths', function () {
        assume(parse('....')).empty();
        assume(parse('  ')).empty();
    });
});
