.PHONY: default test casperjs jshint

default: test

test: casperjs jshint

casperjs:

ifdef CASPERJS
	$(CASPERJS) test tests/
else 
	casperjs test tests
endif

jshint: jshint .
