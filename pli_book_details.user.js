/**
 * @fileoverview This script extracts the Chapter Listings from articles at:
 *               http://www.pli.edu/product/book_detail.asp?... reformats the
 *               information and presents for further use.
 * @verstion 0.5 2010-5
 * @auther by David Kinzer Released under the GPL license
 *         http://www.gnu.org/copyleft/gpl.html
 * 
 * --------------------------------------------------------------------
 * 
 * This is a Greasemonkey user script. To install it, you need Greasemonkey 0.8
 * or later: http://greasemonkey.mozdev.org/ Then restart Firefox and revisit
 * this script. Under Tools, there will be a new menu item to "Install User
 * Script". Accept the default configuration and install.
 * 
 * To uninstall, go to Tools/Manage User Scripts, select "Hello World", and
 * click Uninstall.
 * 
 * --------------------------------------------------------------------
// ==UserScript==
// @name PLI BOOK DETAILS
// @namespace http://jenkinslaw.org
// @description Extract Chapter Listings from PLI Book Details
// @include http://www.pli.edu/product/book_detail.asp*
// @include http://www.pli.edu/*
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js
// ==UserScript==
 */
(function() {

  // This will be executed onLoad
  var title_prepend = "_title_prepend_";
  var auther_prepend = "_auther_prepend_";
  var title_selector = "td.toc-description:not(:first):not(:last)";
  var auther_selector = "td.toc-faculty:has(a)";
  
  // tag all title text
  var titles = $(title_selector).prepend(title_prepend);
  // tag all auther text
  var authers = $(auther_selector).prepend(auther_prepend);
  
  // select all tagged text
  var OCLC_content = $(title_selector + ", " + auther_selector).text();
  
  // prepend OCLC formated text to table for easy access
  $(".Description").prepend(
      "<div class=\"greasemonkey\" bgcolor=\"green\">" + get_OCLC(OCLC_content) + "</div>");
  
  // Once we are done with parsing the page, parse the pdf link:
  
  // Define a selector for elements "a" who are decendants 
  // of elements with class ="left"
  var article_href_selector = ".left a:first";
  
  // get the pdf's url
   var material_url = $(article_href_selector).attr("href");
   //alert(material_url);
   if (material_url) {
     make_ajax();
   }
   
  
  /**
   * Returns OCLC formatted string
   * 
   * @param {String}
   *          content This is the string we need to validate
   * @return {String} OCLC_cotent This is the OCLC view formatted string
   */
  function get_OCLC(content) {
    
    var OCLC_string = new String();
    var filter = new Array();
    
    // add any filters we need here
    // as a filter[key] = value pair
    // use charcodes or you'll run into troubles
    filter[String.fromCharCode(45)] = String.fromCharCode(32);
    filter[String.fromCharCode(173)] = String.fromCharCode(32);
    filter["_title_prepend_"] = String.fromCharCode(32, 45, 45, 450, 116, 32);
    filter["_auther_prepend_"] = String.fromCharCode(32, 47, 32, 450, 114, 32);
    filter[String.fromCharCode(167)] = " sec. ";
    filter[String.fromCharCode(182)] = " sec. ";
    filter[String.fromCharCode(32)] = String.fromCharCode(32);
    filter['Chapter [0-9]*:'] = '';
    
    if (content != undefined) {
      
      // remove any character that is not ascii
      for (i in content) {
        if (content.charCodeAt(i) <= 127) {
          OCLC_string += content[i];
        } else {
          OCLC_string += " ";
        }
        
      }
      
      // remove _auther_prepend when there are no authers
      var reg = new RegExp("_auther_prepend__title_prepend_", "g");
      OCLC_string = OCLC_string.replace(reg, "_title_prepend_");
      
      // filter the string with our filter
      for (key in filter) {
        var reg = new RegExp(key, "g");
        OCLC_string = OCLC_string.replace(reg, filter[key]);
        
      }
      
      // remove first two dashes from the front of string
      OCLC_string = OCLC_string.replace('--', '');
      
      // remove the last author tag from end of string when by itself:
      var reg = RegExp(String.fromCharCode(32, 47, 32, 450, 114, 32, 36));
      OCLC_string = OCLC_string.replace(reg, '');
      
      return OCLC_string;
      
    }
    
  }// end fuction get_OCLC
  
  function make_ajax() {
    
    // Make AJAX call to parse_pli_pdf.php
    GM_xmlhttpRequest( {
      method : "POST",
      url : "http://intranet.jenkinslaw.org/jac/pli_pdf/parse_pli_pdf.php",
      data : "material_url=" + material_url,
      headers : {
        "Content-Type" : "application/x-www-form-urlencoded"
      },
      onload : function(response) {
        
        if (response.status == 200) {
          
          var parsed_response = get_OCLC(response.responseText);
          // Prepend OCLC formated text to table for easy access.
      $("#prodtabs1").prepend(
          "<div style=\"background-color:#00FF00\">" + parsed_response
              + "</div>");
      
    }
    
    /*
     * use for debugging GM_log([ response.status, response.statusText,
     * response.readyState, response.responseHeaders, response.responseText,
     * response.finalUrl, response.responseXML ].join("\n"));
     */

  }
    });
  }// end of make_ajax

}());
