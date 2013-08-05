PLI Book Details:
=================

Function:
---------

PLI BOOK DETAILS is a GreaseMonkey user script that extracts the Chapter Listings from articles at: `http://www.pli.edu/product/book_detail.asp?*`, then re-formats the information and presents it back to the user as an appended div above the `details` table.


Installation:
-------------

This is a Greasemonkey user script. To install it, you need Greasemonkey 0.8 or later:  Then restart Firefox and open-file the [pli_book_details.user.js](https://github.com/jenkinslaw/pli-bd/raw/master/pli_book_details.user.js).

Greasemokey will automatically detect the user script. Accept the default configuration and install.


To uninstall, go to Tools/Manage User Scripts, select "PLI BOOK DETAILS", and click Uninstall.

Modification:
-------------

In order to modify or add new functionality to the script, you will need to edit the pli_book_details.user.js script file.

Once the file is edited, you need to uninstall the old script and install the new script.

See details above for installation and uninstall process.

This script uses both JQuery and GreaseMonkey technology.

For a detail explanation on JQuery API usage go to http://api.jquery.com
For a detail description of GreaseMonkey go to[ http://wiki.greasespot.net/Main_Page][1]

Things you may need to modify:
-----------------------------

 * The selector for the parsing, i.e.:

    `var auther_selector = "td:has(a):not(:first):not(:last)";`

    The former selector statement reads as:
    "select any 'td' element that has an 'a' element but do not select the 
    first or the last elements of the found set."

    To find out how to build these statements, go to http://docs.jquery.com/Selectors

 * Adding filter keys, i.e.:

    filter[String.fromCharCode(173)] = String.fromCharCode(32)];

    In order to figure out what CharCode to use for a specific symbol,
    you can visit: http://docs.jquery.com/selectors

User input:
----
There is no user input for this script.
Once it is installed the script automatically runs when the user goes to a page the script is supposed to work in.

   [1]: http://wiki.greasespot.net/Main_Page
  
