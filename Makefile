.PHONY: default test casperjs jshint chrome deploy

default: test

test: casperjs jshint

casperjs:

ifdef CASPERJS
	$(CASPERJS) test tests/
else 
	casperjs test tests
endif

jshint:
	jshint .

CHROMEQUERY = \/\/ @include_jquery
chrome:
	mkdir -p target
	sed -e "/$(CHROMEQUERY)/r vendor/jquery/jquery.min.js" -e "/$(CHROMEQUERY)/d" lib/pli_book_details.user.js > target/pli_book_details.chrome.user.js

deploy: test chrome
	# Deploy the parser.
	cp -f lib/* target
	scp target/* $(PLI_DEPLOY_PATH)
