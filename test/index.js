"use strict";

var expect = require('expect.js'),
    index = require('../index.js'),
    fs = require('fs'),
    path = require('path');

describe('index', function() {
    var output = fs.readFileSync(path.join(__dirname, './infile.txt'), { encoding: 'utf-8' });

    console.log(output);
    it('can get connected monitors', function() {
        expect(index.connected(output)).to.eql(['LVDS-0', 'DP-3']);
    });

    it('can get active monitors', function() {
        expect(index.active(output)).to.eql(['DP-3']);
    });

    it('can convert to binary representation', function() {
        expect(
            index.bin(index.connected(output), index.active(output))
        ).to.eql(1);
        expect(index.bin(['a', 'b', 'c'], ['b'])).to.eql(2);
        expect(index.bin(['a', 'b', 'c'], ['b', 'a'])).to.eql(6);
        expect(index.bin(['a', 'b', 'c'], ['c', 'a'])).to.eql(5);
    });

    it('can get back monitors that were enabled', function() {
        expect(index.unbin(['a', 'b', 'c'], 2)).to.eql(['b']);
        expect(index.unbin(['a', 'b', 'c'], 6)).to.eql(['b', 'a']);
        expect(index.unbin(['a', 'b', 'c'], 5)).to.eql(['c', 'a']);
    });

    it('can get the next permissable number', function() {
        expect(index.next(['a', 'b', 'c'], ['b', 'c'])).to.eql(['a']);
        expect(index.next(['a', 'b', 'c'], ['a', 'b'])).to.eql(['a', 'b', 'c']);
        expect(index.next(['a', 'b', 'c'], ['a', 'b', 'c'])).to.eql(['c']);
    });
});
