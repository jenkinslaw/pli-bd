var t = casper.test;
var _root_ = fs.absolute('');

casper.start();

(function(){
  "use strict";

  t.begin("Test page accessible.", 1, function(){
    casper.open(_root_ + '/tests/includes/test1.html').then(function() {
      t.pass("The page is accessible via GET.")
    });
    casper.run(function(){t.done();});
  });

}());
