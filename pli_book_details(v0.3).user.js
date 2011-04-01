/** @fileoverview 
* This script extracts the Chapter Listings from articles at:
* http://www.pli.edu/product/book_detail.asp?... 
* reformats the information and presents for further use.
* @verstion  0.3 BETA!
* 2009-12-3
* @auther by David Kinzer
* Released under the GPL license
* http://www.gnu.org/copyleft/gpl.html
*
* --------------------------------------------------------------------
*
* This is a Greasemonkey user script.  To install it, you need
* Greasemonkey 0.8 or later: http://greasemonkey.mozdev.org/
* Then restart Firefox and revisit this script.
* Under Tools, there will be a new menu item to "Install User Script".
* Accept the default configuration and install.
*
* To uninstall, go to Tools/Manage User Scripts,
* select "Hello World", and click Uninstall.
*
* --------------------------------------------------------------------
*
// ==UserScript==
// @name          PLI BOOK DETAILS
// @namespace     http://jenkinslaw.org
// @description   Extract Chapter Listings from PLI Book Details
// @include       http://www.pli.edu/product/book_detail.asp*
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js

// ==/UserScript==
*/
(function() {
    // This will be executed onLoad
	var title_prepend = "_title_prepend_";
	var auther_prepend = " / &#450;r ";
	var title_selector = ".txtbody:not(:first):not(:last)";
	var auther_selector = "td:has(a):not(:first):not(:last)";
	
	//tag all title text
	var titles = $(title_selector).prepend(title_prepend);
	
	//tag all auther text
	var authers = $(auther_selector).prepend(auther_prepend);
	
	//select all tagged  text
	var OCLC_content = $(title_selector + ", " + auther_selector).text();
	
	//prepend OCLC formated text to table for easy access
	$("#prodtabs1")
		.prepend("<div class=\"even\">"+get_OCLC(OCLC_content)+"</div>");
		
		
		
	
	/**
	 * Returns OCLC formatted string
	 * @param {String} content This is the string we need to validate
	 * @return {String} OCLC_cotent This is the OCLC view formatted string
	 */
	 function get_OCLC(content){
	 
		var OCLC_string = new String();
		var filter = new Array();
		
		//add any filters we need here
		// as a filter[key] = value pair
		//use charcodes or you'll run into troubles
		filter[String.fromCharCode(45)] = String.fromCharCode(32);
		filter[String.fromCharCode(173)] = String.fromCharCode(32);
		filter[String.fromCharCode(8208)] = String.fromCharCode(32);
		filter[String.fromCharCode(8209)] = String.fromCharCode(32);
		filter[String.fromCharCode(8231)] = String.fromCharCode(32);
		filter["_title_prepend_"] = String.fromCharCode(32, 45, 45, 450, 116);
		filter[String.fromCharCode(167)] = " sec. ";
		filter[String.fromCharCode(182)] = " sec. ";
	
		
		if  (content != undefined){
			
			OCLC_string = content;

			//filter the string
			for(key in filter){
				var reg = new RegExp(key, "g");
				OCLC_string = OCLC_string.replace(reg, filter[key]);
				
			}
			
			//Chop a little from the front
			OCLC_string = OCLC_string.slice(3);
			
			
			return OCLC_string;
			
		}		
	 
	 }// end fuction get_OCLC
	
	
}());

