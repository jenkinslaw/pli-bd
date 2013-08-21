// ==UserScript==
// @name PLI BOOK DETAILS
// @namespace http://jenkinslaw.org
// @description Extract Chapter Listings from PLI Book Details
// @downloadURL https://github.com/jenkinslaw/pli-bd/raw/master/lib/pli_book_details.user.js
// @include http://www.pli.edu/product/book_detail.asp*
// @include http://www.pli.edu/*
// @grant GM_xmlhttpRequest
// @require http://code.jquery.com/jquery-2.0.3.min.js
// @version 0.6.3
// ==/UserScript==

/**
* @fileoverview This script extracts the Chapter Listings from articles at:
*               http://www.pli.edu/product/book_detail.asp?... reformats the
*               information and presents for further use.
* @auther by David Kinzer Released under the GPL license
*         http://www.gnu.org/copyleft/gpl.html
*
* --------------------------------------------------------------------
*
* This is a Greasemonkey user script. To install it, you need Greasemonkey 0.9
* or later: http://greasemonkey.mozdev.org/ Then restart Firefox and revisit
* this script. Under Tools, there will be a new menu item to "Install User
* Script". Accept the default configuration and install.
*
* To uninstall, go to Tools/Manage User Scripts, select "PLI Book Details", and
* click Uninstall.
*
* --------------------------------------------------------------------
*/

// @include_jquery

var pli_bd = function(){};

(function() {
  "use strict";

  // This will be executed onLoad.
  pli_bd.title_prepend = "_title_prepend_";
  pli_bd.author_prepend = "_author_prepend_";
  pli_bd.title_selector = "td.toc-description:not(:first):not(:last)";
  pli_bd.author_selector = "td.toc-faculty:has(a)";

  // Tag all title text.
  $(pli_bd.title_selector).prepend(pli_bd.title_prepend);

  // Tag all auther text.
  $(pli_bd.author_selector).prepend(pli_bd.author_prepend);

  // Select all tagged text.
  pli_bd.OCLC_content = $(pli_bd.title_selector + ", " + pli_bd.author_selector).text();

  // Prepend OCLC formated text to table for easy access.
  $(".Description")
  .prepend("<div class=\"greasemonkey\" bgcolor=\"green\">" +
    get_OCLC(pli_bd.OCLC_content) + "</div>");

  // Once we are done with parsing the page, parse the pdf link:
  pli_bd.article_href_selector = ".CourseHandBookOverview a:eq(1)";
  pli_bd.material_url = $(pli_bd.article_href_selector)
  .attr("href");

  // Bring the details tab into focus.
  $('a[href=#DetailTab2]').click();
  $('li:has(a[href=#DetailTab2])')
  .addClass('ui-tabs-selected ui-state-active');
 
  if (pli_bd.material_url) {
    if (GM_xmlhttpRequest !== undefined) {
      make_ajax();
    }
  }


  /**
  * Returns OCLC formatted string
  *
  * @param {String}
  *          content This is the string we need to validate
  * @return {String} OCLC_cotent This is the OCLC view formatted string
  */
  function get_OCLC(content) {

    var OCLC_string = '';
    var filter = [];

    // Add any filters we need here as a filter[key] = value pairs.
    // Use charcodes or you'll run into troubles.
    filter[String.fromCharCode(45)] = String.fromCharCode(32);
    filter[String.fromCharCode(173)] = String.fromCharCode(32);
    filter._title_prepend_ = String.fromCharCode(32, 45, 45, 450, 116, 32);
    filter._author_prepend_ = String.fromCharCode(32, 47, 32, 450, 114, 32);
    filter[String.fromCharCode(167)] = String.fromCharCode(32, 115, 101, 99, 46, 32);
    filter[String.fromCharCode(182)] = String.fromCharCode(32, 115, 101, 99, 46, 32);
    filter[String.fromCharCode(32)] = String.fromCharCode(32);
    filter['Chapter [0-9]*:'] = String.fromCharCode(32);

    if (content !== undefined) {

      // Remove any character that is not ASCII.
      for (var character in content) {
        if (content.charCodeAt(character) <= 127) {
          OCLC_string += content[character];
        } else {
          OCLC_string += " ";
        }

      }

      // Remove _author_prepend when there are no authors.
      var reg = new RegExp("_author_prepend__title_prepend_", "g");
      OCLC_string = OCLC_string.replace(reg, "_title_prepend_");

      // Filter the string with our filter.
      for (var key in filter) {
        reg = new RegExp(key, "g");
        OCLC_string = OCLC_string.replace(reg, filter[key]);

      }

      // Remove first two dashes from the front of string.
      OCLC_string = OCLC_string.replace('--', '');

      // Remove the last author tag from end of string when by itself:
      reg = new RegExp(String.fromCharCode(32, 47, 32, 450, 114, 32, 36));
      OCLC_string = OCLC_string.replace(reg, '');

      return OCLC_string;

    }
  }

  function make_ajax() {

    // Make AJAX call to parse_pli_pdf.php
    var ajax_call = new GM_xmlhttpRequest({
      method : "POST",
      url : "http://intranet.jenkinslaw.org/jac/pli_pdf/parse_pli_pdf.php",
      data : "material_url=" + pli_bd.material_url,
      headers : {
        "Content-Type" : "application/x-www-form-urlencoded"
      },
      onload : function(response) {

        if (response.status === 200) {

          var parsed_response = get_OCLC(response.responseText);
          // Prepend OCLC formated text to table for easy access.
          $("#prodtabs1").prepend(
            "<div style=\"background-color:#00FF00\">" + parsed_response +
          "</div>");

        }

        /*
        * Use for debugging GM_log([ response.status, response.statusText,
        * response.readyState, response.responseHeaders, response.responseText,
        * response.finalUrl, response.responseXML ].join("\n"));
        */

      }
    });

  }

}());
