<?php
/**
 * @file
 * This script  works in conjunction with  the AJAX call
 * from pli_book_details.user.js GreaseMonkey script in order
 * to extract the Chapter Listings from articles at:
 * http://www.pli.edu/product/book_detail.asp*...
 * Reformats the information and presents for further use.
 *
 * @author by David Kinzer
 * Released under the GPL license
 * http://www.gnu.org/copyleft/gpl.html
 *
 * --------------------------------------------------------------------
 * For an example of the type of document we are parsing see:
 * ./pli_text_example.txt
 *
 * The overall approach I took to parse the file is to
 *
 * 1. Download the PDF file from pli website
 * 2. Import all the text from the file into an array of strings
 * 3. Parse the array and generate a string with the chapter titles and
 *    and authors tagged.
 * 4. Return this string to the pli_book_details.user.js script.
 *    to complete the AJAX call.
 * --------------------------------------------------------------------
 */


// Get the url to use. We escapeshellcmd because
// we use system calls to download the pdf file
// and to get the text from the pdf.
$material_url = pli_url_validate($_REQUEST['material_url']);

/**
 * Returns the validated URL or FALSE.
 */
function pli_url_validate($url) {
  $pattern = '/^(([\w]+:)?\/\/)?(([\d\w]|%[a-fA-f\d]{2,2})+(:([\d\w]|%[a-fA-f\d]{2,2})+)?@)?([\d\w][-\d\w]{0,253}[\d\w]\.)+[\w]{2,4}(:[\d]+)?(\/([-+_~.\d\w]|%[a-fA-f\d]{2,2})*)*(\?(&amp;?([-+_~.\d\w]|%[a-fA-f\d]{2,2})=?)*)?(#([-+_~.\d\w]|%[a-fA-f\d]{2,2})*)?$/';

  $valid_url = preg_match($pattern, $url);

  if ($valid_url) {
    return $url;
  }
  return FALSE;
}

if ($material_url) {
  // Get the text.
  $pli_text_array = get_pdf_text($material_url);

  // Parse the array.
  $chunks = chunck_contents($pli_text_array);

  $chapter_chunks = get_chapter_chunks($chunks);

  if (!empty($chapter_chunks)) {
    $titles_and_authers = parse_chunks($chapter_chunks);
  }
}

// Return the parsed string to the caller.
if (!empty($titles_and_authers)) {
  echo $titles_and_authers;
}
else {
  echo "<br />The application could not parse content from this document.";
}


/**
 * Gets the all the text from a PDF file when given the URL.
 *
 * @param String $material_url
 *   URL of the pdf we need the text from
 *
 * @return array
 *   An array of strings containing each line of text in the PDF
 * @todo test that the URL given is valid.
 */
function get_pdf_text($material_url) {

  $path = get_pdf_path($material_url);

  // Use pdftotext program to get all the text from.
  exec("pdftotext -layout $path -",
  $pli_text_array, $pdftotext_status);

  return $pli_text_array;

}

/**
 * Gets the PDF and returns the path.
 *
 * Returns a test file path by default.
 */
function get_pdf_path($material_url) {
  $path = 'tests/includes/test.pdf';
  if (pli_url_validate($material_url)) {
    // Use url to wget the pdf file.
    $path = '/tmp/pli.pdf';
    system("wget -O $path $material_url", $wget_status);
  }
  return $path;
}


/**
 * Generates an array of string arrays (Chunks)...
 *
 * from one string array such that the Chunks are defined
 * as the strings that lie between white space
 *
 * Example:
 * $array = array("123", "456", " ", "789", "10");
 * chunk_contetns($array);
 *
 * returns array(array("123", "465"), array("789", "10"));
 *
 *
 * @param array $contents
 *   An array of strings
 *
 * @return array
 *   of Chunks;
 */
function chunck_contents($contents = array()) {

  $chunks = array();

  if (!is_array($contents)) {
    return $chunks;
  }

  if (!_has_empty_lines($contents)) {
    return $contents;
  }

  // Push an empty value on the last part of the array to return all lines.
  array_push($contents, '');
  $i = 0;
  $j = 0;
  $chunk = array();

  foreach ($contents as $line) {

    if (!_is_blank($line)) {
      $chunk[$i] = trim($line);
      $i++;
    }
    else {
      if (!empty($chunk)) {
        $chunks[$j] = $chunk;
        $j++;
      }
      unset($chunk);
      $i = 0;
    }
  }

  return $chunks;
}

/**
 * Checks if an array has any blank values.
 */
function _has_empty_lines($contents = array()) {
  $has_empty_lines = FALSE;
  if (is_array($contents)) {
    foreach ($contents as $line) {
      if (_is_blank($line)) {
        $has_empty_lines = TRUE;
        break;
      }
    }
  }
  return $has_empty_lines;
}

/**
 * Checks that a line is blank or not.
 */
function _is_blank($line = '') {
  (String) $line;
  $match = 1 === preg_match('/^\s*$/', $line);
  return $match;
}


/**
 * Filters out the Chunks that do not contain the Chapter title.
 *
 * @param Array $chunks
 *   An array of string arrays
 *
 * @return Array
 *   Chunks that contain chapter titles
 */
function get_chapter_chunks($chunks = array()) {

  $chapter_chunks = array();

  if (!is_array($chunks)) {
    return $chapter_chunks;
  }

  // In this case I noticed that the chapter chunks are
  // all arrays of multiple lines.
  $i = 0;

  foreach ($chunks as $chunk) {

    if (count($chunk) > 1) {
      // Check that the first or the second line contain /[0-9]+\./.
      $match1 = preg_match('/[0-9]+\./', $chunk[0]);
      $match2 = preg_match('/[0-9]+\./', $chunk[1]);

      // If the first line is not a title, get rid of it.
      if ($match2) {
        array_shift($chunk);
      }

      // If the first or the second line match a title, add this chunk of lines.
      if ($match1 || $match2) {
        $chapter_chunks[$i] = $chunk;
        $i++;
      }
    }
  }

  return $chapter_chunks;
}


/**
 * Return a string that's been parsed for chapter titles and authors.
 *
 * Given an array of Chapter Chunks.
 */
function parse_chunks($chapter_chunks = array()) {

  $output = '';

  if (!is_array($chapter_chunks)) {
    return $output;
  }

  foreach ($chapter_chunks as $chunk) {

    foreach ($chunk as $line) {
      // Replace page number lines.
      $output .= preg_replace('/\.+.*[0-9]+/', "_author_prepend_", $line);
      $output .= ' ';
    };

  }

  $titles = preg_replace('/\d+\.\s*([A-Z]+)/', '_title_prepend_ $1', $output);

  return trim($titles);
}
