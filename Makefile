.PHONY: default test casperjs jshint chrome deploy phpunit install-phantomjs install-casperjs

default: test

test: casperjs jshint phpunit

casperjs:

ifdef CASPERJS
	$(CASPERJS) test tests/
else 
	casperjs test tests
endif

jshint:
	jshint .

phpunit:
	phpunit --colors tests/*.test

CHROMEQUERY = \/\/ @include_jquery
chrome:
	mkdir -p target
	sed -e "/$(CHROMEQUERY)/r vendor/jquery/jquery.min.js" -e "/$(CHROMEQUERY)/d" lib/pli_book_details.user.js > target/pli_book_details.chrome.user.js

deploy: test chrome
	# Deploy the parser.
	cp -f lib/* target
	scp target/* $(PLI_DEPLOY_PATH)


# Install copy of phantomjs from files when packaged version wont do.
install-phantomjs:
	echo "installing CasperJS 1.1-beta1"
	mkdir -p bin
	wget http://phantomjs.googlecode.com/files/phantomjs-1.9.0-linux-x86_64.tar.bz2
	tar -xvf phantomjs-1.9.0-linux-x86_64.tar.bz2
	sudo mv phantomjs-1.9.0-linux-x86_64/bin/phantomjs bin/phantomjs190
	bin/phantomjs190 --version
	ls -la bin/phantomjs190

# Install local copy of casperjs.
install-casperjs:
	echo "installing PhantomJS 1.9.0"
	mkdir -p casperjs
	wget https://github.com/n1k0/casperjs/tarball/1.1-beta1 -O casperjs-1.1-beta1.tgz
	tar -xvf casperjs-1.1-beta1.tgz -C casperjs --strip-components 1

