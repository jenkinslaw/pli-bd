var t              = casper.test;
var system         = require('system');
var testDir        = casper.cli.get('testDir');
var Test           = function(){};

(function(){
  "use strict";
  Test.PLI = function(casper) {
    t.comment('-------------------------------------');
    t.comment('Test the PLI page parser.');
    t.comment('-------------------------------------');
    t.comment('');

    casper.open(testDir + '/includes/Vie').then(function() {
      Test.PLI(this);
    });

  };

}());

