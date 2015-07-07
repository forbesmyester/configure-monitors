"use strict";

var R = require('ramda');

var extractName = function(m) {
    return m.replace("\n", '').split("\n")[0].replace(/\s.*/, '');
};

var connected = function(str) {
    return str.match(/\n\S+\sconnected/g).map(extractName);
};

var active = function(str) {
    return str.match(/\n\S+\sconnected.*(\n\s+.*\*)+/g).map(extractName);
};

var bin = function(connectedSet, activeSet) {
    var r = 0;
    for (var i = 0; i < connectedSet.length; i++) {
        r = r << 1;
        if (R.indexOf(connectedSet[i], activeSet) > -1) {
            r = r | 1;
        }
    }
    return r;
};

var unbin = function(connectedSet, n) {
    var r = [];
    for (var i = connectedSet.length - 1; i >= 0; i--) {
        if (n & 1) {
            r.push(connectedSet[i]);
        }
        n = n >> 1;
    }
    return r;
};

var max = function(connectedSet) {
    return bin(connectedSet, connectedSet);
};

var next = function(connectedSet, activeSet) {
    var r = bin(connectedSet, activeSet) + 1;
    if (r > max(connectedSet)) {
        return R.sortBy(R.identity, unbin(connectedSet, 1));
    }
    return R.sortBy(R.identity, unbin(connectedSet, r));
};

module.exports = {
    connected: connected,
    active: active,
    bin: bin,
    unbin: unbin,
    next: next
};

