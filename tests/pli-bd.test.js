/*global title_prepend, phantom, pli_bd*/

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

  casper.open(_root_ + '/tests/includes/test1.html')
  .then(function() {

    t.begin("Test page accessible.", 1, function(){
      t.pass("The page is accessible via GET.")
      casper.run(function(){t.done();});
    });

    t.begin("Test title selector.", 1, function(){
      var actual = casper.evaluate(function(){
        return $(pli_bd.title_selector).length;
      });
      t.assertEqual(actual, 42, "The title selector is working as expected.");

      casper.run(function(){t.done();});
    });

    t.begin("Test title prepend.", 1, function(){
      var actual = casper.evaluate(function(){
        var pattern = pli_bd.title_prepend
        return $(pli_bd.title_selector).first().text().match(pattern).length;
      });

      t.assertEqual(actual, 1, "The title is being prepended with: " + pli_bd.title_prepend);
      casper.run(function(){t.done();});
    });

    t.begin("Test author selector.", 1, function(){
      var actual = casper.evaluate(function(){
        return $(pli_bd.author_selector).length;
      });
      t.assertEqual(actual, 42, "The author selector is working as expected.");
      casper.run(function(){t.done();});
    });

    t.begin("Test author prepend.", 1, function(){
      var actual = casper.evaluate(function(){
        var pattern = pli_bd.author_prepend
        return $(pli_bd.author_selector).first().text().match(pattern).length;
      });
      t.assertEqual(actual, 1, "The author is being prepended with: " + pli_bd.author_prepend);
      casper.run(function(){t.done();});
    });

    t.begin("The Description element exits.", 1, function(){
      t.assertExists('.Description', "The .Description element exists.");
    });

    t.begin("Test OCLE content is generated.", 1, function(){
      var content = casper.evaluate(function(){
        return pli_bd.OCLC_content;
      });
      t.assert(content !== '', "The OCLC content string is not empty.");

      casper.run(function(){t.done();});

      t.begin("Test Grease Monkey Element added.", 1, function(){
        casper.open(_root_ + '/tests/includes/test1.html')
        .then(function() {
          t.assertExists('.greasemonkey', "The Grease Monkey element has been added.");
        });

        casper.run(function(){t.done();});
      });

      t.begin("Test PDF link selector.", 2, function(){
        var actual = casper.evaluate(function(){
          return $(pli_bd.article_href_selector).length;
        });
        t.assertEqual(actual, 1, "The PDF link selector works as expected.");
        actual = casper.evaluate(function(){
          return pli_bd.material_url;
        });
        t.assertEqual(actual,
        "/product_files/EN00000000159335/111786.pdf", "The link is returned.");
        casper.run(function(){t.done();});
      });

      t.begin("Test detail link.", 2, function(){
        var actual = casper.evaluate(function() {
          return $('a[href=#DetailTab2]').length;
        });
        t.assertEqual(actual, 1, "The detail link is present.");

        actual = casper.evaluate(function() {
          return $('li.ui-tabs-selected:has(a[href=#DetailTab2])').length;
        });
        t.assertEqual(actual, 1, "The detail tab is selected.");

        casper.run(function(){t.done();});
      });

    });

  });
  casper.run(function(){t.done();});

}());
