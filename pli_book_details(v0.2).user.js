/** @fileoverview 
* This script extracts the Chapter Listings from articles at:
* http://www.pli.edu/product/book_detail.asp?... 
* reformats the information and presents for further use.
* @verstion  0.2 BETA!
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
	var title_prepend = " -- &#450;t ";
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
		filter["key1"] = "value1";
		filter["key2"] = "value2";	
		
		if  (content != undefined){
			
			//chop-off a bit from the front
			OCLC_string = content.slice(4);

			//filter the string
			for(key in filter){
				OCLC_string = OCLC_string.replace(key, filter[key]);
			}
			
			return OCLC_string;
			
		}		
	 
	 }// end fuction get_OCLC
	
	
}());

