var t              = casper.test;
var system         = require('system');
var _root_         = casper.cli.get('_root_');
var Test           = function(){};

t.begin("Test PLI parser", 1, function(test){
  "use strict";

  casper.start('/home/vagrant/pli-bd/tests/includes/test1.html', function(){
  });


  casper.run(function(){test.done();});

});

