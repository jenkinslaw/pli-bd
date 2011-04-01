/** @fileoverview 
* This script extracts the Chapter Listings from articles at:
* http://www.pli.edu/product/book_detail.asp?... 
* reformats the information and presents for further use.
* @verstion  0.1 BETA!
* 2009-12-3
* @auther David Kinzer
* Released under the GPL license
* http://www.gnu.org/copyleft/gpl.html
*
* --------------------------------------------------------------------
*
* This is a Greasemonkey user script.  To install it, you need
* Greasemonkey 0.8 or later: http://www.greasespot.net/
* Then restart Firefox and open-file this script.
* Greasemokey wil automatically detect the user script.
* Accept the default configuration and install.
*
* To uninstall, go to Tools/Manage User Scripts,
* select "PLI BOOK DETAILS", and click Uninstall.
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
	
	//remove earlier attempts
	$("#message").empty();
	
	//tag all title text
	var titles = $(".txtbody").prepend(title_prepend);
	
	//tag all auther text
	var authers = $(".txtbody + td").prepend(auther_prepend);
	
	//select all tagged  text
	var OCLC_content = $(".txtbody, .txtbody + td").text();
	
	//prepend OCLC formated text to table for easy access
	$("#prodtabs1").prepend("<div id=\"message\">"+get_OCLC(OCLC_content)+"</div>");
	
	
	/**
	 * Returns OCLC formated string
	 * @param {String} content This is the string we need to validate
	 * @return {String} OCLC_cotent This is the OCLC view formatted string
	 */
	 function get_OCLC(content){
	 
		var content_array = new Array();
		var content_string = new String();
		
		
		if  (content != undefined){
			
			//first turn string to array in order to
			//leverage core javascript array functions
			//and while we're at it - let's filter out content.
			for (i in content){
			
				switch (i){
					case content[i] == '\"' : content_array[i] = '\"';
					default : content_array[i] = content[i];
						
				}
			}
			
			//chop-off a bit from the front and the end of string/array
			content_array = content_array
				.splice(4, (content.length - auther_prepend.length + 1));
				
			
			//convert array to string
			//toString() does not work here because we don't
			//want our string to contain all those extra commas
			for(i in content_array){
				content_string = content_string + content_array[i];
			}
			
			return content_string;
			
		}		
	 
	 }// end fuction get_OCLC
	
	
}());

