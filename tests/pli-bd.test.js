/*global title_prepend phantom, pli_bd*/

var t = casper.test;
var _root_ = fs.absolute('');
casper.options.clientScripts = [
  'vendor/jquery/jquery.min.js',
  'lib/pli_book_details.user.js'
]

// TODO: Check how if I can do without the following injection.
phantom.injectJs(_root_ + '/vendor/jquery/jquery.min.js');
phantom.injectJs(_root_ + '/lib/pli_book_details.user.js');

casper.start();

(function(){
  "use strict";

  casper.start();

  t.begin("Test page accessible.", 1, function(){
    casper.open(_root_ + '/tests/includes/test1.html').then(function() {
      t.pass("The page is accessible via GET.")
    });
    casper.run(function(){t.done();});
  });

  t.begin("Test title selector.", 1, function(){
    casper.open(_root_ + '/tests/includes/test1.html').then(function() {
      var actual = casper.evaluate(function(){
        return $(pli_bd.title_selector).length;
      });

      t.assertEqual(actual, 42, "The title selector is working as expected.");

    });

    casper.run(function(){t.done();});
  });

  t.begin("Test title prepend.", 1, function(){
    casper.open(_root_ + '/tests/includes/test1.html').then(function() {
      var actual = casper.evaluate(function(){
        var pattern = pli_bd.title_prepend
        return $(pli_bd.title_selector).first().text().match(pattern).length;
      });

      t.assertEqual(actual, 1, "Check that the title is being prepended with: " + pli_bd.title_prepend);

    });

    casper.run(function(){t.done();});
  });

  t.begin("Test author selector.", 1, function(){
    casper.open(_root_ + '/tests/includes/test1.html').then(function() {
      var actual = casper.evaluate(function(){
        return $(pli_bd.author_selector).length;
      });

      t.assertEqual(actual, 42, "The author selector is working as expected.");

    });

    casper.run(function(){t.done();});
  });

  t.begin("Test author prepend.", 1, function(){
    casper.open(_root_ + '/tests/includes/test1.html').then(function() {
      var actual = casper.evaluate(function(){
        var pattern = pli_bd.author_prepend
        return $(pli_bd.author_selector).first().text().match(pattern).length;
      });

      t.assertEqual(actual, 1, "Check that the author is being prepended with: " + pli_bd.author_prepend);

    });

    casper.run(function(){t.done();});
  });




}());
