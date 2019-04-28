var assert = require('assert');
describe('Fake Test', function() {
  describe('#This is a Fake Test Function', function() {
    it('Fake Tests Pass', function() {
      assert.equal([1, 2, 3].indexOf(4), -1);
    });
  });
});